import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'

// How each status should look. Keeps the JSX below clean.
const STATUS_STYLES = {
  eligible: { label: 'Likely eligible', color: 'success', Icon: CheckCircleIcon },
  maybe: { label: 'May qualify', color: 'warning', Icon: HelpOutlineIcon },
}

export default function Dashboard({ userInfo, programs, onSelectProgram, onBack }) {
  // Only show programs the user might get; ineligible ones are hidden.
  // Eligible first, then "maybe".
  const order = { eligible: 0, maybe: 1 }
  const shown = programs
    .filter((p) => p.status === 'eligible' || p.status === 'maybe')
    .sort((a, b) => order[a.status] - order[b.status])
  const eligibleCount = shown.filter((p) => p.status === 'eligible').length
  const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'there'

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary">
            Hi {firstName} — here's what you may qualify for
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {shown.length > 0
              ? `We found ${eligibleCount} program${
                  eligibleCount === 1 ? '' : 's'
                } you likely qualify for, plus a few more worth a look.`
              : 'Based on what you entered, we didn’t find programs you qualify for. You can go back and adjust your info.'}
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {shown.map((program) => {
            const style = STATUS_STYLES[program.status]
            const StatusIcon = style.Icon
            return (
              <Card key={program.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Box>
                      <Typography variant="h6">{program.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {program.category} · {program.agency}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<StatusIcon />}
                      label={style.label}
                      color={style.color}
                      size="small"
                    />
                  </Stack>

                  <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
                    {program.estimate}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {program.description}
                  </Typography>

                  {/* Why the engine reached this result */}
                  {program.reasons && program.reasons.length > 0 && (
                    <Stack spacing={0.25} sx={{ mt: 1.5 }}>
                      {program.reasons.map((reason, i) => (
                        <Typography key={i} variant="caption" color="text.secondary">
                          • {reason}
                        </Typography>
                      ))}
                    </Stack>
                  )}
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    variant={program.status === 'eligible' ? 'contained' : 'outlined'}
                    onClick={() => onSelectProgram(program.id)}
                  >
                    Start application
                  </Button>
                </CardActions>
              </Card>
            )
          })}
        </Stack>

        <Button onClick={onBack} sx={{ mt: 3 }}>
          ← Back to form
        </Button>
      </Container>
    </Box>
  )
}
