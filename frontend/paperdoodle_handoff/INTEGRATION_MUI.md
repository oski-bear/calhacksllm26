# Applying Paperdoodle to the Benefits-Navigator frontend (MUI edition)

Your frontend is **React 19 + Vite + MUI (Material UI 9) + Emotion**, themed through
`src/theme.js`. The right way to "Paperdoodle-ify" an MUI app is **NOT** to import the
design system's raw web-component bundle — MUI owns the rendering. Instead:

1. **Load the Paperdoodle tokens + fonts as global CSS** (CSS variables + Google Fonts).
2. **Rewrite `src/theme.js`** so the MUI theme reads those tokens — palette, typography,
   shape (the hand-drawn wobble), shadows, and per-component `styleOverrides`.
3. **Add a few brand flourishes** as small local components (WashiTape, WrittenHeading,
   Highlight) ported from `design_system/components/` — these have no MUI equivalent.

The result: every existing `<Button>`, `<Card>`, `<Paper>`, `<Chip>`, `<TextField>`,
`<AppBar>` etc. inherits the paper/ink/marker look automatically, with minimal changes
to your screens.

---

## Step 1 — Drop in the design system

Copy this whole `design_system/` folder into the app, e.g.
`src/theme/paperdoodle/`. Then load the tokens once, before the app mounts.

In `src/main.jsx` (or `index.css`):
```js
import './theme/paperdoodle/styles.css';   // pulls in every token + the Google Fonts
```
`styles.css` `@import`s `tokens/fonts.css` (Caveat, Patrick Hand, Kalam, Gloria
Hallelujah) and all the token files, exposing CSS variables like `--paper-100`,
`--ink-800`, `--accent`, `--font-marker`, `--radius-sketch-1`, `--shadow-paper`, etc.
Read `design_system/readme.md` for the full aesthetic spec (voice, wobble, shadows,
motion) and `tokens/*.css` for exact values.

> Fonts: `tokens/fonts.css` uses Google Fonts `@import`. Fine for a hackathon. For a
> production build, self-host or use `@fontsource/*` instead.

---

## Step 2 — Rewrite `src/theme.js` as a Paperdoodle MUI theme

Read the token CSS for exact values, then build a theme like this (starting point —
tune against the tokens):

```js
import { createTheme } from '@mui/material/styles';

// Pull values straight from design_system/tokens/*.css
const paper   = { 50:'#FFFDF6', 100:'#FBF6E9', 200:'#F4ECD8', 300:'#EDE0C4', 400:'#E2D1AC' };
const ink     = { 900:'#221F1A', 800:'#2B2620', 600:'#5B5347', 400:'#8C8270', 300:'#B3A98F', 100:'#CFC4A6' };
const penBlue = '#2D5BA8', penBlueInk = '#1E3F77';
const lavender = '#E0D4F2', lavenderInk = '#6B4FA0';
const penRed  = '#CB4536';

// the signature "drawn-by-hand" corner — asymmetric multi-value radius
const sketch1 = '14px 8px 18px 6px / 8px 16px 6px 14px';
const sketch2 = '10px 14px 8px 16px / 14px 8px 16px 10px';
const inkShadow = '2px 3px 0 ' + ink[800];
const liftShadow = '4px 6px 0 ' + ink[800];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: penBlue, dark: penBlueInk, contrastText: paper[50] },
    secondary: { main: lavender, contrastText: lavenderInk },
    error:     { main: penRed },
    text:      { primary: ink[900], secondary: ink[600] },
    background:{ default: paper[100], paper: paper[50] },
    divider:   ink[100],
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Kalam", system-ui, cursive',       // body
    h1: { fontFamily: '"Caveat", cursive', fontWeight: 700, fontSize: '3.5rem' },
    h2: { fontFamily: '"Caveat", cursive', fontWeight: 700 },
    h3: { fontFamily: '"Patrick Hand", cursive' },
    h4: { fontFamily: '"Patrick Hand", cursive' },
    h5: { fontFamily: '"Patrick Hand", cursive' },
    h6: { fontFamily: '"Patrick Hand", cursive' },
    button: { fontFamily: '"Patrick Hand", cursive', fontWeight: 400, letterSpacing: '0.6px', textTransform: 'uppercase' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // subtle two-layer paper grain — see tokens/base.css --paper-grain
          backgroundColor: paper[100],
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'contained' },
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
        containedPrimary:   { borderColor: penBlueInk },
        containedSecondary: { borderColor: lavenderInk, color: lavenderInk },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: paper[50] },
        outlined: { border: `2px solid ${ink[800]}`, borderRadius: sketch1 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: `2px solid ${ink[800]}`, borderRadius: sketch1, boxShadow: inkShadow },
      },
    },
    MuiChip: {  // ← use this for the "Badge" look
      styleOverrides: {
        root: { border: `2px solid ${ink[800]}`, borderRadius: '8px 12px 7px 11px', fontFamily: '"Patrick Hand", cursive', transform: 'rotate(-1deg)' },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: sketch2, backgroundColor: paper[50] },
        notchedOutline: { borderWidth: 2, borderColor: ink[800] },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'transparent' },
      styleOverrides: { root: { borderBottom: `2px solid ${ink[800]}`, backdropFilter: 'blur(4px)' } },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 10, border: `2px solid ${ink[800]}`, borderRadius: 6, backgroundColor: paper[300] },
        bar: { backgroundColor: penBlue },
      },
    },
  },
});

export default theme;
```

