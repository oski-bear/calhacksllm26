import { useState } from 'react'
import {
  AppBar, Box, Button, Card, CardContent, Checkbox, Container, Divider,
  FormControl, IconButton, InputAdornment, InputLabel, LinearProgress,
  MenuItem, Radio, Select, Stack, TextField, Toolbar, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1'
import PenguinLogo from '../components/PenguinLogo.jsx'
import VoiceIntakeButton from '../components/VoiceIntakeButton.jsx'
import {
  RELATIONSHIP_OPTIONS, FREQUENCY_OPTIONS, INCOME_CATEGORIES, EXPENSE_OPTIONS,
  HEALTH_INSURANCE_OPTIONS, CONDITION_OPTIONS, BENEFIT_OPTIONS,
  IMMEDIATE_NEEDS_OPTIONS, MONTHS, CA_COUNTIES,
} from '../data/screenerOptions.js'
import { totalAnnualIncome } from '../data/income.js'

const TEAL = '#2D5BA8'
const TEAL_LIGHT = '#DCE6F5'

let _id = 0
const uid = () => `id${_id++}`

const newMember = (isPrimary = false) => ({
  id: uid(), isPrimary, relationship: isPrimary ? 'Self' : '',
  birthMonth: '', birthYear: '',
  incomeSources: [], healthInsurance: [], conditions: [], student: null,
})

const newIncome = () => ({ id: uid(), category: '', type: '', frequency: '', hoursPerWeek: '', amount: '' })
const newExpense = () => ({ id: uid(), type: '', amount: '', frequency: 'monthly' })

const CURRENT_YEAR = 2026

export default function BasicInfoForm({
  initialValues = {},
  onSubmit,
  demoProfile,
  onLoadProfile,
  title = 'Find the benefits you qualify for',
  subtitle = "Tell us a bit about your situation. We'll figure out which programs you're eligible for and help you apply.",
  submitLabel = 'Find my benefits →',
  onBack,
  children,
}) {
  const [data, setData] = useState(() => normalizeProfile({
    name: '', email: '', zipcode: '', county: '', citizenship: '',
    members: [newMember(true)],
    expenses: [], assets: '', currentBenefits: [], immediateNeeds: [],
    state: 'CA',
    ...initialValues,
  }))
  const [resumeEmail, setResumeEmail] = useState('')
  const [resumeMessage, setResumeMessage] = useState('')
  const [resumeLoading, setResumeLoading] = useState(false)

  const set = (field, val) => setData((d) => ({ ...d, [field]: val }))

  // ── member helpers ──
  const updateMember = (id, patch) =>
    setData((d) => ({ ...d, members: d.members.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  const addMember = () => setData((d) => ({ ...d, members: [...d.members, newMember(false)] }))
  const removeMember = (id) =>
    setData((d) => ({ ...d, members: d.members.filter((m) => m.id !== id) }))

  // ── derived (for backward-compatible eligibility engine) ──
  const annualIncome = totalAnnualIncome(data.members)
  const primary = data.members[0] || {}

  const required = [data.name, data.email, data.zipcode, data.county, primary.birthYear]
  const filled = required.filter((v) => String(v ?? '').trim() !== '').length
  const progress = Math.round((filled / required.length) * 100)
  const canSubmit =
    data.name.trim() && data.email.trim() && data.zipcode.trim() && data.county.trim()

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...data,
      // normalize "Prefer not to say" to empty for the eligibility engine
      citizenship: data.citizenship === 'Prefer not to say' ? '' : data.citizenship,
      // derived flat fields the existing Flask engine consumes
      householdSize: String(data.members.length),
      income: String(Math.round(annualIncome)),
      age: primary.birthYear ? String(CURRENT_YEAR - Number(primary.birthYear)) : '',
    })
  }

  async function handleLoadSavedProfile() {
    if (!resumeEmail.trim() || !onLoadProfile) return
    setResumeLoading(true)
    setResumeMessage('')
    try {
      const profile = await onLoadProfile(resumeEmail.trim())
      setData((current) => normalizeProfile({ ...current, ...profile }))
      setResumeMessage('Saved profile loaded. Review it, then check eligibility.')
    } catch (err) {
      setResumeMessage(err.message || 'Could not load that profile.')
    } finally {
      setResumeLoading(false)
    }
  }

  function handleVoiceIntake(parsed) {
    setData((current) => {
      const updates = {}

      if (parsed.name) updates.name = parsed.name
      if (parsed.zipcode) updates.zipcode = parsed.zipcode
      if (parsed.county) updates.county = parsed.county
      if (parsed.citizenship) updates.citizenship = parsed.citizenship
      if (parsed.assets) updates.assets = String(parsed.assets)

      if (parsed.members?.length > 0) {
        const newMembers = parsed.members.map((m, i) => {
          const base = current.members[i] ?? newMember(i === 0)
          return {
            ...base,
            ...(m.relationship ? { relationship: m.relationship } : {}),
            ...(m.birthYear ? { birthYear: String(m.birthYear) } : {}),
            ...(m.birthMonth ? { birthMonth: Number(m.birthMonth) } : {}),
            conditions: m.conditions?.length ? m.conditions : base.conditions,
            incomeSources: m.incomeSources?.length
              ? m.incomeSources.map((s) => ({ ...newIncome(), ...s }))
              : base.incomeSources,
          }
        })
        updates.members = newMembers
      }

      if (parsed.expenses?.length > 0) {
        updates.expenses = parsed.expenses.map((e) => ({ ...newExpense(), ...e }))
      }
      if (parsed.currentBenefits?.length > 0) updates.currentBenefits = parsed.currentBenefits
      if (parsed.immediateNeeds?.length > 0) updates.immediateNeeds = parsed.immediateNeeds

      return { ...current, ...updates }
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f0f2f5' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <PenguinLogo size={38} sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={700} letterSpacing="-0.01em">Benefits Finder</Typography>
        </Toolbar>
      </AppBar>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 10 }} />
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0', px: 3, py: 1.25 }}>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
          {progress === 100 ? '✓ All set — ready to check eligibility' : `${filled} of ${required.length} required fields filled`}
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
        <Container maxWidth="sm">
          <Card variant="outlined" sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {subtitle}
              </Typography>

              <VoiceIntakeButton onIntake={handleVoiceIntake} />

              {demoProfile && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: '#DCE6F5',
                    border: '1px solid',
                    borderColor: 'primary.light',
                  }}
                >
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
                    Judge demo shortcut
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Loads a Berkeley household that qualifies for both CalFresh and WIC.
                  </Typography>
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    onClick={() => setData(demoProfile())}
                  >
                    Load CalFresh + WIC demo profile
                  </Button>
                </Box>
              )}
              {onLoadProfile && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
                    Resume a saved profile
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Enter the email used before to reload household details and application status.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      label="Saved profile email"
                      value={resumeEmail}
                      onChange={(e) => setResumeEmail(e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      disabled={resumeLoading || !resumeEmail.trim()}
                      onClick={handleLoadSavedProfile}
                      sx={{ minWidth: 130 }}
                    >
                      {resumeLoading ? 'Loading...' : 'Load'}
                    </Button>
                  </Stack>
                  {resumeMessage && (
                    <Typography
                      variant="caption"
                      color={resumeMessage.startsWith('Saved') ? 'success.main' : 'error'}
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {resumeMessage}
                    </Typography>
                  )}
                </Box>
              )}

              {/* ══ CONTACT ══ */}
              <SectionLabel>Let's get started!</SectionLabel>
              <Question>How can we reach you?</Question>
              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <TextField fullWidth required label="Full name"
                  value={data.name} onChange={(e) => set('name', e.target.value)} />
                <TextField fullWidth required type="email" label="Email address"
                  value={data.email} onChange={(e) => set('email', e.target.value)}
                  helperText="Used only to save your results" />
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* ══ LOCATION ══ */}
              <SectionLabel>Where you live</SectionLabel>
              <Question>What is your zip code?</Question>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 3 }}>
                <TextField label="Zip code" required sx={{ maxWidth: { sm: 180 } }}
                  value={data.zipcode} onChange={(e) => set('zipcode', e.target.value)} />
                <FormControl fullWidth required>
                  <InputLabel>County</InputLabel>
                  <Select label="County" value={data.county} onChange={(e) => set('county', e.target.value)}>
                    {CA_COUNTIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* ══ HOUSEHOLD MEMBERS ══ */}
              <SectionLabel>Your household</SectionLabel>
              <Question>Who lives in your household?</Question>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add everyone you live with and share food or expenses with. Start with yourself.
              </Typography>

              <Stack spacing={2}>
                {data.members.map((m, i) => (
                  <MemberCard key={m.id} member={m} index={i}
                    onChange={(patch) => updateMember(m.id, patch)}
                    onRemove={() => removeMember(m.id)} />
                ))}
              </Stack>

              <Button startIcon={<PersonAddAlt1Icon />} onClick={addMember}
                sx={{ mt: 2, color: TEAL, fontWeight: 700 }}>
                Add a household member
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* ══ EXPENSES ══ */}
              <SectionLabel>Your expenses</SectionLabel>
              <Question>Which of these expenses does your household have?</Question>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                These can increase the benefits you qualify for. Estimate if you're unsure.
              </Typography>
              <Stack spacing={1} sx={{ mb: 1.5 }}>
                {EXPENSE_OPTIONS.map((opt) => {
                  const row = data.expenses.find((e) => e.type === opt)
                  const checked = !!row
                  return (
                    <Box key={opt}>
                      <Tile selected={checked} onClick={() => {
                        set('expenses', checked
                          ? data.expenses.filter((e) => e.type !== opt)
                          : [...data.expenses, { ...newExpense(), type: opt }])
                      }}>
                        <Checkbox size="small" checked={checked}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => {
                            set('expenses', checked
                              ? data.expenses.filter((e) => e.type !== opt)
                              : [...data.expenses, { ...newExpense(), type: opt }])
                          }}
                          sx={{ p: 0, color: checked ? TEAL : '#cbd5e0', '&.Mui-checked': { color: TEAL } }} />
                        <Typography variant="body2" fontWeight={checked ? 600 : 400}>{opt}</Typography>
                      </Tile>
                      {checked && (
                        <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 0.5, pl: 1 }}>
                          <TextField size="small" label="Amount" type="number" sx={{ maxWidth: 140 }}
                            value={row.amount}
                            onChange={(e) => set('expenses', data.expenses.map((x) =>
                              x.type === opt ? { ...x, amount: e.target.value } : x))}
                            slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} />
                          <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Frequency</InputLabel>
                            <Select label="Frequency" value={row.frequency}
                              onChange={(e) => set('expenses', data.expenses.map((x) =>
                                x.type === opt ? { ...x, frequency: e.target.value } : x))}>
                              {FREQUENCY_OPTIONS.filter((f) => f.value !== 'hourly').map((f) =>
                                <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
                            </Select>
                          </FormControl>
                        </Stack>
                      )}
                    </Box>
                  )
                })}
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* ══ ASSETS ══ */}
              <SectionLabel>Household assets</SectionLabel>
              <Question>About how much does your household have in savings?</Question>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Cash, checking, savings, stocks, or bonds. Some programs have asset limits.
              </Typography>
              <TextField fullWidth type="number" label="Total amount"
                value={data.assets} onChange={(e) => set('assets', e.target.value)}
                slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} />

              <Divider sx={{ my: 3 }} />

              {/* ══ BACKGROUND ══ */}
              <SectionLabel>Your background</SectionLabel>
              <Question>What is your immigration or citizenship status?</Question>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Private — only used to check program eligibility.
              </Typography>
              <TileStack
                options={['U.S. Citizen', 'Permanent Resident', 'Visa Holder', 'Other / Undocumented', 'Prefer not to say']}
                value={data.citizenship}
                onChange={(v) => set('citizenship', v)}
              />

              <Divider sx={{ my: 3 }} />

              {/* ══ CURRENT BENEFITS ══ */}
              <SectionLabel>Current benefits</SectionLabel>
              <Question>Does anyone in your household already receive these?</Question>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                Select all that apply. Leave blank if none.
              </Typography>
              <MultiTile options={BENEFIT_OPTIONS} values={data.currentBenefits}
                exclusive="None of the above"
                onChange={(v) => set('currentBenefits', v)} sx={{ mb: 1 }} />

              <Divider sx={{ my: 3 }} />

              {/* ══ IMMEDIATE NEEDS ══ */}
              <SectionLabel>Immediate needs</SectionLabel>
              <Question>Do you want information on any of these resources?</Question>
              <MultiTile options={IMMEDIATE_NEEDS_OPTIONS} values={data.immediateNeeds}
                onChange={(v) => set('immediateNeeds', v)} sx={{ mb: 4 }} />

              <Button type="submit" variant="contained" color="primary" size="large" fullWidth
                disabled={!canSubmit}
                sx={{ py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2 }}>
                {submitLabel}
              </Button>

            </CardContent>
          </Card>

          {children}

          {onBack && (
            <Button onClick={onBack} sx={{ mt: 3 }}>
              ← Back to dashboard
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  )
}

