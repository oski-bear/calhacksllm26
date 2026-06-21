# Benefit Card Creation Guide For LLMs

Use this guide when adding a new benefit program card to BridgeBenefits. The goal is not just to make a pretty card. A good card is a compact, defensible product surface that connects:

- official eligibility rules
- official application and rules links
- value and time estimates
- document checklist
- program logo/brand
- backend eligibility logic
- frontend display metadata

Do not guess eligibility. If you cannot find an official rule, mark it as unknown, conservative, or "may qualify" rather than inventing a confident rule.

## Files To Touch

- `backend/programs.py`: canonical program catalog and rule data.
- `backend/eligibility.py`: only touch when the new program needs rule logic the engine does not already support.
- `frontend/src/data/programMetadata.js`: frontend-only card metadata, links, logo path, impact/time/value copy.
- `frontend/src/screens/Dashboard.jsx`: only touch if the new program needs a new custom impact calculation or custom document checklist.
- `frontend/public/program-logos/`: local logo assets used by cards.
- `frontend/public/program-logos/SOURCES.md`: source notes for every logo asset.
- `scripts/verify_demo.py`: add assertions if the new card is part of the judged demo path.
- `README.md` or `DEMO.md`: update if the new program changes the pitch/demo.

## Step 1: Pick The Program ID

Create a short lowercase stable id. Use this same id everywhere.

Good examples:

- `calfresh`
- `wic`
- `medical`
- `care_fera`
- `liheap`

Avoid spaces, slashes, and display names as ids. The id connects backend results, frontend metadata, document checklist, application status, and auto-apply code.

## Step 2: Gather Official Sources

For each program, collect these URLs before coding:

- Official application portal or "how to apply" page.
- Official eligibility/rules page or PDF.
- Official benefit amount table, if the card shows dollar value.
- Official document/proof requirements, if available.
- Official logo or brand toolkit asset.

Preferred sources:

- `.gov`, `ca.gov`, county agency pages, official program portals.
- PDFs linked from agencies.
- Official brand/media/toolkit pages.

Avoid:

- Random logo sites unless no official asset exists.
- Blog posts for eligibility rules unless only used as non-authoritative context.
- Old PDF years. Check effective dates.

Write source URLs into the code comments or docs when the number is likely to be challenged in judging.

## Step 3: Extract Rules From The Rules PDF/Page

Turn the official rules into structured facts. At minimum, capture:

- Income test:
  - gross or net income
  - monthly or annual
  - household-size table
  - effective dates
  - extra-person increment beyond table max
- Categorical or adjunctive eligibility:
  - examples: Medi-Cal, CalFresh, CalWORKs, SSI
- Household/person requirements:
  - age
  - pregnancy
  - disability
  - student status
  - children in household
  - residency/county/state
- Citizenship/immigration rule:
  - required, not required, or mixed.
- Asset/resource limits:
  - household size differences if relevant.
- Waitlist or appointment limitation:
  - if staff must confirm eligibility, say so.
- Final authority:
  - county, local agency, state office, federal agency.

If rules are complex, include the citation in the user-facing reason:

```txt
Source: California WIC income guidelines, 2026-05-01 to 2027-06-30 (185% FPL).
```

## Step 4: Add Backend Program Data

Edit `backend/programs.py` and add or update an object in `PROGRAMS`.

Required display fields:

```python
{
    "id": "program_id",
    "name": "Human Program Name",
    "agency": "Agency Name",
    "category": "Food",
    "estimate": "Short value statement",
    "description": "One-sentence plain-English benefit description.",
    "requirements": [
        {"id": "address", "label": "Home address", "type": "text"},
        {"id": "proof", "label": "Proof of eligibility", "type": "file"},
    ],
    "rules": {},
}
```

Use existing rule fields when possible:

