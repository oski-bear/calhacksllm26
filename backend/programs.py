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
        "estimate": "Up to $291 / month",
        "description": "Monthly money on an EBT card to buy groceries.",
        "requirements": [
            {"id": "ssn", "label": "Social Security Number", "type": "ssn"},
            {"id": "address", "label": "Home address", "type": "text"},
            {"id": "w2", "label": "W-2 form", "type": "file"},
            {"id": "paystub", "label": "Recent pay stub", "type": "file"},
        ],
        "rules": {
            "income_limit_pct_fpl": 200,
            "citizenship_required": True,
            "requires_dependents": False,
            "waitlist": False,
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
