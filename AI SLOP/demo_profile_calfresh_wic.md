# Demo Profile — Qualifies for BOTH CalFresh + WIC

Reverse-engineered persona for the hackathon judge demo. Every value is chosen
so the household cleanly clears **both** programs' real 2025–2026 rules, and so
an AI agent has every field it needs to draft the CalFresh (CF 285) application
and a WIC appointment/application request.

Rule reference: [calfresh_wic_rules_and_form_fields.md](calfresh_wic_rules_and_form_fields.md)

---

## The persona — "Maria Reyes"

A pregnant mother of one toddler, working part-time, not yet receiving any aid.
First-time applicant — the most sympathetic, judge-legible story.

| Fact | Value |
|---|---|
| Household size | **3** (Maria + toddler + partner) |
| Location | Berkeley, **Alameda County**, ZIP 94704, California |
| Housing | Renter, $1,800/mo rent + $200/mo utilities |
| Annual gross income | **$28,000** (≈ $2,333 / month) |
| Currently on benefits | None (first-time applicant) |
| Citizenship | U.S. Citizen (WIC doesn't ask) |
| Liquid assets | $900 |

### Household members

| # | Name | Relationship | DOB | Age | Category / conditions |
|---|---|---|---|---|---|
| 1 | Maria Reyes | Self (applicant) | 1994-03 | 32 | **Pregnant** (due ~Nov 2026) |
| 2 | Mateo Reyes | Child | 2024-02 | 2 | **Child under 5** |
| 3 | Luis Reyes | Spouse / partner | 1992-07 | 34 | — |

### Income detail (what the agent collects)

| Person | Source | Type | Amount | Frequency | Annualized |
|---|---|---|---|---|---|
| Maria | Earned | Wages / salary | $1,400 | Monthly | $16,800 |
| Luis | Earned | Gig / contract work | $215 | Weekly | $11,180 |
| | | | | **Total** | **≈ $27,980** |

---

## Why she clears BOTH (the math)

### CalFresh ✅ Likely eligible
- **Rule:** CA broad-based categorical eligibility, **200% FPL gross monthly**.
- **Limit (household 3):** $4,442 / mo.
- **Her income:** $2,333 / mo → **under the limit**.
- **Bonus:** $2,000/mo rent + utilities feed the shelter deduction (raises benefit, can rescue borderline cases on the net test).
- **Source:** Santa Clara County CalFresh chart, 2025-10-01 → 2026-09-30.

### WIC ✅ Likely eligible
- **Categorical:** pregnant person **and** a child under 5 → two qualifying participants (Maria + Mateo).
- **Income rule:** **185% FPL gross monthly**.
- **Limit (household 3):** $4,212 / mo.
- **Her income:** $2,333 / mo → **under the limit**.
- *(A pregnant applicant may also count the unborn child, making household 4 — even more headroom — but she already qualifies at 3.)*
- **Source:** California WIC income guidelines, 2026-05-01 → 2027-06-30.

> Verified live against our engine (`POST /api/eligibility`): both return
> `status: "eligible"` with the cited reasons above.

### The clean-demo lever
She is **income-eligible outright**, so the demo doesn't depend on adjunctive
eligibility. If you want an even more bulletproof "instant yes," set her as
already receiving **Medi-Cal** — that triggers **WIC adjunctive eligibility**
(automatic income pass) and CalFresh categorical eligibility, and the receipt
reads "Automatically income-eligible because your household receives Medi-Cal."

---

## Field-by-field values for the AI agent

These map to the intake schemas in the rules doc, so an agent can prefill the
CF 285 and a WIC request end to end.

### Shared / contact
- legal_first_name: `Maria` · legal_last_name: `Reyes`
- date_of_birth: `1994-03-15`
- email: `maria.reyes@example.com` · cell_phone: `(510) 555-0148` · text_permission: `yes`
- home_address: `2120 Dwight Way, Apt 4` · city: `Berkeley` · state: `CA` · zip: `94704` · county: `Alameda`
- homeless: `no` · preferred_language: `Spanish` · interpreter_needed: `yes`

### CalFresh-specific
- household members: 3 (table above), all buy/prepare food together
- applying_for_benefits: Maria `yes`, Mateo `yes`, Luis `yes`
- ssn: provided for applying members
- gross monthly income: `$2,333` (2 jobs, see income table)
- rent: `$1,800/mo` · utilities (heating/cooling separate): `yes, $200/mo`
- pregnant: `yes` (Maria) · dependent_child_under_14: `yes` (Mateo)
- expedited screen: income > $150 and resources > $100 → **not** expedited (note it was checked)
- disqualification questions: all `no`
- documents needed: identity, SSNs, CA residency proof, last-30-day pay stubs, rent proof, utility bill

### WIC-specific
- lives_in_california: `yes` · county: `Alameda` · action_requested: `apply for WIC`
- participants:
  - Maria — category `pregnant`, expected_due_date `2026-11`
  - Mateo — category `child under 5`, DOB `2024-02-10`
- receives_medi_cal / calfresh / calworks: `no` (income-eligible path)
- best_contact_method: `text` · best_contact_time: `morning`
- documents for first appointment: photo ID (Maria + Mateo), proof of address, proof of income (pay stubs), proof of pregnancy (provider note)

---

## How this drives the demo

1. Judge sees the intake (prefilled with Maria) → submit.
2. Dashboard surfaces **CalFresh** and **WIC** as "Likely eligible" with cited rule receipts.
3. "Start application" → the AI agent drafts the application using the field
   values above and fills a review-only portal mock, stopping before submit.

> Safety stance (from the rules doc): never say "you definitely qualify" and
> never auto-submit a real government application — draft + review only.
