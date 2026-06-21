import { createTheme } from '@mui/material/styles'

// Paperdoodle — warm hand-drawn paper-and-ink theme.
// Values mirror src/theme/paperdoodle/tokens/*.css. This MUI theme is the main
// lever: every <Button>/<Card>/<Paper>/<Chip>/<TextField>/<AppBar> picks up the
// paper/ink/marker look automatically.

const paper = { 50: '#FFFDF6', 100: '#FBF6E9', 200: '#F4ECD8', 300: '#EDE0C4', 400: '#E2D1AC' }
const ink = { 900: '#221F1A', 800: '#2B2620', 600: '#5B5347', 400: '#8C8270', 300: '#B3A98F', 100: '#CFC4A6' }
const penBlue = '#2D5BA8'
const penBlueInk = '#1E3F77'
const lavender = '#E0D4F2'
const lavenderInk = '#6B4FA0'
const penRed = '#CB4536'
const mint = '#BFE3C2'
const mintInk = '#1c7c54'
const hiYellow = '#F6DE71'

// Signature drawn-by-hand corners — asymmetric multi-value radii (subtle, not the
// extreme token values which are too wild for dense UI).
const sketch1 = '14px 8px 18px 6px / 8px 16px 6px 14px'
const sketch2 = '10px 14px 8px 16px / 14px 8px 16px 10px'
const inkShadow = `2px 3px 0 ${ink[800]}`
const liftShadow = `4px 6px 0 ${ink[800]}`

const marker = '"Patrick Hand", "Comic Sans MS", cursive'
const script = '"Caveat", "Segoe Script", cursive'
const body = '"Kalam", "Patrick Hand", system-ui, cursive'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: penBlue, dark: penBlueInk, light: '#DCE6F5', contrastText: paper[50] },
    secondary: { main: lavender, dark: lavenderInk, contrastText: lavenderInk },
    error: { main: penRed },
    success: { main: mintInk, light: mint, contrastText: paper[50] },
    warning: { main: '#B8860B', light: hiYellow },
    info: { main: penBlue, light: '#DCE6F5' },
    text: { primary: ink[900], secondary: ink[600], disabled: ink[300] },
    background: { default: paper[100], paper: paper[50] },
    divider: ink[100],
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: body,
    fontSize: 15,
    h1: { fontFamily: script, fontWeight: 700, letterSpacing: '-0.5px' },
    h2: { fontFamily: script, fontWeight: 700, letterSpacing: '-0.5px' },
    h3: { fontFamily: marker, fontWeight: 400 },
    h4: { fontFamily: marker, fontWeight: 400, letterSpacing: '0.2px' },
    h5: { fontFamily: marker, fontWeight: 400 },
    h6: { fontFamily: marker, fontWeight: 400 },
    subtitle1: { fontFamily: marker, fontWeight: 400 },
    subtitle2: { fontFamily: marker, fontWeight: 400, letterSpacing: '0.4px' },
    overline: { fontFamily: marker, fontWeight: 400, letterSpacing: '0.12em' },
    button: { fontFamily: marker, fontWeight: 400, letterSpacing: '0.6px', textTransform: 'uppercase' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: paper[100],
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(120,100,60,0.04) 0 1px, transparent 1px), ' +
            'radial-gradient(circle at 70% 60%, rgba(120,100,60,0.035) 0 1px, transparent 1px)',
          backgroundSize: '7px 7px, 9px 9px',
          backgroundPosition: '0 0, 3px 4px',
        },
        '::selection': { background: hiYellow, color: ink[900] },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          border: `2px solid ${ink[800]}`,
          borderRadius: sketch2,
          boxShadow: inkShadow,
          transform: 'rotate(-0.8deg)',
          transition: 'transform .15s cubic-bezier(.34,1.56,.64,1), box-shadow .15s',
          '&:hover': { transform: 'rotate(0deg) translate(-1px,-1px)', boxShadow: liftShadow },
          '&:active': { transform: 'translate(1px,2px)', boxShadow: '1px 1px 0 rgba(34,31,26,.2)' },
        },
        containedPrimary: { borderColor: penBlueInk },
        containedSecondary: { borderColor: lavenderInk, color: lavenderInk },
        text: { border: 'none', boxShadow: 'none', transform: 'none', '&:hover': { boxShadow: 'none', transform: 'none', background: paper[200] } },
        outlined: { borderWidth: 2, '&:hover': { borderWidth: 2 } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: paper[50], backgroundImage: 'none' },
        outlined: { border: `2px solid ${ink[800]}`, borderRadius: sketch1 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `2px solid ${ink[800]}`, borderRadius: sketch1, boxShadow: inkShadow, backgroundColor: paper[50] },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          border: `2px solid ${ink[800]}`,
          borderRadius: '8px 12px 7px 11px',
          fontFamily: marker,
          fontWeight: 400,
          transform: 'rotate(-1deg)',
          backgroundColor: paper[200],
        },
        colorSuccess: { backgroundColor: mint, color: ink[900], borderColor: mintInk },
        colorWarning: { backgroundColor: hiYellow, color: ink[900], borderColor: '#B8860B' },
        colorInfo: { backgroundColor: '#DCE6F5', color: penBlueInk, borderColor: penBlueInk },
        colorError: { backgroundColor: '#F6DCD6', color: penRed, borderColor: penRed },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: sketch2, backgroundColor: paper[50] },
        notchedOutline: { borderWidth: 2, borderColor: ink[800] },
      },
    },
    MuiInputLabel: { styleOverrides: { root: { fontFamily: marker } } },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: {
        root: { borderBottom: `2px solid ${ink[800]}`, backgroundColor: paper[50], backdropFilter: 'blur(4px)' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { border: `2px solid ${ink[800]}`, borderRadius: sketch2, fontFamily: body },
        standardSuccess: { backgroundColor: mint, color: ink[900] },
        standardInfo: { backgroundColor: '#DCE6F5', color: ink[900] },
        standardWarning: { backgroundColor: hiYellow, color: ink[900] },
        standardError: { backgroundColor: '#F6DCD6', color: ink[900] },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 12, border: `2px solid ${ink[800]}`, borderRadius: 8, backgroundColor: paper[300] },
        bar: { backgroundColor: penBlue, borderRadius: 0 },
      },
    },
    MuiDivider: { styleOverrides: { root: { borderColor: ink[100] } } },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: ink[800], fontFamily: body, fontSize: 13, border: `1.5px solid ${ink[900]}` },
      },
    },
    MuiCheckbox: { styleOverrides: { root: { color: ink[400] } } },
  },
})

export default theme
