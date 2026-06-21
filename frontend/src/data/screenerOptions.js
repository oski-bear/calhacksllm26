// Option lists for the intake form.
//
// These mirror the *structure* of MyFriendBen's config option-sets
// (relationship_options, income_categories, income_options_by_category,
// frequency_options, expense_options_by_category, condition_options,
// health_insurance_options, acute_condition_options, etc.) but the values
// here are our own, California-focused, and hardcoded (no external API).
// See: AI SLOP/myfriendben_intake_form_spec.md

// ── Relationship to head of household ──────────────────────────────
export const RELATIONSHIP_OPTIONS = [
  'Spouse / partner',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Other relative',
  'Roommate / unrelated',
]

// ── Income frequency ───────────────────────────────────────────────
// value = key sent to backend, label = shown to user, perYear = multiplier
export const FREQUENCY_OPTIONS = [
  { value: 'hourly', label: 'Hourly', perYear: null }, // needs hours/week
  { value: 'weekly', label: 'Weekly', perYear: 52 },
  { value: 'biweekly', label: 'Every 2 weeks', perYear: 26 },
  { value: 'semimonthly', label: 'Twice a month', perYear: 24 },
  { value: 'monthly', label: 'Monthly', perYear: 12 },
  { value: 'yearly', label: 'Yearly', perYear: 1 },
]

// ── Income categories → specific sources ───────────────────────────
export const INCOME_CATEGORIES = [
  {
    value: 'earned',
    label: 'Wages & employment',
    types: ['Wages / salary', 'Self-employment', 'Gig / contract work', 'Tips / commission'],
  },
  {
    value: 'benefits',
    label: 'Benefits & assistance',
    types: [
      'Unemployment',
      'SSI (Supplemental Security Income)',
      'SSDI (Social Security Disability)',
      'Social Security / retirement',
      'Veterans benefits',
      'CalWORKs / cash assistance',
      'Pension',
    ],
  },
  {
    value: 'other',
    label: 'Other income',
    types: ['Child support', 'Alimony', 'Investment / dividends', 'Rental income', 'Gifts', 'Other'],
  },
]

// ── Household expenses ─────────────────────────────────────────────
export const EXPENSE_OPTIONS = [
  'Rent',
  'Mortgage',
  'Utilities (gas, electric, water)',
  'Child care',
  'Child support paid',
  'Medical / dental (out of pocket)',
  'Health insurance premiums',
  'Dependent / elder care',
]

// ── Health insurance (per member) ──────────────────────────────────
export const HEALTH_INSURANCE_OPTIONS = [
  'None / uninsured', // exclusive
  'Medi-Cal (Medicaid)',
  'Medicare',
  'Employer-provided',
  'Private / Covered California',
  'VA coverage',
  'CHIP',
]

// ── Special circumstances / conditions (per member) ────────────────
export const CONDITION_OPTIONS = [
  'Pregnant',
  'Has a disability / long-term illness',
  'Blind or visually impaired',
  'Veteran or active military',
  'Recently lost a job',
]

// ── Current public benefits (household-level multiselect) ──────────
export const BENEFIT_OPTIONS = [
  'CalFresh / SNAP',
  'Medi-Cal',
  'CalWORKs',
  'SSI / SSDI',
  'Social Security',
  'WIC',
  'Section 8 / Housing Choice Voucher',
  'Unemployment',
  'LIHEAP (energy assistance)',
  'Free / reduced school meals',
  'None of the above', // exclusive
]

// ── Immediate needs / resources wanted (acute_condition_options) ───
export const IMMEDIATE_NEEDS_OPTIONS = [
  'Food',
  'Housing / shelter',
  'Health care',
  'Child care',
  'Mental health',
  'Family planning',
  'Job resources',
  'Legal help',
  'Baby supplies',
  'Transportation',
  'Utility assistance',
]

// ── Birth months ───────────────────────────────────────────────────
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// ── California counties ────────────────────────────────────────────
export const CA_COUNTIES = [
  'Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras', 'Colusa', 'Contra Costa',
  'Del Norte', 'El Dorado', 'Fresno', 'Glenn', 'Humboldt', 'Imperial', 'Inyo',
  'Kern', 'Kings', 'Lake', 'Lassen', 'Los Angeles', 'Madera', 'Marin', 'Mariposa',
  'Mendocino', 'Merced', 'Modoc', 'Mono', 'Monterey', 'Napa', 'Nevada', 'Orange',
  'Placer', 'Plumas', 'Riverside', 'Sacramento', 'San Benito', 'San Bernardino',
  'San Diego', 'San Francisco', 'San Joaquin', 'San Luis Obispo', 'San Mateo',
  'Santa Barbara', 'Santa Clara', 'Santa Cruz', 'Shasta', 'Sierra', 'Siskiyou',
  'Solano', 'Sonoma', 'Stanislaus', 'Sutter', 'Tehama', 'Trinity', 'Tulare',
  'Tuolumne', 'Ventura', 'Yolo', 'Yuba',
]
