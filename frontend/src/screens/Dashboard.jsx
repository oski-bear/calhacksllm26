import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { programMeta } from '../data/programMetadata.js'

const TEAL = '#0d7d6f'
const DEMO_PROGRAM_IDS = new Set(['calfresh', 'wic'])

const DOCUMENT_CHECKLISTS = {
  calfresh: {
    title: 'Document preflight for county follow-up',
    note: 'You can still start the CalFresh application now. These proofs help avoid delays at the interview.',
    items: [
      'Photo ID for the applicant',
      'Proof of California address',
      'Last 30 days of pay stubs or employer statement',
      'Bank statements or other resource proof, if requested',
      'Rent, mortgage, utility, phone, childcare, medical, or child-support proof for deductions',
      'Immigration document only for noncitizens applying for benefits',
    ],
  },
  wic: {
    title: 'Bring or upload before the WIC appointment',
    note: 'The agent can request an appointment now. Local WIC staff confirm eligibility and may ask for these.',
    items: [
      'ID for yourself and any children under 5',
      'Proof of address',
      'Proof of household income, or active Medi-Cal / CalFresh / CalWORKs card',
      'Proof of pregnancy, if applying while pregnant',
      'Medical forms from a health care provider, if requested',
    ],
  },
}

const STATUS_STYLES = {
  eligible: { label: 'Likely eligible', color: 'success', Icon: CheckCircleIcon },
  maybe: { label: 'May qualify', color: 'warning', Icon: HelpOutlineIcon },
}

export default function Dashboard({
  userInfo,
  programs,
  summary,
  explaining,
  applications = {},
  onSelectProgram,
  onStartAgent,
  onViewApplication,
  onEditProfile,
}) {
  const order = { eligible: 0, maybe: 1 }
  const demoMode = userInfo.demoMode === true
  const visiblePrograms = demoMode
    ? programs.filter((p) => DEMO_PROGRAM_IDS.has(p.id))
    : programs
  const shown = visiblePrograms
    .filter((p) => p.status === 'eligible' || p.status === 'maybe')
    .sort((a, b) => order[a.status] - order[b.status])

  const submitted = shown.filter((p) => applications[p.id]?.status === 'submitted')
  const available = shown.filter((p) => !submitted.includes(p))
  const featured = available.filter((p) => p.auto_apply && p.status === 'eligible')
  const others = available.filter((p) => !featured.includes(p))
  const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'there'
  const submittedCount = submitted.length
  const introText = dashboardIntroText({
    demoMode,
    submittedCount,
    featuredCount: featured.length,
    otherCount: others.length,
    shownCount: shown.length,
  })

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Stack direction="row" sx={{ mb: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onEditProfile}>Edit my info</Button>
        </Stack>

        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary">
            Hi {firstName} - here's what you may qualify for
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {introText}
          </Typography>
        </Stack>

        {summary ? (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: '#e0f2f1',
              border: '1px solid',
              borderColor: 'primary.light',
            }}
          >
            <Typography variant="subtitle2" color="primary" sx={{ mb: 0.5 }}>
              Your benefits guide
            </Typography>
            <Typography variant="body2">{summary}</Typography>
          </Box>
        ) : explaining ? (
          <Stack direction="row" spacing={1} sx={{ mb: 3, alignItems: 'center' }}>
            <CircularProgress size={16} />
            <Typography variant="body2" color="text.secondary">
              Personalizing your guidance...
            </Typography>
          </Stack>
        ) : null}

        {featured.length > 0 && <AgentPacket userInfo={userInfo} />}

        {submitted.length > 0 && (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
              <Typography variant="overline" sx={{ color: 'success.main', fontWeight: 700, letterSpacing: '0.1em' }}>
                Submitted applications
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ mb: 4 }}>
              {submitted.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  application={applications[program.id]}
                  onAction={onViewApplication || onSelectProgram}
                />
              ))}
            </Stack>
          </>
        )}

        {featured.length > 0 && (
          <>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
              <AutoAwesomeIcon sx={{ color: TEAL, fontSize: 20 }} />
              <Typography variant="overline" sx={{ color: TEAL, fontWeight: 700, letterSpacing: '0.1em' }}>
                Ready to auto-apply
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ mb: 4 }}>
              {featured.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  featured
                  application={applications[program.id]}
                  onAction={onStartAgent || onSelectProgram}
                />
              ))}
            </Stack>
          </>
        )}

        {others.length > 0 && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>
              Also worth applying for
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1.5 }}>
              {others.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  application={applications[program.id]}
                  onAction={onSelectProgram}
                />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  )
}

