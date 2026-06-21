import { useEffect, useRef, useState } from 'react'
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Container, Grid, LinearProgress, Stack, Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { applyWithAgent } from '../api.js'

const STEP_MS = 1100

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
        if (res.confirmation) onApplied?.(programId, res)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [onApplied, programId, userInfo])

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
  // Reveal fields progressively in sync with the steps.
  const revealCount = steps.length ? Math.round((step / steps.length) * valueEntries.length) : 0
  const progress = steps.length ? Math.round((step / steps.length) * 100) : 0

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
            label={done ? 'Submitted' : 'Agent working…'}
            color={done ? 'success' : 'info'}
          />
        </Stack>

        {loading && (
          <Stack direction="row" spacing={1.5} sx={{ mb: 3, alignItems: 'center' }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">Starting the agent…</Typography>
          </Stack>
        )}

        {error && <Alert severity="error" sx={{ mb: 3 }}>Couldn’t start the agent: {error}</Alert>}

        {result && (
          <>
            {done && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                Demo application submitted. {result.confirmation || 'Confirmation captured.'}
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
                'Simulated demo submission. Set BROWSERBASE_API_KEY + BROWSERBASE_PROJECT_ID to run a real browser live.'
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
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>Agent activity</Typography>
                    {!done && <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />}
                    <Stack spacing={1.5}>
                      {steps.map((label, i) => (
                        <ActivityRow
                          key={i}
                          label={label}
                          state={step > i ? 'done' : step === i ? 'active' : 'pending'}
                        />
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        <Button onClick={onBack} sx={{ mt: 3 }}>← Back to dashboard</Button>
      </Container>
    </Box>
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
  return (
    <Box sx={{ p: 2, bgcolor: 'white' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.25}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 1 }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
          <Chip size="small" color="success" label="Browserbase cloud browser" />
          <Chip size="small" variant="outlined" label="Routed portal URL" />
          <Chip size="small" variant="outlined" label="Confirmation captured" />
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
        Session {result.sessionId || 'created'} stayed in Browserbase after the agent filled the routed demo portal.
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
