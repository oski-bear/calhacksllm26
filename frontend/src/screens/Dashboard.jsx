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
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlineOutlined'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'

const TEAL = '#0d7d6f'

const STATUS_STYLES = {
  eligible: { label: 'Likely eligible', color: 'success', Icon: CheckCircleIcon },
  maybe: { label: 'May qualify', color: 'warning', Icon: HelpOutlineIcon },
}

export default function Dashboard({
  userInfo,
  programs,
  summary,
  explaining,
  onSelectProgram,
  onStartAgent,
  onEditProfile,
}) {
  const order = { eligible: 0, maybe: 1 }
  const shown = programs
    .filter((p) => p.status === 'eligible' || p.status === 'maybe')
    .sort((a, b) => order[a.status] - order[b.status])

  const featured = shown.filter((p) => p.auto_apply && p.status === 'eligible')
  const others = shown.filter((p) => !featured.includes(p))
  const firstName = userInfo.name ? userInfo.name.split(' ')[0] : 'there'

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
            {featured.length > 0
              ? `We can auto-apply to ${featured.length} program${featured.length === 1 ? '' : 's'} right now, plus ${others.length} more worth reviewing.`
              : shown.length > 0
                ? `We found ${shown.length} program${shown.length === 1 ? '' : 's'} you may qualify for.`
                : 'Based on what you entered, we did not find programs you qualify for. You can go back and adjust your info.'}
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
                <ProgramCard key={program.id} program={program} onAction={onSelectProgram} />
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  )
}

function ProgramCard({ program, featured, onAction }) {
  const style = STATUS_STYLES[program.status]
  const StatusIcon = style.Icon
  const reasons = (program.reasons || []).filter((r) => !r.startsWith('Source:'))
  const source = (program.reasons || []).find((r) => r.startsWith('Source:'))

  return (
    <Card
      variant="outlined"
      sx={featured ? { borderColor: TEAL, borderWidth: 2, bgcolor: '#f6fbfa' } : undefined}
    >
      <CardContent>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <Box>
            <Typography variant={featured ? 'h6' : 'subtitle1'} fontWeight={700}>
              {program.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {program.category} - {program.agency}
            </Typography>
          </Box>
          <Chip icon={<StatusIcon />} label={style.label} color={style.color} size="small" />
        </Stack>

        <Typography variant="subtitle1" color="primary" sx={{ mt: 2 }}>
          {program.estimate}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {program.description}
        </Typography>

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
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          variant={featured ? 'contained' : 'outlined'}
          color="primary"
          startIcon={featured ? <AutoAwesomeIcon /> : null}
          onClick={() => onAction(program.id)}
        >
          {featured ? 'Auto-apply with AI agent' : 'Start application'}
        </Button>
      </CardActions>
    </Card>
  )
}
