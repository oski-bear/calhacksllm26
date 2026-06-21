"""The eligibility engine.

Given a user's info, decide each program's status ('eligible', 'maybe', or
'not_eligible') using the rules in programs.py, and explain why.

The intake form sends a rich household model (per-member ages, conditions,
income; plus household expenses and assets). We build a `household` context
from it and use it for condition-, asset-, and expense-aware rules. When the
rich data is absent we fall back to the flat fields (income, householdSize,
citizenship) so older payloads still work.
"""

from programs import PROGRAMS

# 2024 Federal Poverty Guidelines (annual, 48 contiguous states).
FPL_BASE = 15060          # 1-person household
FPL_PER_ADDITIONAL = 5380  # added per extra person

# Status ordering, worst-last. Used to "downgrade" a result.
STATUS_ORDER = ["eligible", "maybe", "not_eligible"]

CURRENT_YEAR = 2026

# How many times a given pay/expense frequency occurs per year.
PER_YEAR = {"weekly": 52, "biweekly": 26, "semimonthly": 24, "monthly": 12, "yearly": 1}

# Condition labels as sent by the frontend (data/screenerOptions.js).
COND_PREGNANT = "Pregnant"
COND_DISABLED = "Has a disability / long-term illness"
COND_BLIND = "Blind or visually impaired"
COND_VETERAN = "Veteran or active military"


def federal_poverty_level(household_size):
    """Annual Federal Poverty Level for a given household size."""
    size = max(1, household_size)
    return FPL_BASE + (size - 1) * FPL_PER_ADDITIONAL


def _to_int(value, default=0):
    """Parse a form value (often a string) into an int, with a fallback."""
    try:
        return int(float(value))
    except (TypeError, ValueError):
        return default


def _to_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _downgrade(status, floor):
    """Return whichever status is worse: the current one or `floor`."""
    return status if STATUS_ORDER.index(status) >= STATUS_ORDER.index(floor) else floor


def _monthly_limit(table, extra, size):
    """Look up the gross-monthly income limit for a household size, extending
    past the largest tabulated size with the per-person increment."""
    size = max(1, size)
    if size in table:
        return table[size]
    max_size = max(table)
    return table[max_size] + extra * (size - max_size)


def build_household(user):
    """Derive a context dict from the rich intake payload (members/expenses/assets)."""
    members = user.get("members") or []

    ages = []
    conditions = set()
    for m in members:
        birth_year = m.get("birthYear")
        if birth_year:
            ages.append(CURRENT_YEAR - _to_int(birth_year, CURRENT_YEAR))
        for c in (m.get("conditions") or []):
            conditions.add(c)

    monthly_expenses = 0.0
    for e in (user.get("expenses") or []):
        amount = _to_float(e.get("amount"))
        per_year = PER_YEAR.get(e.get("frequency"), 12)
        monthly_expenses += amount * per_year / 12

    return {
        "has_rich_data": bool(members),
        "ages": ages,
        "has_child_under_5": any(a < 5 for a in ages),
        "has_child_under_18": any(a < 18 for a in ages),
        "has_senior_65": any(a >= 65 for a in ages),
        "pregnant": COND_PREGNANT in conditions,
        "disabled": COND_DISABLED in conditions,
        "blind": COND_BLIND in conditions,
        "veteran": COND_VETERAN in conditions,
        "monthly_expenses": monthly_expenses,
        "assets": _to_float(user.get("assets")),
    }


def _check_condition(req_cond, hh, status, reasons):
    """Apply a `requires_condition` rule. Returns the (possibly updated) status."""
    if req_cond == "pregnant_or_child_under_5":
        if not hh["has_rich_data"]:
            reasons.append("WIC requires a pregnant household member or a child under 5.")
            return _downgrade(status, "maybe")
        if hh["pregnant"] or hh["has_child_under_5"]:
            reasons.append("Someone in your household is pregnant or has a child under 5.")
            return status
        reasons.append("WIC is for pregnant people, new parents, and children under 5.")
        return "not_eligible"

    if req_cond == "disabled_blind_or_senior":
        if not hh["has_rich_data"]:
            reasons.append("SSI requires a household member who is disabled, blind, or 65+.")
            return _downgrade(status, "maybe")
        if hh["disabled"] or hh["blind"] or hh["has_senior_65"]:
            reasons.append("A household member is disabled, blind, or 65 or older.")
            return status
        reasons.append("SSI is for people who are disabled, blind, or 65 or older.")
        return "not_eligible"

    return status


