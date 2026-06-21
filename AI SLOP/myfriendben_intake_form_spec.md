# MyFriendBen Intake Form — Explicit Implementation Spec

Reverse-engineered from the live IL screener (`screener.myfriendben.org/il/step-N`) and the
open-source frontend repo: **github.com/MyFriendBen/benefits-calculator** (React + TypeScript).
This documents *exactly* how they built the intake flow and *every field they collect*, so we
can ask for the same information.

> Source of truth note: MyFriendBen is **white-label + config-driven**. The page *structure*
> and field *types* are hardcoded in React components; the **option lists** (income types,
> expense types, conditions, insurance, benefits, immediate needs, counties) are fetched per
> deployment from the backend via `useConfig('<key>')`. The 13 config option-sets are listed
> at the bottom.

---

## 1. Tech stack & architecture

| Concern | How they do it |
|---|---|
| Framework | React + TypeScript |
| UI library | MUI (Material UI) — `TextField`, `Select`, `Radio`, custom `MultiSelectTiles` |
| Forms / validation | `react-hook-form` + `Controller`, with a Yup-style schema per step |
| i18n | `react-intl` (`<FormattedMessage>`) — every label is translatable |
| Number inputs | `react-number-format` (`NumericFormat`) for currency/age/year |
| Flow control | One **routed step per URL** (`/il/step-3`, `/step-4` …), driven by a `stepDirectory` array |
| Config | `useConfig(key)` pulls option lists from the backend (white-label per state/partner) |

**Key insight for us:** it is *not* one giant form — it's a routed wizard. The step order
lives in a single `stepDirectory` array and step numbers **start at 3** (`STARTING_QUESTION_NUMBER = 3`)
because steps 1–2 are language select + disclaimer/landing.

---

## 2. The exact step flow (the `stepDirectory`)

Canonical `QuestionName` union (the whole screener), in order:

| # (URL) | Step key | What it collects |
|---|---|---|
| 1 | `selectLanguage` | Language picker (pre-flow) |
| 2 | `disclaimer` | Privacy/landing consent (pre-flow) |
| 3 | `zipcode` | Zip code **+ county** |
| 4 | `householdSize` | Number of people in household (max 8) |
| 5…N | `householdData` | **Per-member loop** — repeats once per person (the big one, see §3) |
| N+1 | `hasExpenses` | Household expenses (type + amount + frequency) |
| N+2 | `householdAssets` | Total liquid assets ($) |
| N+3 | `hasBenefits` | Benefits already received (multiselect) — *skipped if WL has no programs* |
| N+4 | `acuteHHConditions` | Immediate needs / resources wanted (multiselect) |
| N+5 | `referralSource` | How they heard about it — *skipped if referrer is preset* |
| N+6 | `signUpInfo` | Optional contact sign-up |

There is also an optional **Energy Calculator** sub-path (`energyCalculator*` steps) — not part
of the core benefits screener; ignore for us.

---

## 3. Every field, step by step

### Step 3 — `zipcode` ("Let's Get Started! / Tell us where you live.")
- **Zip Code** — text/numeric input ("What is your zip code?")
- **County** — `Select` dropdown, populated from `counties_by_zipcode` config based on the zip.

