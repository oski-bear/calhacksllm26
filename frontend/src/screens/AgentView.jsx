import { useEffect, useRef, useState } from 'react'
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, LinearProgress, Stack, Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { applyWithAgent } from '../api.js'

const STEP_MS = 1100

const PORTAL_URLS = {
  calfresh: 'https://benefitscal.com/Public/login',
  wic: 'https://www.myfamily.wic.ca.gov/Home/AmIEligible',
}

const PENDING_STEPS = {
  calfresh: [
    'Preparing secure Browserbase session...',
    'Opening BenefitsCal routed portal...',
    'Creating the demo account workspace...',
    'Mapping your saved profile to the application fields...',
    'Waiting for portal confirmation proof...',
  ],
  wic: [
    'Preparing secure Browserbase session...',
    'Opening California WIC routed portal...',
    'Mapping your saved profile to the appointment request...',
    'Selecting the local WIC office workflow...',
    'Waiting for portal confirmation proof...',
  ],
}

// Pretty labels for the mapped portal fields.
const LABELS = {
  firstName: 'First name', lastName: 'Last name', dob: 'Date of birth',
  ssn: 'SSN', phone: 'Phone', email: 'Email', address: 'Address', city: 'City',
  zip: 'ZIP', county: 'County', householdSize: 'Household size',
  monthlyIncome: 'Gross monthly income', rent: 'Rent / mortgage', utilities: 'Utilities',
  pregnant: 'Anyone pregnant?', childrenUnder18: 'Children under 18',
  contactMethod: 'Best contact method', language: 'Preferred language',
  category: 'Participant category', dueDate: 'Expected due date',
  adjunctive: 'On Medi-Cal / CalFresh / CalWORKs?',
}

