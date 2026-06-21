"""The eligibility engine.

Given a user's info, decide each program's status ('eligible', 'maybe', or
'not_eligible') using the rules in programs.py, and explain why.
"""

from programs import PROGRAMS

# 2024 Federal Poverty Guidelines (annual, 48 contiguous states).
FPL_BASE = 15060          # 1-person household
FPL_PER_ADDITIONAL = 5380  # added per extra person

# Status ordering, worst-last. Used to "downgrade" a result.
STATUS_ORDER = ["eligible", "maybe", "not_eligible"]


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


def _downgrade(status, floor):
    """Return whichever status is worse: the current one or `floor`."""
    return status if STATUS_ORDER.index(status) >= STATUS_ORDER.index(floor) else floor


def evaluate_program(program, user):
    """Return (status, reasons) for one program."""
    rules = program["rules"]
    income = _to_int(user.get("income"))
    household = _to_int(user.get("householdSize"), default=1)
    citizenship = user.get("citizenship", "")
    is_undocumented = citizenship == "Other / Undocumented"

    reasons = []

    # 1. Income vs. the program's limit (a % of the poverty level).
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

    # 3. Programs that need a child in the home (approximated from household size).
    if rules["requires_dependents"]:
        if household < 2:
            status = "not_eligible"
            reasons.append("This program is for families with children in the home.")
        else:
            status = _downgrade(status, "maybe")
            reasons.append("Requires a child in the home — confirm dependents to qualify.")

    # 4. Waitlisted programs can never be a sure thing.
    if rules["waitlist"] and status == "eligible":
        status = "maybe"
        reasons.append("Worth applying, but expect a long waitlist.")

    return status, reasons


def evaluate_all(user):
    """Run every program through the engine and return frontend-ready dicts."""
    results = []
    for program in PROGRAMS:
        status, reasons = evaluate_program(program, user)
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
            }
        )
    return results