This keeps your existing screens working — they already use MUI components, so they
restyle automatically. Spot-fix anything that looks off (hard-coded colors like
`#0d7d6f`, custom `sx` shadows, etc.).

---

## Step 3 — Brand flourishes (no MUI equivalent)

Port these from `design_system/components/` into `src/components/paperdoodle/` and use
them sparingly:
- **`WrittenHeading`** — the signature "being written" header. Good for the app title /
  section openers (e.g. the Dashboard heading, "hello, I'm —" style).
- **`WashiTape`** — taped labels for cards/status pills.
- **`Highlight`** — highlighter swipe behind a key word.
- **`Card`, `Badge`, `Button`, `Input`, `Checkbox`, `Divider`** — these are the
  reference implementations; you generally DON'T need them (MUI covers it via the theme
  above), but read them to copy exact wobble/tilt/shadow values.

The components are written for `window.React` globals from the bundle; when porting to
your Vite app, change the top to `import React from 'react'` and export normally.

---

## Step 4 — App-specific notes (calhacksllm26)
- `src/theme.js` currently uses teal `#0d7d6f` (primary) + indigo. Replace with the
  palette above. Grep the codebase for hard-coded `#0d7d6f`, `#3f51b5`, `#f5f7fa` and
  route them to theme tokens.
- `BenHeader.jsx` / `PenguinLogo.jsx`: re-skin the header with the `MuiAppBar` override
  + optionally a `WrittenHeading` wordmark. The penguin logo can stay; give its
  container the ink border + tilt if you want it to feel drawn.
- Screens (`Dashboard`, `AgentView`, `ProgramDetail`, the forms, `StatusScreens`): no
  structural changes needed — verify each after the theme swap and fix one-off `sx`
  colors/shadows.
- **Voice:** Paperdoodle is warm, first-person, sentence-case. Buttons/labels in
  UPPERCASE marker. No emoji — use drawn marks (✦ ✓ →) sparingly. Re-tone the copy if
  you want full immersion.
- **Don't overuse** the tilt/wobble on dense data tables — it gets noisy. Reserve tilt
  for cards, buttons, badges, and tape labels; keep tables/rows straight.

## Optional: the shader wallpaper
You already have `design_handoff_shader_wallpapers/` in `src/assets/`. To use it as an
animated background (e.g. behind the dashboard hero or a loading screen), mount a
`<canvas>` and the `PDWallpaper` engine — see that folder's README. It's plain WebGL and
works inside any React component via a `useEffect`/`ref`.
