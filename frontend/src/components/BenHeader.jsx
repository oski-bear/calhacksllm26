import { Box, Stack, Typography } from '@mui/material'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

const NAVY = '#1D3057'
const ORANGE = '#D96027'

export function BenHeader() {
  return (
    <Box sx={{ bgcolor: NAVY, py: 1.5, px: 3, display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          bgcolor: ORANGE,
          borderRadius: 1,
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 1.5,
          flexShrink: 0,
        }}
      >
        <CheckBoxIcon sx={{ color: 'white', fontSize: 22 }} />
      </Box>
      <Box>
        <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.1 }}>
          bridgebenefits
        </Typography>
        <Typography sx={{ color: '#9BA8BC', fontSize: '0.65rem', letterSpacing: '0.14em', fontWeight: 600 }}>
          CALIFORNIA
        </Typography>
      </Box>
    </Box>
  )
}

export function BenFooter() {
  return (
    <Box sx={{ bgcolor: NAVY, py: 3, px: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: ORANGE,
              borderRadius: 1,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckBoxIcon sx={{ color: 'white', fontSize: 18 }} />
          </Box>
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
            bridgebenefits
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          {['About', 'Privacy', 'Terms'].map((label) => (
            <Typography
              key={label}
              variant="caption"
              sx={{ color: '#9BA8BC', cursor: 'pointer', '&:hover': { color: 'white' } }}
            >
              {label}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Box>
  )
}