```python
"rules": {
    "income_limit_monthly": {1: 2461, 2: 3337},
    "income_limit_monthly_extra": 876,
    "income_limit_pct_fpl": 185,
    "adjunctive_programs": ["Medi-Cal", "CalFresh / SNAP", "CalWORKs"],
    "citizenship_required": False,
    "requires_dependents": False,
    "requires_condition": "pregnant_or_child_under_5",
    "asset_limit": 2000,
    "waitlist": False,
    "source": "Official source name and effective dates.",
}
```

If the existing engine cannot express the rule, update `backend/eligibility.py` carefully. Keep the new rule data-driven if possible. Do not bury program-specific magic inside frontend code.

## Step 5: Decide Status Behavior

The eligibility engine returns `eligible`, `maybe`, or `not_eligible`.

Use `eligible` only when the rule match is strong enough:

- user is under income/resource limit
- categorical condition is satisfied
- residency/citizenship rule is satisfied or not required
- no waitlist cap

Use `maybe` when:

- a final appointment/interview decides
- proof is missing
- income is close to the limit
- immigration/citizenship is complex
- program has a waitlist
- local rules may vary

Use `not_eligible` when:

- core categorical requirement is missing
- income/assets clearly exceed limit
- program explicitly excludes the user scenario

## Step 6: Add Frontend Metadata

Edit `frontend/src/data/programMetadata.js` and add a matching key:

```js
program_id: {
  logoText: 'Fallback',
  logoSrc: '/program-logos/program-logo.png',
  logoAlt: 'Program logo',
  logoPadding: 0.3,
  brandColor: '#123456',
  brandBg: '#f5f7fb',
  applyUrl: 'https://official.apply.url/',
  applyLabel: 'Apply on Official Portal',
  rulesUrl: 'https://official.rules.pdf',
  rulesLabel: 'Eligibility rules PDF',
  applicationTime: '15 minutes',
  applicationMinutes: 15,
  impactLabel: 'Estimated monthly value',
  impactNote: 'Explain what this number means and what it does not guarantee.',
  infoTitle: 'Program at a glance',
  info: 'Plain-English explanation and final authority.',
}
```

Keep the info tooltip short. It should answer:

- what the benefit is
- who confirms final eligibility
- one trust caveat

## Step 7: Add Impact/Value Estimate

Cards currently show:

- application time
- estimated value
- note explaining limitations

If the value is a simple static estimate, put it in `programMetadata.js`:

```js
monthlyValue: 83,
estimatedSavings: '$83/month',
summaryLabel: 'Program value',
```

If value depends on household size or conditions, add a helper in `buildProgramImpact()` inside `frontend/src/screens/Dashboard.jsx`.

Examples:

- CalFresh uses `monthlyValueByHousehold` and household size.
- WIC sums fruit/vegetable benefits for pregnant adults and children ages 1-5.

Rules for value copy:

- Say "estimated", "up to", or "may receive" unless exact.
- State the unit: `/month`, `/year`, one-time, discount, coverage.
- Add a limitation note: "Final county benefit may be lower."
- Do not treat health coverage as cash savings unless you have a defensible source.

## Step 8: Add The Document Checklist

If the program appears in the judged auto-apply flow, add a checklist in `DOCUMENT_CHECKLISTS` in `Dashboard.jsx`.

Checklist format:

```js
program_id: {
  title: 'Documents to bring or upload',
  note: 'Short explanation of when these are needed.',
  items: [
    'Photo ID',
    'Proof of address',
    'Proof of income',
  ],
}
```

Checklist sources should come from application instructions, rules PDFs, or agency pages. If an item is sometimes required, say "if requested".

Good wording:

- "Proof of income, or active Medi-Cal / CalFresh / CalWORKs card"
- "Immigration document only for noncitizens applying for benefits"
- "Medical form from provider, if requested"

Bad wording:

- "Upload all documents now" if the actual portal does not require that.
- "Required" when the agency says "may ask".

## Step 9: Get The Logo