function dashboardIntroText({ demoMode, submittedCount, featuredCount, otherCount, shownCount }) {
  if (demoMode) {
    if (submittedCount === 2) return 'CalFresh and WIC are submitted and verified for the demo.'
    if (submittedCount > 0) {
      return `${submittedCount} demo application${submittedCount === 1 ? ' is' : 's are'} submitted. ${featuredCount > 0 ? `${featuredCount} remains ready for auto-apply.` : ''}`
    }
    return 'For the demo, we are focusing on the two end-to-end agent flows: CalFresh and WIC.'
  }

  if (submittedCount > 0) {
    return `${submittedCount} application${submittedCount === 1 ? ' is' : 's are'} submitted. ${featuredCount > 0 ? `We can still auto-apply to ${featuredCount} more.` : 'You can review other programs below.'}`
  }
  if (featuredCount > 0) {
    return otherCount > 0
      ? `We can auto-apply to ${featuredCount} program${featuredCount === 1 ? '' : 's'} right now, plus ${otherCount} more worth reviewing.`
      : `We can auto-apply to ${featuredCount} program${featuredCount === 1 ? '' : 's'} right now.`
  }
  if (shownCount > 0) return `We found ${shownCount} program${shownCount === 1 ? '' : 's'} you may qualify for.`
  return 'Based on what you entered, we did not find programs you qualify for. You can go back and adjust your info.'
}