### Step 4 — `householdSize` ("Tell us about your household")
- **Household Size** — numeric input, "Including you, how many people are in your household?" (max 8).
- Rich helper copy: how to count (tax filers count everyone on the return + spouse; non-filers
  count people you live with *and* buy/prepare food with; roommates you don't share food with
  don't count).

### Steps 5…N — `householdData` (PER HOUSEHOLD MEMBER — repeats per person)
This is the heart of the form. For **each** member it collects 5 sections. Member 1 is "you",
members 2+ are "them" (relationship asked).

**A. Basic info** (`BasicInfoFields.tsx`)
- **Birth Month** — `Select` (Jan–Dec)
- **Birth Year** — numeric (`YYYY`) → they derive age from month+year, not a raw "age" field
- **Relationship to you** — `Select` from `relationship_options` config (hidden for member 1)

**B. Income** (`IncomeSection.tsx`) — "Income Sources", repeatable rows, "+ Add an Income Source"
  Each income row =
- **Income Category** — `Select` from `income_categories`
- **Income Source / type** — `Select` from `income_options_by_category` (depends on category)
- **Frequency** — `Select` from `frequency_options`: hourly, weekly, every 2 weeks (biweekly),
  twice a month (semimonthly), monthly, yearly
- **Hours per Week** — numeric (only if frequency = hourly)
- **Pre-Tax Amount** — currency
  Copy: "wages, self-employment, current benefits, child support, and any other regular payments."

**C. Health Insurance** (`HealthInsuranceSection.tsx`) — "Select all that apply"
- **MultiSelectTiles** from `health_insurance_options` config; `none` is exclusive.

**D. Special Circumstances / Conditions** (`SpecialConditionsSection.tsx`) — "Select all that apply. If none apply, skip."
- **MultiSelectTiles** from `condition_options` config (different sets for you vs. them).
- Conditional follow-up: if `disabled` selected (energy-calc workflow), asks **receivesSsi** (Yes/No radio).

**E. Student eligibility** (`StudentEligibilitySection.tsx`) — "Student Information"
- A set of Yes/No radio questions (`STUDENT_QUESTIONS`) about student status.

### Step N+1 — `hasExpenses` ("Which of the following expenses does your household have?")
- **MultiSelect of expense categories** from `expense_options_by_category`, and for each chosen:
  - **Amount** — currency
  - **Frequency** — `Select` from `frequency_options`
- Copy: "These are the expenses that can affect your benefits… enter an estimate instead of $0."

### Step N+2 — `householdAssets` ("Tell us about your household")
- **Dollar Amount** — single currency input: "How much does your whole household have right now
  in cash, checking or savings accounts, stocks, bonds, or mutual funds?"

### Step N+3 — `hasBenefits` ("Tell us some final information about your household")
- "Does anyone in your household currently receive any of these public benefits?"
- **MultiSelect tiles** from `hasBenefitsPrograms` (config/API), grouped by category + "Other".
- "Select all that apply… Leave blank if none apply."

### Step N+4 — `acuteHHConditions` / Immediate Needs ("…final information about your household")
- "Do you want / need information on any of the following resources?"
- **MultiSelect tiles** from `acute_condition_options` config (e.g. food, housing, child care,
  healthcare, family planning, job/legal/mental-health resources — exact set is config-driven).

### Step N+5 — `referralSource`
- **Select** "How did you hear about us?" from `sign_up_options`/referral config, grouped
  General vs. Partners; "Other" reveals a free-text field.

### Step N+6 — `signUpInfo` ("Sign up for benefits updates and/or feedback opportunities")
- All **OPTIONAL**: First Name, Last Name, Email, Cell Phone (text fields)
- Two consent checkboxes: email promo consent + SMS consent (with TCPA-style legal copy).

---

## 4. UI/UX patterns worth copying

- **Reusable question scaffold**: `<QuestionHeader>` (the "Tell us about your household" lead),
  `<QuestionQuestion>` (the bold question), `<QuestionDescription>` (gray helper text). Every
  step composes these — consistent hierarchy.
- **Section label (overline) → bold question → helper text → input** is the repeating rhythm.
- **`MultiSelectTiles`** (square variant) for any "select all that apply" — big tap targets with
  icons, with support for an *exclusive* value (e.g. "none" deselects the rest).
- **Progress bar**: thick bar + "Step X of 12" counter, numbering offset by `STARTING_QUESTION_NUMBER`.
- **Friendly, plain-language helper copy** on every sensitive/confusing question (household size,
  assets, expenses) — reduces fear and wrong answers.
- **Inline validation** via react-hook-form with per-field error messages under each input.
- **Conditional fields**: hours/week only when hourly; SSI only when disabled; "Other" free-text
  only when "Other" chosen.

---

## 5. The 13 config-driven option-sets (`useConfig` keys)

These are the lists served per-deployment (so exact values come from the backend, not the code):

`state`, `counties_by_zipcode`, `relationship_options`, `frequency_options`,
`income_categories`, `income_options_by_category`, `expense_options_by_category`,
`condition_options`, `acute_condition_options`, `health_insurance_options`,
`public_charge_rule`, `sign_up_options`, `language_options`.

---

## 6. Gap analysis — what WE collect now vs. what to add

Our current intake (`BasicInfoForm.jsx`) collects: name, email, age, household size,
marital status, income (single annual number), citizenship, filed-taxes, current benefits.

To match MyFriendBen's data model (and feed a real eligibility engine), we should add:

| Missing | Why it matters | Priority |
|---|---|---|
| **Zip code + county** | CA eligibility is county-specific; ours hardcodes CA | High |
| **Per-member household data** (not one flat form) | Income/conditions/insurance are per-person | High |
| **Birth month + year** (not raw age) | Drives age-based program rules precisely | Med |
| **Itemized income** (category + type + frequency + amount) | Real eligibility needs gross income by source/frequency, not one annual figure | High |
| **Household expenses** (type + amount + frequency) | SNAP/CalFresh deductions depend on rent, utilities, childcare, medical | High |
| **Liquid assets** ($) | Asset limits gate SSI, some CalWORKs, etc. | Med |
| **Health insurance status** (per member) | Drives Medi-Cal / CHIP | Med |
| **Special conditions** (pregnant, disabled, blind, veteran, etc.) | Unlocks WIC, SSI, disability programs | High |
| **Student status** | Affects CalFresh student eligibility | Low |
| **Immediate needs / resources wanted** | Lets us surface referrals beyond benefits | Low |
| **Relationship to head of household** (per member) | Tax/household unit determination | Med |

**Recommended next step:** restructure our intake to mirror this — keep it on as few pages as
the user wants, but expand the *data model* to: location (zip+county) → household size →
per-member (DOB, relationship, income rows, insurance, conditions, student) → household expenses
→ assets → current benefits → immediate needs. That gives our eligibility engine real inputs
instead of a single annual income number.
