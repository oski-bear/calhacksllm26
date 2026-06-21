import { createTheme } from '@mui/material/styles'

// A calm, civic-feeling theme. Teal primary = "support / assistance".
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0d7d6f' },
    secondary: { main: '#3f51b5' },
    background: { default: '#f5f7fa', paper: '#ffffff' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
})

export default theme