Find an official transparent or vector asset if possible.

Process:

1. Search official program or agency site for `logo`, `brand`, `media toolkit`, `toolkit`, `png`, `svg`.
2. Download into `frontend/public/program-logos/`.
3. Prefer SVG or PNG with alpha transparency.
4. If the PNG has transparent padding, crop only transparent canvas margin. Do not alter colors, text, proportions, or fonts.
5. Add the file path to `logoSrc`.
6. Add a source entry in `frontend/public/program-logos/SOURCES.md`.

Example source note:

```md
- `california-wic.png`: California WIC logo from the official CDPH WIC media toolkit, `https://...`.
- `california-wic-trimmed.png`: Same WIC logo with only transparent canvas margins cropped for the card badge.
```

Logo UI behavior:

- `ProgramBrand` renders the logo inside a circular badge.
- Use `logoPadding` to tune fit.
- Use `brandColor` for the badge border.
- Keep `logoAlt` accurate for accessibility.

## Step 10: Add Application Links

Every card should have:

- an official apply/how-to-apply link
- a rules/eligibility link

These are displayed by `ProgramLinks` in `Dashboard.jsx`.

Do not link only to a generic agency homepage if a specific program page exists. If the application happens through a shared portal, label it clearly:

- "Apply on BenefitsCal"
- "How to get WIC"
- "Apply for CARE/FERA"
- "Eligibility rules PDF"

## Step 11: Decide Whether Auto-Apply Is Real

Set `"auto_apply": True` in `backend/programs.py` only if the agent can demonstrate the flow.

For a new end-to-end program, you also need:

- portal URL in `backend/agent.py`
- route pattern in `backend/agent.py`
- mock portal HTML in `backend/mock/`
- field mapping in `field_values()`
- step labels in `STEPS`
- confirmation text
- verification/evidence assertions
- saved application proof behavior

If you cannot build that in time, leave `auto_apply` false and show:

- official links
- rules tooltip
- document checklist if helpful
- clear "Start application" button

## Step 12: Update Tests

For demo-critical cards, update `scripts/verify_demo.py` to assert:

- program name appears
- logo alt text appears
- official apply link appears
- rules link appears
- application time appears
- estimated value appears
- document checklist appears
- auto-apply button appears, if applicable

Run:

```sh
cd frontend && npm run lint
cd frontend && PATH="/Users/study/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run build
venv/bin/python -m unittest discover -s tests
```

If frontend build fails on local Node, use the bundled Node path shown above.

## Step 13: Visual Check

Use Playwright or the browser to load the demo profile and inspect:

- logo is legible
- card title does not wrap awkwardly
- value and time are visible above the fold
- tooltip works
- document checklist does not crowd the card
- official links open in new tabs
- mobile layout does not overflow

Save a screenshot if the card is part of judging.

## Step 14: Pitch Check

Before calling it done, make sure the card tells a five-second story:

- "What do I get?"
- "How much could it be worth?"
- "How long does applying normally take?"
- "Why do you think I qualify?"
- "What proof do I need?"
- "Where did the rules come from?"
- "Can the agent actually help me apply?"

If any answer is missing, the card is incomplete.

## Template Prompt For Another LLM

Use this when handing off to Claude/Codex:

```txt
Add a BridgeBenefits card for [PROGRAM].

Follow AI SLOP/benefit_card_creation_guide_for_llms.md.

Use only official sources for eligibility rules, application links, benefit amounts, document requirements, and logo/brand assets. Add backend rules to backend/programs.py, frontend metadata to frontend/src/data/programMetadata.js, local logo assets to frontend/public/program-logos/, source notes to frontend/public/program-logos/SOURCES.md, and tests/checks if this card is demo-critical.

Do not guess eligibility. If a rule is uncertain, mark the program as maybe or write a conservative caveat. Keep final eligibility authority clear.

After implementation, run lint/build/tests and visually inspect the dashboard.
```

