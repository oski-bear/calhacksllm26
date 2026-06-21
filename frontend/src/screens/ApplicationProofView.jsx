import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { programMeta } from '../data/programMetadata.js'

export default function ApplicationProofView({ program, application, onBack }) {
  if (!program || !application) {
    return (
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Typography>Application proof not found.</Typography>
          <Button onClick={onBack} sx={{ mt: 2 }}>Back to dashboard</Button>
        </Container>
      </Box>
    )
  }

  const meta = programMeta(program.id)
  const fieldCount = Number(application.verified_field_count || 0)
  const controlCount = Number(application.verified_control_count || 0)
  const verified = application.mode === 'browserbase' && application.confirmation_verified
  const portalUrl = application.portal_url || meta?.applyUrl || ''

  return (
    <Box sx={{ minHeight: '100vh', py: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <AutoAwesomeIcon color="primary" />
            <Box>
              <Typography variant="h4" color="primary">
                Agent proof for {program.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saved audit trail from the completed auto-apply run.
              </Typography>
            </Box>
          </Stack>
          <Chip color={verified ? 'success' : 'warning'} label={verified ? 'Browserbase verified' : 'Saved proof'} />
        </Stack>

        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
          {application.confirmation || 'Application workflow completed.'}
        </Alert>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <BrowserChrome url={portalUrl}>
              <Box sx={{ p: 2, bgcolor: 'white' }}>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1, mb: 1.5 }}>
                  <Chip size="small" color={verified ? 'success' : 'default'} label={verified ? 'Portal confirmation verified' : 'Confirmation saved'} />
                  <Chip size="small" variant="outlined" label={`${fieldCount} fields verified`} />
                  <Chip size="small" variant="outlined" label={`${controlCount} controls verified`} />
                  {application.session_id && <Chip size="small" variant="outlined" label={`Session ${application.session_id}`} />}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  This page is available after leaving the original agent run, so judges can return to the submitted portal proof without rerunning Browserbase.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', rowGap: 1 }}>
                  {application.live_view_url && (
                    <Button
                      component="a"
                      href={application.live_view_url}
                      target="_blank"
                      rel="noreferrer"
                      size="small"
                      variant="outlined"
                    >
                      Reopen Browserbase session
                    </Button>
                  )}
                  {application.screenshot && (
                    <Button
                      component="a"
                      href={`data:image/png;base64,${application.screenshot}`}
                      target="_blank"
                      rel="noreferrer"
                      size="small"
                      variant="outlined"
                    >
                      Open full screenshot
                    </Button>
                  )}
                </Stack>
              </Box>
              <Divider />
              <Box sx={{ p: 2, bgcolor: '#f8fafc' }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Saved submitted portal screenshot
                </Typography>
                {application.screenshot ? (
                  <Box
                    component="img"
                    alt={`${program.name} saved agent proof`}
                    src={`data:image/png;base64,${application.screenshot}`}
                    sx={{ display: 'block', width: '100%', border: '1px solid', borderColor: 'divider', borderRadius: 1, bgcolor: 'white' }}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No screenshot was saved for this application.
                  </Typography>
                )}
              </Box>
            </BrowserChrome>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>What the agent proved</Typography>
                <Stack spacing={1.25}>
                  <ProofRow label="Opened the routed public portal URL" done />
                  <ProofRow label={`Verified ${fieldCount} mapped profile fields`} done={fieldCount > 0} />
                  <ProofRow label={`Verified ${controlCount} portal actions`} done={controlCount > 0} />
                  <ProofRow label="Captured a portal confirmation number" done={Boolean(application.confirmation)} />
                  <ProofRow label="Saved a screenshot back to the dashboard" done={Boolean(application.screenshot)} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button onClick={onBack} sx={{ mt: 3 }}>Back to dashboard</Button>
      </Container>
    </Box>
  )
}

function ProofRow({ label, done }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <CheckCircleIcon color={done ? 'success' : 'disabled'} fontSize="small" />
      <Typography variant="body2" color={done ? 'text.primary' : 'text.secondary'}>
        {label}
      </Typography>
    </Stack>
  )
}

function BrowserChrome({ url, children }) {
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'white' }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', bgcolor: 'grey.100', px: 2, py: 1.25 }}>
        <Stack direction="row" spacing={0.75}>
          <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#ff5f57' }} />
          <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#febc2e' }} />
          <Box sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: '#28c840' }} />
        </Stack>
        <Box sx={{ flex: 1, bgcolor: 'white', borderRadius: 999, border: '1px solid', borderColor: 'divider', px: 2, py: 0.5 }}>
          <Typography variant="caption" color="text.secondary">🔒 {url}</Typography>
        </Box>
      </Stack>
      {children}
    </Box>
  )
}
