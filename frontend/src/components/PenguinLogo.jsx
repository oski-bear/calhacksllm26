import { Box } from '@mui/material'
import penguinVideo from '../assets/Make_this_penguin_turn_around_and_start_dancing_like_nicki_minaj_seed1286660724.mp4'

export default function PenguinLogo({ size = 42, sx }) {
  return (
    <Box
      component="video"
      src={penguinVideo}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label="BridgeBenefits penguin mascot"
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        display: 'block',
        flex: '0 0 auto',
        bgcolor: 'white',
        border: '2px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
        ...sx,
      }}
    />
  )
}