def evaluate_program(program, user, hh):
    """Return (status, reasons) for one program."""
    rules = program["rules"]
    income = _to_int(user.get("income"))
    household = _to_int(user.get("householdSize"), default=1)
    citizenship = user.get("citizenship", "")
    is_undocumented = citizenship == "Other / Undocumented"

    reasons = []

    # 0. Adjunctive (automatic) income eligibility: receiving certain benefits
    #    makes a household income-eligible regardless of the dollar amount.
    current_benefits = user.get("currentBenefits") or []
    adjunctive = set(rules.get("adjunctive_programs") or [])
    adjunct_match = sorted(adjunctive.intersection(current_benefits))

    # 1. Income test — accurate gross-monthly table when available, else the
    #    legacy % -of-poverty-level math.
    monthly_table = rules.get("income_limit_monthly")
    if adjunct_match:
        status = "eligible"
        reasons.append(
            f"Automatically income-eligible because your household already "
            f"receives {', '.join(adjunct_match)}."
        )
    elif monthly_table:
        monthly_income = income / 12
        limit_m = _monthly_limit(
            monthly_table, rules.get("income_limit_monthly_extra", 0), household
        )
        if monthly_income <= limit_m:
            status = "eligible"
            reasons.append(
                f"Gross monthly income ${monthly_income:,.0f} is within the "
                f"${limit_m:,.0f} limit for a household of {household}."
            )
        elif monthly_income <= limit_m * 1.05:
            status = "maybe"
            reasons.append(
                f"Gross monthly income ${monthly_income:,.0f} is just over the "
                f"${limit_m:,.0f} limit — deductions may still qualify you."
            )
        else:
            status = "not_eligible"
            reasons.append(
                f"Gross monthly income ${monthly_income:,.0f} is above the "
                f"${limit_m:,.0f} limit for a household of {household}."
            )
    else:
        limit = federal_poverty_level(household) * rules["income_limit_pct_fpl"] / 100
        if income <= limit:
            status = "eligible"
            reasons.append(
                f"Income ${income:,} is within the ${int(limit):,} limit for a "
                f"household of {household} ({rules['income_limit_pct_fpl']}% of the "
                f"poverty level)."
            )
        elif income <= limit * 1.25:
            status = "maybe"
            reasons.append(
                f"Income ${income:,} is a little over the ${int(limit):,} limit — "
                f"you may still qualify depending on deductions."
            )
        else:
            status = "not_eligible"
            reasons.append(
                f"Income ${income:,} is above the ${int(limit):,} limit for a "
                f"household of {household}."
            )

    # 2. Citizenship.
    if rules["citizenship_required"] and is_undocumented:
        status = _downgrade(status, "maybe")
        reasons.append(
            "This program usually requires citizenship or qualified immigrant "
            "status — you may still qualify through a state program."
        )
    elif not rules["citizenship_required"]:
        reasons.append("Open to all California residents regardless of immigration status.")

    # 3. Programs that need a child in the home.
    if rules["requires_dependents"]:
        # Prefer the real per-member data; fall back to household size.
        has_child = hh["has_child_under_18"] if hh["has_rich_data"] else household >= 2
        if not has_child:
            status = "not_eligible"
            reasons.append("This program is for families with children in the home.")
        else:
            status = _downgrade(status, "maybe")
            reasons.append("Requires a child in the home — confirm dependents to qualify.")

    # 4. Condition requirements (pregnancy, disability, age) — uses rich data.
    req_cond = rules.get("requires_condition")
    if req_cond:
        status = _check_condition(req_cond, hh, status, reasons)

    # 5. Asset limit (e.g. SSI) — only when we have a real assets figure.
    asset_limit = rules.get("asset_limit")
    if asset_limit is not None and hh["has_rich_data"] and hh["assets"] > 0:
        effective_limit = asset_limit if household < 2 else asset_limit + 1000
        if hh["assets"] > effective_limit:
            status = "not_eligible"
            reasons.append(
                f"Assets ${hh['assets']:,.0f} are above the "
                f"${effective_limit:,.0f} limit for this program."
            )
        else:
            reasons.append(
                f"Assets ${hh['assets']:,.0f} are within the "
                f"${effective_limit:,.0f} limit."
            )

    # 6. Shelter/expense deduction note (CalFresh) — can rescue a "maybe".
    if rules.get("uses_shelter_deduction") and hh["has_rich_data"] and hh["monthly_expenses"] > 0:
        reasons.append(
            f"Your ~${hh['monthly_expenses']:,.0f}/mo in rent, utilities, and other "
            f"expenses lowers your countable income and can help you qualify."
        )
        if status == "maybe":
            status = "eligible"
            reasons.append("After expense deductions, you likely fall under the limit.")

    # 7. Waitlisted programs can never be a sure thing.
    if rules["waitlist"] and status == "eligible":
        status = "maybe"
        reasons.append("Worth applying, but expect a long waitlist.")

    # 8. Citation for the rule receipt.
    source = rules.get("source")
    if source:
        reasons.append(f"Source: {source}")

    return status, reasons


def evaluate_all(user):
    """Run every program through the engine and return frontend-ready dicts."""
    hh = build_household(user)
    results = []
    for program in PROGRAMS:
        status, reasons = evaluate_program(program, user, hh)
        results.append(
            {
                "id": program["id"],
                "name": program["name"],
                "agency": program["agency"],
                "category": program["category"],
                "estimate": program["estimate"],
                "description": program["description"],
                "requirements": program["requirements"],
                "status": status,
                "reasons": reasons,
                "auto_apply": program.get("auto_apply", False),
            }
        )
    return results
