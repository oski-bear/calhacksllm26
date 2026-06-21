import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material'

// Shown while we wait for the eligibility results from the backend.
export function LoadingScreen() {
  return (
    <Centered>
      <CircularProgress />
      <Typography variant="h6" color="text.secondary">
        Finding the programs you qualify for…
      </Typography>
    </Centered>
  )
}

// Shown if the request to the backend fails.
export function ErrorScreen({ message, onRetry }) {
  return (
    <Centered>
      <Alert severity="error" sx={{ width: '100%' }}>
        We couldn't reach the server. Make sure the backend is running.
        {message ? ` (${message})` : ''}
      </Alert>
      <Button variant="contained" onClick={onRetry}>
        Back to form
      </Button>
    </Centered>
  )
}

function Centered({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={2} alignItems="center">
          {children}
        </Stack>
      </Container>
    </Box>
  )
}
