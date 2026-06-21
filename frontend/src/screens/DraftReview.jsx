import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { fetchDraft } from '../api.js'

// Review step: Claude drafts the application answers, the user reads/edits
// them, then proceeds to the agent. If drafting fails (e.g. no API key), the
// user can still continue — the agent fills what it can.
export default function DraftReview({ program, userInfo, onProceed, onBack }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statement, setStatement] = useState('')
  const [answers, setAnswers] = useState([])

  useEffect(() => {
    let active = true
    fetchDraft(userInfo, program.id)
      .then((data) => {
        if (!active) return
        setStatement(data.statement || '')
        setAnswers(data.answers || [])
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [program.id, userInfo])

  function updateAnswer(index, value) {
    setAnswers((prev) =>
      prev.map((a, i) => (i === index ? { ...a, answer: value } : a)),
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h4" color="primary">
            Review your {program.name} application
          </Typography>
          <Typography variant="body1" color="text.secondary">
            We drafted these answers from your info. Edit anything that needs
            fixing, then let the agent submit it for you.
          </Typography>
        </Stack>

        {loading ? (
          <Stack direction="row" spacing={1.5} sx={{ py: 4, alignItems: 'center' }}>
            <CircularProgress size={20} />
            <Typography color="text.secondary">
              Drafting your application with Claude…
            </Typography>
          </Stack>
        ) : (
          <>
            {error && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                We couldn't draft this automatically (the AI key may not be set).
                You can still continue and the agent will fill what it can.
              </Alert>
            )}

            {!error && (
              <Stack spacing={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Your situation statement
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      value={statement}
                      onChange={(e) => setStatement(e.target.value)}
                    />
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Application answers
                    </Typography>
                    <Stack spacing={2.5}>
                      {answers.map((item, index) => (
                        <Box key={index}>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {item.question}
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            value={item.answer}
                            onChange={(e) => updateAnswer(index, e.target.value)}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{ mt: 3 }}
              onClick={onProceed}
            >
              Looks good — let the agent apply →
            </Button>
          </>
        )}

        <Button onClick={onBack} sx={{ mt: 2 }}>
          ← Back to dashboard
        </Button>
      </Container>
    </Box>
  )
}