function AgentPacket({ userInfo }) {
  const packet = buildAgentPacket(userInfo)

  return (
    <Card variant="outlined" sx={{ mb: 3, borderColor: 'primary.light', bgcolor: '#f8fffe' }}>
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
          <AutoAwesomeIcon sx={{ color: TEAL, fontSize: 20 }} />
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            Agent-ready packet
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Saved from intake and reused by the CalFresh/WIC browser agent instead of asking the user twice.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          {packet.map((item) => (
            <Chip key={item} size="small" variant="outlined" color="primary" label={item} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

function buildAgentPacket(userInfo) {
  const householdSize = userInfo.householdSize || String(userInfo.members?.length || 1)
  const benefits = (userInfo.currentBenefits || []).filter((b) => b !== 'None of the above')
  const packet = [
    `Identity: ${userInfo.name || 'saved'}`,
    `Location: ${[userInfo.city, userInfo.county, userInfo.zipcode].filter(Boolean).join(', ')}`,
    `Household: ${householdSize} people`,
    `Monthly income: ${formatMoney(monthlyAmount(userInfo.income))}`,
    `Monthly expenses: ${formatMoney(monthlyExpensesAmount(userInfo.expenses || []))}`,
  ]

  if (benefits.length) packet.push(`Current benefits: ${benefits.join(', ')}`)
  if (hasPregnancyOrYoungChild(userInfo)) packet.push('WIC signal: pregnancy or child under 5')
  return packet.filter((item) => !item.endsWith(': '))
}

function monthlyAmount(annualIncome) {
  const amount = Number(annualIncome || 0)
  return amount > 0 ? amount / 12 : 0
}

function monthlyExpensesAmount(expenses) {
  const perYear = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12, yearly: 1 }
  return expenses.reduce((sum, expense) => {
    const amount = Number(expense.amount || 0)
    const multiplier = perYear[expense.frequency] || 12
    return sum + (amount * multiplier / 12)
  }, 0)
}

function hasPregnancyOrYoungChild(userInfo) {
  return (userInfo.members || []).some((member) => {
    if ((member.conditions || []).includes('Pregnant')) return true
    const age = Number(member.birthYear) ? 2026 - Number(member.birthYear) : null
    return age !== null && age < 5
  })
}

function formatMoney(value) {
  return `$${Math.round(Number(value || 0)).toLocaleString()}`
}

function ProgramCard({ program, featured, application, onAction }) {
  const isSubmitted = application?.status === 'submitted'
  const meta = programMeta(program.id)
  const verifiedFieldCount = Number(application?.verified_field_count || 0)
  const verifiedControlCount = Number(application?.verified_control_count || 0)
  const hasBrowserbaseProof = application?.mode === 'browserbase' && application?.confirmation_verified
  const style = isSubmitted
    ? { label: 'Submitted', color: 'success', Icon: CheckCircleIcon }
    : STATUS_STYLES[program.status]
  const StatusIcon = style.Icon
  const reasons = (program.reasons || []).filter((r) => !r.startsWith('Source:'))
  const source = (program.reasons || []).find((r) => r.startsWith('Source:'))

  return (
    <Card
      variant="outlined"
      sx={isSubmitted
        ? { borderColor: 'success.main', borderWidth: 2, bgcolor: '#f6fbfa' }
        : featured
          ? { borderColor: TEAL, borderWidth: 2, bgcolor: '#f6fbfa' }
          : undefined}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
            <ProgramBrand program={program} meta={meta} />
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Typography variant={featured ? 'h6' : 'subtitle1'} fontWeight={700}>
                  {program.name}
                </Typography>
                <ProgramInfo program={program} meta={meta} />
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {program.category} - {program.agency}
              </Typography>
            </Box>
          </Stack>
          <Chip icon={<StatusIcon />} label={style.label} color={style.color} size="small" />
        </Stack>

        <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
          {program.estimate}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {program.description}
        </Typography>
        <ProgramLinks meta={meta} />

        {isSubmitted && (
          <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: '#e8f5e9' }}>
            <Typography variant="body2" fontWeight={700} color="success.dark">
              {application.confirmation || 'Application submitted.'}
            </Typography>
            {application.submitted_at && (
              <Typography variant="caption" color="text.secondary">
                Submitted {formatDate(application.submitted_at)}
              </Typography>
            )}
            {hasBrowserbaseProof && (
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1 }}>
                <Chip size="small" color="success" label="Browserbase verified" />
                <Chip size="small" variant="outlined" label={`${verifiedFieldCount} fields`} />
                <Chip size="small" variant="outlined" label={`${verifiedControlCount} controls`} />
              </Stack>
            )}
            {application.screenshot && (
              <Box sx={{ mt: 1.5 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 0.75, alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Saved submitted portal proof
                  </Typography>
                  <Button
                    component="a"
                    href={`data:image/png;base64,${application.screenshot}`}
                    target="_blank"
                    rel="noreferrer"
                    size="small"
                    variant="text"
                  >
                    Open full proof
                  </Button>
                </Stack>
                <Box
                  component="img"
                  alt={`${program.name} submitted portal proof`}
                  src={`data:image/png;base64,${application.screenshot}`}
                  sx={{
                    display: 'block',
                    width: '100%',
                    maxHeight: 220,
                    objectFit: 'cover',
                    objectPosition: 'top',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'white',
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        {program.personalized && (
          <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1, bgcolor: '#e0f2f1' }}>
            <Typography variant="body2">{program.personalized}</Typography>
          </Box>
        )}

        {reasons.length > 0 && (
          <Stack spacing={0.25} sx={{ mt: 1.5 }}>
            {reasons.map((reason, i) => (
              <Typography key={i} variant="caption" color="text.secondary">
                - {reason}
              </Typography>
            ))}
          </Stack>
        )}

        {source && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1, color: TEAL, fontStyle: 'italic' }}>
            {source}
          </Typography>
        )}

        {featured && !isSubmitted && <DocumentChecklist programId={program.id} />}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant={featured && !isSubmitted ? 'contained' : 'outlined'}
          color="primary"
          startIcon={isSubmitted ? <CheckCircleIcon /> : featured ? <AutoAwesomeIcon /> : null}
          onClick={() => onAction(program.id)}
        >
          {isSubmitted ? 'View agent proof' : featured ? 'Auto-apply with AI agent' : 'Start application'}
        </Button>
      </CardActions>
    </Card>
  )
}

function ProgramBrand({ program, meta }) {
  const label = meta?.logoText || program.name.slice(0, 2)
  return (
    <Box
      aria-hidden="true"
      sx={{
        width: 58,
        height: 58,
        borderRadius: 1,
        bgcolor: meta?.brandBg || '#eef2f7',
        border: '1px solid',
        borderColor: 'divider',
        color: meta?.brandColor || 'primary.main',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 900, lineHeight: 1 }}>
        {label}
      </Typography>
      {meta?.logoSubtext && (
        <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
          {meta.logoSubtext}
        </Typography>
      )}
    </Box>
  )
}

function ProgramInfo({ program, meta }) {
  if (!meta?.info) return null
  return (
    <Tooltip
      arrow
      placement="top"
      title={(
        <Box sx={{ maxWidth: 280 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{meta.infoTitle || program.name}</Typography>
          <Typography variant="body2">{meta.info}</Typography>
        </Box>
      )}
    >
      <IconButton size="small" aria-label={`About ${program.name}`}>
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}

function ProgramLinks({ meta }) {
  if (!meta) return null
  return (
    <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', rowGap: 1 }}>
      <Button
        component="a"
        href={meta.applyUrl}
        target="_blank"
        rel="noreferrer"
        size="small"
        variant="outlined"
      >
        {meta.applyLabel}
      </Button>
      <Button
        component="a"
        href={meta.rulesUrl}
        target="_blank"
        rel="noreferrer"
        size="small"
        variant="text"
      >
        {meta.rulesLabel}
      </Button>
    </Stack>
  )
}

function DocumentChecklist({ programId }) {
  const checklist = DOCUMENT_CHECKLISTS[programId]
  if (!checklist) return null

  return (
    <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: '#fffde7', border: '1px solid', borderColor: '#f4d35e' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        {checklist.title}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, mb: 1 }}>
        {checklist.note}
      </Typography>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: 'wrap', rowGap: 0.75 }}>
        {checklist.items.map((item) => (
          <Chip key={item} size="small" variant="outlined" label={item} />
        ))}
      </Stack>
    </Box>
  )
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}
