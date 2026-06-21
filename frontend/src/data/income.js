import { FREQUENCY_OPTIONS } from './screenerOptions.js'

// Convert one income source to an annual dollar amount.
// Hourly uses hoursPerWeek * 52; everything else uses the frequency multiplier.
export function annualizeIncome({ amount, frequency, hoursPerWeek }) {
  const amt = Number(amount) || 0
  if (!amt) return 0
  if (frequency === 'hourly') {
    const hrs = Number(hoursPerWeek) || 0
    return amt * hrs * 52
  }
  const freq = FREQUENCY_OPTIONS.find((f) => f.value === frequency)
  return freq && freq.perYear ? amt * freq.perYear : 0
}

// Total annual income across every member's income sources.
export function totalAnnualIncome(members) {
  if (!Array.isArray(members)) return 0
  return members.reduce(
    (sum, m) => sum + (m.incomeSources || []).reduce((s, src) => s + annualizeIncome(src), 0),
    0,
  )
}
