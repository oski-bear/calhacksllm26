import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// The agent/computer-use screen (whiteboard: agent fills the real portal).
// A mock browser window auto-fills the application while an activity log
// shows what the agent is doing. When it finishes, the status flips to
// "Submitted".

// Each step the agent performs. `fills` lists which browser fields get
// filled in when that step completes.
const STEPS = [
  { label: 'Opening application portal (benefitscal.com)…', fills: [] },
  { label: 'Entering personal details…', fills: ['name', 'email'] },
  { label: 'Entering household information…', fills: ['age', 'household'] },
  { label: 'Entering income…', fills: ['income'] },
  { label: 'Entering address & SSN…', fills: ['address', 'ssn'] },
  { label: 'Uploading documents (W-2, pay stub)…', fills: [] },
  { label: 'Reviewing & submitting application…', fills: [] },
]

const STEP_MS = 1400

export default function AgentView({ program, userInfo, onBack }) {
  // currentStep counts completed steps. When it reaches STEPS.length we're done.
  const [currentStep, setCurrentStep] = useState(0)
  const done = currentStep >= STEPS.length

  // Advance one step on a timer until everything is done.
  useEffect(() => {
    if (done) return
    const timer = setTimeout(() => setCurrentStep((s) => s + 1), STEP_MS)
    return () => clearTimeout(timer)
  }, [currentStep, done])

  // The values the agent "types" into the portal, pulled from what we collected.
  const monthlyIncome = userInfo.income
    ? `$${Math.round(Number(userInfo.income) / 12).toLocaleString()} / mo`
    : '—'
  const fields = [
    { id: 'name', label: 'Full name', value: userInfo.name || '—' },
    { id: 'email', label: 'Email', value: userInfo.email || '—' },
    { id: 'age', label: 'Age', value: userInfo.age || '—' },
    { id: 'household', label: 'Household size', value: userInfo.householdSize || '—' },
    { id: 'income', label: 'Monthly income', value: monthlyIncome },
    { id: 'address', label: 'Address', value: `1234 Telegraph Ave, Berkeley, ${userInfo.state}` },
    { id: 'ssn', label: 'SSN', value: '•••-••-••••' },
  ]

  // A field is filled once the step that fills it has completed.
  const filledIds = STEPS.slice(0, currentStep).flatMap((step) => step.fills)
  const progress = Math.round((currentStep / STEPS.length) * 100)

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" color="primary">
            Applying to {program ? program.name : 'program'}
          </Typography>
          <Chip
            label={done ? 'Submitted' : 'Agent working…'}
            color={done ? 'success' : 'info'}
          />
        </Stack>

        {done && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Application submitted! Confirmation #CF-2026-04821. Status:{' '}
            <strong>In progress</strong> with the county.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Mock browser window showing the portal being auto-filled */}
          <Grid size={{ xs: 12, md: 7 }}>
            <BrowserWindow fields={fields} filledIds={filledIds} />
          </Grid>

          {/* Live activity log */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Agent activity
                </Typography>
                {!done && (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ mb: 2 }}
                  />
                )}
                <Stack spacing={1.5}>
                  {STEPS.map((step, i) => (
                    <ActivityRow
                      key={i}
                      label={step.label}
                      state={
                        currentStep > i
                          ? 'done'
                          : currentStep === i
                            ? 'active'
                            : 'pending'
                      }
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button onClick={onBack} sx={{ mt: 3 }}>
          ← Back to dashboard
        </Button>
      </Container>
    </Box>
  )
}

// One row in the activity log, styled by state.
function ActivityRow({ label, state }) {
  let icon
  if (state === 'done') {
    icon = <CheckCircleIcon color="success" fontSize="small" />
  } else if (state === 'active') {
    icon = <CircularProgress size={16} />
  } else {
    icon = (
      <Box
        sx={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'divider',
        }}
      />
    )
  }
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      {icon}
      <Typography
        variant="body2"
        color={state === 'pending' ? 'text.disabled' : 'text.primary'}
      >
        {label}
      </Typography>
    </Stack>
  )
}

// A faux browser chrome around the application form.
function BrowserWindow({ fields, filledIds }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      {/* Chrome bar */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ bgcolor: 'grey.100', px: 2, py: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Stack direction="row" spacing={0.75}>
          <Dot color="#ff5f56" />
          <Dot color="#ffbd2e" />
          <Dot color="#27c93f" />
        </Stack>
        <Box
          sx={{
            flex: 1,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 5,
            px: 1.5,
            py: 0.5,
            fontSize: 13,
            color: 'text.secondary',
          }}
        >
          🔒 benefitscal.com/apply/calfresh
        </Box>
      </Stack>

      {/* Portal "page" */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          CalFresh Application
        </Typography>
        <Stack spacing={1.5}>
          {fields.map((field) => (
            <PortalField
              key={field.id}
              label={field.label}
              value={field.value}
              filled={filledIds.includes(field.id)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

// One field on the mock portal: empty until the agent fills it.
function PortalField({ label, value, filled }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box
        sx={{
          mt: 0.5,
          px: 1.5,
          py: 1,
          minHeight: 38,
          borderRadius: 1,
          border: '1px solid',
          borderColor: filled ? 'success.light' : 'divider',
          bgcolor: filled ? '#e8f5e9' : 'grey.50',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.3s ease',
        }}
      >
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
