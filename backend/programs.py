"""Program catalog with eligibility rules as plain data.

Each program has display metadata (mirrors the frontend's mockPrograms shape)
plus a `rules` dict the eligibility engine reads. Keeping rules as data makes
them easy to read, tweak, and later load from a database or RAG store.

Rule fields:
  income_limit_pct_fpl : gross annual income must be <= this % of the Federal
                         Poverty Level (for the household size) to be eligible.
  citizenship_required : if True, undocumented applicants drop to "maybe".
  requires_dependents  : if True, the program needs a child in the home
                         (we approximate this from household size).
  waitlist             : if True, cap the best result at "maybe" (long waitlist).
"""

PROGRAMS = [
    {
        "id": "calfresh",
        "name": "CalFresh (SNAP)",
        "agency": "CA Dept. of Social Services",
        "category": "Food",
        "estimate": "Up to the household max monthly grocery benefit",
        "auto_apply": True,
        "description": "Monthly money on an EBT card to buy groceries.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "address", "label": "Home address", "type": "text"},
            {"id": "w2", "label": "W-2 form", "type": "file"},
            {"id": "paystub", "label": "Recent pay stub", "type": "file"},
        ],
        "rules": {
            # Accurate CA broad-based categorical eligibility (MCE) 200% FPL
            # GROSS MONTHLY income limits, effective 2025-10-01 to 2026-09-30.
            "income_limit_monthly": {
                1: 2610, 2: 3526, 3: 4442, 4: 5360,
                5: 6276, 6: 7192, 7: 8110, 8: 9026,
            },
            "income_limit_monthly_extra": 918,  # per person beyond 8
            # Receiving these makes the household categorically eligible.
            "adjunctive_programs": ["CalWORKs", "SSI / SSDI", "CalFresh / SNAP"],
            "citizenship_required": True,
            "requires_dependents": False,
            "waitlist": False,
            # CA CalFresh deducts shelter/utility/medical costs from countable
            # income, so high expenses can pull someone over the gross limit
            # back into eligibility on the net-income test.
            "uses_shelter_deduction": True,
            "source": "Santa Clara County CalFresh Income Eligibility chart, "
            "2025-10-01 to 2026-09-30 (200% FPL CA MCE gross monthly).",
        },
    },
    {
        "id": "wic",
        "name": "WIC",
        "agency": "CA Dept. of Public Health",
        "category": "Food",
        "estimate": "WIC food package + produce benefit + nutrition support",
        "auto_apply": True,
        "description": (
            "Food, nutrition counseling, and breastfeeding support for pregnant "
            "people, new parents, and children under 5."
        ),
        "requirements": [
            {"id": "address", "label": "Home address", "type": "text"},
            {"id": "proof", "label": "Proof of pregnancy or child's age", "type": "file"},
        ],
        "rules": {
            # Accurate WIC 185% FPL GROSS MONTHLY income limits,
            # effective 2026-05-01 to 2027-06-30 (California WIC).
            "income_limit_monthly": {
                1: 2461, 2: 3337, 3: 4212, 4: 5088,
                5: 5964, 6: 6839, 7: 7715, 8: 8591, 9: 9467,
            },
            "income_limit_monthly_extra": 876,  # per person beyond 9
            # Adjunctive (automatic) income eligibility if on any of these.
            "adjunctive_programs": ["Medi-Cal", "CalFresh / SNAP", "CalWORKs"],
            "citizenship_required": False,  # WIC never asks immigration status
            "requires_dependents": False,
            "waitlist": False,
            # Categorical: must be pregnant or have a child under 5.
            "requires_condition": "pregnant_or_child_under_5",
            "source": "California WIC income guidelines, 2026-05-01 to 2027-06-30 "
            "(185% FPL); adjunctive eligibility via Medi-Cal/CalFresh/CalWORKs.",
        },
    },
    {
        "id": "ssi",
        "name": "SSI (Supplemental Security Income)",
        "agency": "Social Security Administration",
        "category": "Cash Aid",
        "estimate": "Up to ~$1,182 / month (CA)",
        "description": (
            "Monthly cash for people who are disabled, blind, or 65+ with very "
            "low income and limited assets."
        ),
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "income", "label": "Proof of income", "type": "file"},
        ],
        "rules": {
            "income_limit_pct_fpl": 100,
            "citizenship_required": True,
            "requires_dependents": False,
            "waitlist": False,
            # Must be disabled, blind, or 65+, AND under the asset limit.
            "requires_condition": "disabled_blind_or_senior",
            "asset_limit": 2000,  # individual; +1000 for 2+ household
        },
    },
    {
        "id": "medical",
        "name": "Medi-Cal",
        "agency": "CA Dept. of Health Care Services",
        "category": "Health",
        "estimate": "Free / low-cost coverage",
        "description": "Free or low-cost health insurance.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "income", "label": "Proof of income", "type": "file"},
        ],
        # California offers Medi-Cal regardless of immigration status, so
        # citizenship is not required here.
        "rules": {
            "income_limit_pct_fpl": 138,
            "citizenship_required": False,
            "requires_dependents": False,
            "waitlist": False,
        },
    },
    {
        "id": "liheap",
        "name": "Energy Assistance (LIHEAP)",
        "agency": "CA Dept. of Community Services",
        "category": "Utilities",
        "estimate": "Up to $1,000 / year",
        "description": "Help paying gas and electric bills.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "utilitybill", "label": "Recent utility bill", "type": "file"},
        ],
        "rules": {
            "income_limit_pct_fpl": 200,
            "citizenship_required": False,
            "requires_dependents": False,
            "waitlist": False,
        },
    },
    {
        "id": "lifeline",
        "name": "California LifeLine",
        "agency": "CA Public Utilities Commission",
        "category": "Utilities",
        "estimate": "Discounted phone / internet",
        "description": "Monthly discount on your phone or home internet bill.",
        "requirements": [
            {"id": "address", "label": "Home address", "type": "text"},
            {"id": "proof", "label": "Proof of program participation", "type": "file"},
        ],
        "rules": {
            "income_limit_pct_fpl": 150,
            "citizenship_required": False,
            "requires_dependents": False,
            "waitlist": False,
        },
    },
    {
        "id": "calworks",
        "name": "CalWORKs",
        "agency": "CA Dept. of Social Services",
        "category": "Cash Aid",
        "estimate": "Varies by household",
        "description": "Monthly cash aid for families with children.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "children", "label": "Number and ages of children", "type": "text"},
        ],
        "rules": {
            "income_limit_pct_fpl": 100,
            "citizenship_required": True,
            "requires_dependents": True,
            "waitlist": False,
        },
    },
    {
        "id": "section8",
        "name": "Section 8 Housing",
        "agency": "U.S. Dept. of Housing (HUD)",
        "category": "Housing",
        "estimate": "Rent assistance",
        "description": "Help paying rent in the private market.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "income", "label": "Proof of income", "type": "file"},
        ],
        "rules": {
            "income_limit_pct_fpl": 80,
            "citizenship_required": True,
            "requires_dependents": False,
            "waitlist": True,
        },
    },
]