function normalizeProfile(profile) {
  const members = Array.isArray(profile.members) && profile.members.length
    ? profile.members
    : [newMember(true)]
  return {
    name: '',
    email: '',
    zipcode: '',
    county: '',
    citizenship: '',
    assets: '',
    state: 'CA',
    ...profile,
    members,
    expenses: Array.isArray(profile.expenses) ? profile.expenses : [],
    currentBenefits: Array.isArray(profile.currentBenefits) ? profile.currentBenefits : [],
    immediateNeeds: Array.isArray(profile.immediateNeeds) ? profile.immediateNeeds : [],
  }
}

// ════════════════════════════════════════════════════════════════════
// Household member card
// ════════════════════════════════════════════════════════════════════
function MemberCard({ member, index, onChange, onRemove }) {
  const subject = member.isPrimary ? 'you' : 'this person'
  const addIncome = () =>
    onChange({ incomeSources: [...member.incomeSources, newIncome()] })
  const updateIncome = (id, patch) =>
    onChange({ incomeSources: member.incomeSources.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  const removeIncome = (id) =>
    onChange({ incomeSources: member.incomeSources.filter((s) => s.id !== id) })

  return (
    <Box sx={{ border: '1px solid #d8dee6', borderRadius: 2, p: 2, bgcolor: '#fafbfc' }}>
      <Stack direction="row" sx={{ mb: 1.5, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight={700} color={TEAL}>
          {member.isPrimary ? 'You' : `Household member ${index + 1}`}
        </Typography>
        {!member.isPrimary && (
          <IconButton size="small" onClick={onRemove} aria-label="remove member">
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>

      {/* relationship (non-primary) */}
      {!member.isPrimary && (
        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel>Relationship to you</InputLabel>
          <Select label="Relationship to you" value={member.relationship}
            onChange={(e) => onChange({ relationship: e.target.value })}>
            {RELATIONSHIP_OPTIONS.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>
      )}

      {/* birth month + year */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Birth month</InputLabel>
          <Select label="Birth month" value={member.birthMonth}
            onChange={(e) => onChange({ birthMonth: e.target.value })}>
            {MONTHS.map((mo, i) => <MenuItem key={mo} value={i + 1}>{mo}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField size="small" label="Birth year" type="number" placeholder="YYYY" sx={{ maxWidth: 120 }}
          value={member.birthYear} onChange={(e) => onChange({ birthYear: e.target.value })} />
      </Stack>

      {/* income */}
      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
        Income sources
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Wages, benefits, child support, or any regular payments {subject} receive{member.isPrimary ? '' : 's'}.
      </Typography>
      <Stack spacing={1.5} sx={{ mb: 1 }}>
        {member.incomeSources.map((src) => (
          <IncomeRow key={src.id} src={src}
            onChange={(patch) => updateIncome(src.id, patch)}
            onRemove={() => removeIncome(src.id)} />
        ))}
      </Stack>
      <Button size="small" startIcon={<AddIcon />} onClick={addIncome}
        sx={{ color: TEAL, fontWeight: 700, mb: 2 }}>
        Add an income source
      </Button>

      {/* health insurance */}
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Health insurance</Typography>
      <MultiTile dense options={HEALTH_INSURANCE_OPTIONS} values={member.healthInsurance}
        exclusive="None / uninsured"
        onChange={(v) => onChange({ healthInsurance: v })} sx={{ mb: 2 }} />

      {/* conditions */}
      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Special circumstances <Typography component="span" variant="caption" color="text.secondary">(optional)</Typography>
      </Typography>
      <MultiTile dense options={CONDITION_OPTIONS} values={member.conditions}
        onChange={(v) => onChange({ conditions: v })} />
    </Box>
  )
}

// One income source row
function IncomeRow({ src, onChange, onRemove }) {
  const cat = INCOME_CATEGORIES.find((c) => c.value === src.category)
  const isHourly = src.frequency === 'hourly'
  return (
    <Box sx={{ border: '1px solid #e2e8f0', borderRadius: 1.5, p: 1.5, bgcolor: 'white' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <FormControl size="small" fullWidth>
          <InputLabel>Category</InputLabel>
          <Select label="Category" value={src.category}
            onChange={(e) => onChange({ category: e.target.value, type: '' })}>
            {INCOME_CATEGORIES.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
          </Select>
        </FormControl>
        <IconButton size="small" onClick={onRemove} aria-label="remove income"><DeleteOutlineIcon fontSize="small" /></IconButton>
      </Stack>
      {cat && (
        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
          <InputLabel>Source</InputLabel>
          <Select label="Source" value={src.type} onChange={(e) => onChange({ type: e.target.value })}>
            {cat.types.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>
      )}
      <Stack direction="row" spacing={1}>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Frequency</InputLabel>
          <Select label="Frequency" value={src.frequency}
            onChange={(e) => onChange({ frequency: e.target.value })}>
            {FREQUENCY_OPTIONS.map((f) => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
          </Select>
        </FormControl>
        {isHourly && (
          <TextField size="small" label="Hrs/week" type="number" sx={{ maxWidth: 90 }}
            value={src.hoursPerWeek} onChange={(e) => onChange({ hoursPerWeek: e.target.value })} />
        )}
        <TextField size="small" label="Amount" type="number" fullWidth
          value={src.amount} onChange={(e) => onChange({ amount: e.target.value })}
          slotProps={{ input: { startAdornment: <InputAdornment position="start">$</InputAdornment> } }} />
      </Stack>
    </Box>
  )
}

// ════════════════════════════════════════════════════════════════════
// Shared primitives
// ════════════════════════════════════════════════════════════════════
function SectionLabel({ children }) {
  return (
    <Typography variant="overline"
      sx={{ color: TEAL, fontWeight: 700, letterSpacing: '0.12em', display: 'block', mb: 0.5 }}>
      {children}
    </Typography>
  )
}

function Question({ children }) {
  return <Typography variant="h6" fontWeight={600} sx={{ mb: 1, lineHeight: 1.3 }}>{children}</Typography>
}

function Tile({ selected, onClick, children, dense, sx }) {
  return (
    <Box onClick={onClick} sx={{
      border: '2px solid', borderColor: selected ? TEAL : '#e2e8f0', borderRadius: 2,
      px: dense ? 1.5 : 2, py: dense ? 1 : 1.5, cursor: 'pointer',
      bgcolor: selected ? TEAL_LIGHT : 'white',
      transition: 'border-color 0.12s, background-color 0.12s',
      display: 'flex', alignItems: 'center', gap: 1.5, userSelect: 'none', ...sx,
    }}>
      {children}
    </Box>
  )
}

// Multi-select set of checkbox tiles, with optional exclusive option.
function MultiTile({ options, values, onChange, exclusive, dense, sx }) {
  const toggle = (opt) => {
    if (exclusive && opt === exclusive) {
      onChange(values.includes(opt) ? [] : [opt])
    } else {
      const cleaned = exclusive ? values.filter((v) => v !== exclusive) : values
      onChange(cleaned.includes(opt) ? cleaned.filter((v) => v !== opt) : [...cleaned, opt])
    }
  }
  return (
    <Stack spacing={1} sx={sx}>
      {options.map((opt) => {
        const checked = values.includes(opt)
        return (
          <Tile key={opt} dense={dense} selected={checked} onClick={() => toggle(opt)}>
            <Checkbox size="small" checked={checked} onClick={(e) => e.stopPropagation()}
              onChange={() => toggle(opt)}
              sx={{ p: 0, color: checked ? TEAL : '#cbd5e0', '&.Mui-checked': { color: TEAL } }} />
            <Typography variant="body2" fontWeight={checked ? 600 : 400}>{opt}</Typography>
          </Tile>
        )
      })}
    </Stack>
  )
}

// Single-select radio tiles (vertical).
function TileStack({ options, value, onChange }) {
  return (
    <Stack spacing={1}>
      {options.map((opt) => {
        const selected = value === opt
        return (
          <Tile key={opt} selected={selected} onClick={() => onChange(opt)}>
            <Radio size="small" checked={selected} onClick={(e) => e.stopPropagation()}
              onChange={() => onChange(opt)}
              sx={{ p: 0, color: selected ? TEAL : '#cbd5e0', '&.Mui-checked': { color: TEAL } }} />
            <Typography variant="body2" fontWeight={selected ? 600 : 400}>{opt}</Typography>
          </Tile>
        )
      })}
    </Stack>
  )
}
