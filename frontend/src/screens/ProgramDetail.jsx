import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
// The per-program application screen (whiteboard: "In-Progress" / CalFresh
// detail). Collects the info the program needs, then hands off to the agent
// view to auto-fill the real portal.
export default function ProgramDetail({ program, onStartAgent, onBack }) {
  // One value per requirement, keyed by requirement id.
  // Text/SSN store the typed string; file inputs store the chosen file name.
  const [inputs, setInputs] = useState({})

  if (!program) {
    return (
      <Box sx={{ minHeight: '100vh', py: 6 }}>
        <Container maxWidth="md">
          <Typography>Program not found.</Typography>
          <Button onClick={onBack} sx={{ mt: 2 }}>
            ← Back to dashboard
          </Button>
        </Container>
      </Box>
    )
  }

  function setValue(id, value) {
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  function handleFile(id, e) {
    const file = e.target.files[0]
    if (file) setValue(id, file.name)
  }

  // Submit is enabled once the typed fields are filled. File uploads are
  // optional so a demo can move forward quickly.
  const typedFields = program.requirements.filter((req) => req.type !== 'file')
  const allFilled = typedFields.every(
    (req) => inputs[req.id] && inputs[req.id].trim() !== '',
  )

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" color="primary">
            {program.name}
          </Typography>
          <Chip label="Action needed" color="warning" />
        </Stack>

        {/* About the program */}
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" color="primary">
              {program.estimate}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {program.description}
            </Typography>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              What {program.name} needs from you
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We'll use this to fill out your application automatically.
            </Typography>

            <Stack spacing={2}>
              {program.requirements.map((req) => (
                <RequirementInput
                  key={req.id}
                  req={req}
                  value={inputs[req.id] || ''}
                  onText={(v) => setValue(req.id, v)}
                  onFile={(e) => handleFile(req.id, e)}
                />
              ))}
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              disabled={!allFilled}
              onClick={() => onStartAgent(program.id)}
            >
              Submit & let the agent apply
            </Button>
          </CardContent>
        </Card>

        <Button onClick={onBack} sx={{ mt: 3 }}>
          ← Back to dashboard
        </Button>
      </Container>
    </Box>
  )
}

// Renders the right input based on the requirement's type.
function RequirementInput({ req, value, onText, onFile }) {
  if (req.type === 'file') {
    return (
      <Button
        variant="outlined"
        component="label"
        sx={{ justifyContent: 'flex-start' }}
      >
        {value ? `✓ ${value}` : `Upload ${req.label} (optional)`}
        <input type="file" hidden onChange={onFile} />
      </Button>
    )
  }

  return (
    <TextField
      label={req.label}
      fullWidth
      value={value}
      onChange={(e) => onText(e.target.value)}
      placeholder={req.type === 'ssn' ? '***-**-****' : ''}
    />
  )
}