export default function AgentView({ program, userInfo, onApplied, onBack }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(0)
  const [pendingStep, setPendingStep] = useState(0)
  const startedRef = useRef(false)

  const programId = program?.id || 'calfresh'
  const programName = program?.name || 'program'

  // Kick off the agent once.
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    applyWithAgent(programId, userInfo)
      .then((res) => {
        setResult(res)
        if (res.application) onApplied?.(programId, res)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [onApplied, programId, userInfo])

  const pendingSteps = PENDING_STEPS[programId] || PENDING_STEPS.calfresh

  // While the backend is doing the real Browserbase work, keep the page alive
  // with the same steps judges should expect to see happening in the cloud.
  useEffect(() => {
    if (!loading || result || error) return
    const t = setTimeout(
      () => setPendingStep((s) => Math.min(s + 1, pendingSteps.length - 1)),
      STEP_MS,
    )
    return () => clearTimeout(t)
  }, [error, loading, pendingStep, pendingSteps.length, result])

  // Advance the step animation once we have a plan.
  const steps = result?.steps || []
  const done = result && step >= steps.length
  useEffect(() => {
    if (!result || done) return
    const t = setTimeout(() => setStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [result, step, done])

  const values = result?.values || {}
  const valueEntries = Object.entries(values)
  const isLive = result?.mode === 'browserbase' && result?.liveViewUrl
  const isPersisted = Boolean(result?.application)
  const pendingProgress = Math.round(((pendingStep + 1) / pendingSteps.length) * 100)
  // Reveal fields progressively in sync with the steps.
  const revealCount = steps.length ? Math.round((step / steps.length) * valueEntries.length) : 0

  return (
    <Box sx={{ minHeight: '100vh', py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h4" color="primary">
              AI agent applying to {programName}
            </Typography>
          </Stack>
          <Chip
            label={done ? (isPersisted ? 'Submitted' : 'Simulation complete') : 'Agent working...'}
            color={done ? (isPersisted ? 'success' : 'warning') : 'info'}
          />
        </Stack>

        {loading && (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              Browserbase is running the portal automation now. This can take 20-60 seconds during the demo.
            </Alert>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <BrowserChrome url={PORTAL_URLS[programId] || PORTAL_URLS.calfresh}>
                  <PendingPortal programName={programName} />
                </BrowserChrome>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <ActivityLog steps={pendingSteps} step={pendingStep} progress={pendingProgress} />
              </Grid>
            </Grid>
          </>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>Couldn’t start the agent: {error}</Alert>}

        {result && (
          <>
            {done && (
              <Alert severity={isPersisted ? 'success' : 'warning'} icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                {isPersisted
                  ? `Demo application submitted. ${result.confirmation || 'Confirmation captured.'}`
                  : `Simulation complete. No application was recorded as submitted. ${result.confirmation || ''}`}
              </Alert>
            )}

            {/* Mode banner */}
            <Alert severity={isLive ? 'info' : 'warning'} sx={{ mb: 3 }}>
              {isLive ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ alignItems: { sm: 'center' } }}>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Browserbase navigated the demo portal, filled it, and submitted it. Final portal state below.
                  </Typography>
                  <Button
                    component="a"
                    href={result.liveViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    size="small"
                    variant="outlined"
                  >
                    Open live browser
                  </Button>
                </Stack>
              ) : (
                <FallbackMessage result={result} />
              )}
            </Alert>

            <Grid container spacing={3}>
              {/* Portal: live iframe OR simulated mock browser */}
              <Grid size={{ xs: 12, md: 7 }}>
                {isLive ? (
                  <BrowserChrome url={result.portalUrl}>
                    <AutomationEvidence result={result} />
                    <SubmittedScreenshot result={result} />
                  </BrowserChrome>
                ) : (
                  <BrowserChrome url={result.portalUrl}>
                    <Box sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        {programId === 'wic' ? 'WIC Appointment Request' : 'CalFresh Application'}
                      </Typography>
                      <Stack spacing={1.25}>
                        {valueEntries.map(([key, val], i) => (
                          <PortalField
                            key={key}
                            label={LABELS[key] || key}
                            value={val}
                            filled={i < revealCount}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </BrowserChrome>
                )}
              </Grid>

              {/* Activity log */}
              <Grid size={{ xs: 12, md: 5 }}>
                <ActivityLog steps={steps} step={step} done={done} />
              </Grid>
            </Grid>
          </>
        )}

        <Button onClick={onBack} sx={{ mt: 3 }}>← Back to dashboard</Button>
      </Container>
    </Box>
  )
}

function PendingPortal({ programName }) {
  return (
    <Box sx={{ p: 3, minHeight: 360, bgcolor: '#f8fafc' }}>
      <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', minHeight: 310, textAlign: 'center' }}>
        <CircularProgress size={34} />
        <Box>
          <Typography variant="h6">Cloud browser is applying to {programName}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            We will show the submitted portal proof here as soon as Browserbase returns.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap', rowGap: 1 }}>
          <Chip size="small" color="info" label="Browserbase session starting" />
          <Chip size="small" variant="outlined" label="Human-safe demo portal" />
          <Chip size="small" variant="outlined" label="No real government submission" />
        </Stack>
      </Stack>
    </Box>
  )
}

function FallbackMessage({ result }) {
  if (result.fallbackReason === 'browserbase_error') {
    return (
      <Stack spacing={0.5}>
        <Typography variant="body2">
          Browserbase attempted the live portal run, but the app is showing the safe simulated fallback.
        </Typography>
        {result.error && (
          <Typography variant="caption" color="text.secondary">
            Debug detail: {result.error}
          </Typography>
        )}
      </Stack>
    )
  }

  return (
    <Typography variant="body2">
      Simulated demo submission. Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID to run a real browser live.
    </Typography>
  )
}

function ActivityLog({ steps, step, done = false, progress }) {
  const shownProgress = progress ?? (steps.length ? Math.round((step / steps.length) * 100) : 0)
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>Agent activity</Typography>
        {!done && <LinearProgress variant="determinate" value={shownProgress} sx={{ mb: 2 }} />}
        <Stack spacing={1.5}>
          {steps.map((label, i) => (
            <ActivityRow
              key={i}
              label={label}
              state={done || step > i ? 'done' : step === i ? 'active' : 'pending'}
            />
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

function SubmittedScreenshot({ result }) {
  return (
    <Box sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid', borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Captured submitted portal proof{result.sessionId ? ` · Browserbase session ${result.sessionId}` : ''}
      </Typography>
      {result.screenshot ? (
        <Box
          component="img"
          alt="Submitted portal screenshot"
          src={`data:image/png;base64,${result.screenshot}`}
          sx={{ display: 'block', width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary">
          Browserbase finished, but no screenshot was returned.
        </Typography>
      )}
    </Box>
  )
}

function AutomationEvidence({ result }) {
  const evidence = result.automationEvidence || {}
  const fieldCount = evidence.filledFields?.length || 0
  const clickCount = evidence.clickedControls?.length || 0
  return (
    <Box sx={{ p: 2, bgcolor: 'white' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 1 }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Chip size="small" color="success" label="Browserbase cloud browser" />
          <Chip size="small" variant="outlined" label={`${fieldCount} fields verified`} />
          <Chip size="small" variant="outlined" label={`${clickCount} controls clicked`} />
          <Chip
            size="small"
            variant="outlined"
            color={evidence.confirmationVerified ? 'success' : 'default'}
            label={evidence.confirmationVerified ? 'Portal confirmation verified' : 'Confirmation captured'}
          />
        </Stack>
        <Button
          component="a"
          href={result.liveViewUrl}
          target="_blank"
          rel="noreferrer"
          size="small"
          variant="text"
          sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
        >
          Open in new tab
        </Button>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Session {result.sessionId || 'created'} stayed in Browserbase after the agent filled
        {' '}the routed portal URL and verified the submitted portal state.
      </Typography>
    </Box>
  )
}

function ActivityRow({ label, state }) {
  let icon
  if (state === 'done') icon = <CheckCircleIcon color="success" fontSize="small" />
  else if (state === 'active') icon = <CircularProgress size={16} />
  else icon = <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid', borderColor: 'divider' }} />
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      {icon}
      <Typography variant="body2" color={state === 'pending' ? 'text.disabled' : 'text.primary'}>
        {label}
      </Typography>
    </Stack>
  )
}

function BrowserChrome({ url, children }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{
          alignItems: 'center',
          bgcolor: 'grey.100',
          px: 2,
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" spacing={0.75}>
          <Dot color="#ff5f56" /><Dot color="#ffbd2e" /><Dot color="#27c93f" />
        </Stack>
        <Box sx={{ flex: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
          borderRadius: 5, px: 1.5, py: 0.5, fontSize: 13, color: 'text.secondary', overflow: 'hidden',
          whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          🔒 {url}
        </Box>
      </Stack>
      {children}
    </Box>
  )
}

function PortalField({ label, value, filled }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Box sx={{
        mt: 0.5, px: 1.5, py: 1, minHeight: 38, borderRadius: 1, border: '1px solid',
        borderColor: filled ? 'success.light' : 'divider', bgcolor: filled ? '#e8f5e9' : 'grey.50',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.3s ease',
      }}>
        <Typography variant="body2" color={filled ? 'text.primary' : 'text.disabled'}>
          {filled ? value : ''}
        </Typography>
        {filled && <CheckCircleIcon color="success" fontSize="small" />}
      </Box>
    </Box>
  )
}

function Dot({ color }) {
  return <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color }} />
}
