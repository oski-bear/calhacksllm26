import { useState, useRef, useCallback } from 'react'
import {
  Alert, Box, Button, CircularProgress, Typography,
} from '@mui/material'
import MicIcon from '@mui/icons-material/Mic'
import StopIcon from '@mui/icons-material/Stop'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { parseVoiceIntake } from '../api.js'

const TEAL = '#0d7d6f'

const isSupported =
  typeof window !== 'undefined' &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition)

export default function VoiceIntakeButton({ onIntake }) {
  const [phase, setPhase] = useState('idle') // idle | listening | processing | done | error
  const [liveText, setLiveText] = useState('')
  const [extracted, setExtracted] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  // Refs survive re-renders inside async callbacks
  const recognitionRef = useRef(null)
  const finalRef = useRef('')
  const phaseRef = useRef('idle')

  const changePhase = (p) => { phaseRef.current = p; setPhase(p) }

  const submit = useCallback(async () => {
    const text = finalRef.current.trim()
    if (!text) { changePhase('idle'); return }
    changePhase('processing')
    try {
      const parsed = await parseVoiceIntake(text)
      setExtracted(parsed.fieldsExtracted || [])
      changePhase('done')
      onIntake(parsed)
    } catch (err) {
      setErrorMsg(err.message || 'Could not understand the response.')
      changePhase('error')
    }
  }, [onIntake])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    finalRef.current = ''
    setLiveText('')
    changePhase('listening')

    rec.onresult = (event) => {
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalRef.current += chunk + ' '
        } else {
          interim = chunk
        }
      }
      setLiveText((finalRef.current + interim).trim())
    }

    rec.onerror = (event) => {
      if (event.error === 'aborted') return
      setErrorMsg(`Microphone error: ${event.error}`)
      changePhase('error')
    }

    // Single submission point — fires whether user clicks Done or silence stops it
    rec.onend = () => {
      if (phaseRef.current === 'listening') submit()
    }

    recognitionRef.current = rec
    rec.start()
  }, [submit])

  const stopListening = useCallback(() => {
    // Changing phase before stop() prevents onend from being ignored
    phaseRef.current = 'processing'
    recognitionRef.current?.stop()
    submit()
  }, [submit])

  const reset = () => {
    finalRef.current = ''
    setLiveText('')
    setExtracted([])
    setErrorMsg('')
    changePhase('idle')
  }

  if (!isSupported) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Voice intake works in Chrome and Edge. You can still fill the form manually below.
      </Alert>
    )
  }

  return (
    <Box sx={{
      mb: 3, p: 2.5, borderRadius: 2,
      background: 'linear-gradient(135deg, #e6f3f2 0%, #d0ebe8 100%)',
      border: '1px solid', borderColor: 'primary.light',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <AutoAwesomeIcon sx={{ color: TEAL, fontSize: 18 }} />
        <Typography variant="subtitle2" color="primary" fontWeight={700}>
          Tell us your situation
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Speak naturally and we'll fill the form for you.{' '}
        <em>"I'm a single mom with 2 kids in Berkeley, I make about $1,800 a month…"</em>
      </Typography>

      {phase === 'idle' && (
        <Button
          variant="contained" color="primary" startIcon={<MicIcon />}
          onClick={startListening}
          sx={{ borderRadius: 5, px: 2.5 }}
        >
          Start speaking
        </Button>
      )}

      {phase === 'listening' && (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%', bgcolor: '#ef4444', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'micPulse 1.2s ease-in-out infinite',
              '@keyframes micPulse': {
                '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.5)' },
                '60%': { boxShadow: '0 0 0 12px rgba(239,68,68,0)' },
              },
            }}>
              <MicIcon sx={{ color: 'white', fontSize: 18 }} />
            </Box>
            <Typography variant="caption" color="error.main" fontWeight={700} sx={{ mr: 'auto' }}>
              Listening…
            </Typography>
            <Button
              size="small" variant="outlined" color="error"
              startIcon={<StopIcon />} onClick={stopListening}
              sx={{ borderRadius: 5, flexShrink: 0 }}
            >
              Done
            </Button>
          </Box>

          <Box sx={{
            p: 1.5, bgcolor: 'rgba(255,255,255,0.75)', borderRadius: 1.5,
            border: '1px solid #d0e8e5', minHeight: 48,
          }}>
            <Typography variant="body2" color={liveText ? 'text.primary' : 'text.disabled'} sx={{ fontStyle: 'italic' }}>
              {liveText || 'Say something…'}
            </Typography>
          </Box>
        </Box>
      )}

      {phase === 'processing' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
          <CircularProgress size={20} color="primary" />
          <Typography variant="body2" color="text.secondary">
            Extracting your details…
          </Typography>
        </Box>
      )}

      {phase === 'done' && (
        <Box>
          <Alert
            severity="success"
            icon={<AutoAwesomeIcon fontSize="inherit" />}
            sx={{ mb: 1.5, alignItems: 'flex-start' }}
          >
            <strong>Form pre-filled from your voice!</strong>
            {extracted.length > 0 && (
              <Box component="span" sx={{ display: 'block', mt: 0.5, fontSize: '0.8rem' }}>
                Filled: {extracted.join(' · ')}
              </Box>
            )}
          </Alert>
          <Button size="small" onClick={reset} startIcon={<MicIcon />}>
            Speak again
          </Button>
        </Box>
      )}

      {phase === 'error' && (
        <Box>
          <Alert severity="error" sx={{ mb: 1 }}>{errorMsg}</Alert>
          <Button size="small" onClick={reset}>Try again</Button>
        </Box>
      )}
    </Box>
  )
}
