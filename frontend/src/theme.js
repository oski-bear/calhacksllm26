import { createTheme } from '@mui/material/styles'

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
    button: { fontWeight: 700, letterSpacing: '0.06em' },
  },
  components: {
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 0, backgroundColor: '#dde8e7' },
        bar: { backgroundColor: '#0d7d6f', borderRadius: 0 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'uppercase', boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
  },
})

export default theme
