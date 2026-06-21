# Handoff: Paperdoodle Interactive Shader Wallpapers

## Overview
Five interactive WebGL "wallpaper" shaders for a hand-drawn, paper-themed OS
(the **Paperdoodle** design system). Each one fills the viewport, reacts to mouse
position in real time, and responds to clicks. They sit behind a lightweight
"desktop" chrome: a top menu bar with a live clock, and a bottom picker dock for
switching wallpapers.

The five wallpapers:
| # | Name | Behavior |
|---|------|----------|
| 1 | **Ink Bloom** | Ballpoint-blue ink blooms under the cursor; click flicks a soaking splat. |
| 2 | **Contours** | Hand-drawn topographic map that hills up around the cursor; click sends ripple rings. |
| 3 | **Highlighter** | Wobbly yellow/pink/mint marker rows light up near the cursor; click lays a swipe. |
| 4 | **Scribbles** | Pen-hatching flow field that swirls toward the cursor; click spins a vortex. |
| 5 | **Grid Lens** | Graph paper warped through a magnifier bubble; click drops a refraction wave. |

## About the Design Files
This bundle is a mix of **directly reusable production code** and **design reference**:

- **`shaders.js` and `webgl-wallpaper.js` are real, framework-agnostic code.** They
  are not throwaway mockups — the GLSL fragment shaders and the tiny WebGL renderer
  can be lifted into the target codebase nearly as-is. They depend only on plain
  WebGL1; no React, no build step, no third-party libraries.
- **`Paperdoodle Wallpapers.html` is a design reference** for the desktop chrome
  (menu bar + picker dock). It shows the intended look and behavior. Recreate that
  chrome using the target codebase's existing patterns and the Paperdoodle design
  system components — don't necessarily ship the raw HTML.

The task: **drop the shader engine into the app's environment** (React, Vue, Svelte,
plain JS, etc.) and **rebuild the picker chrome** in that environment using its
established component patterns.

## Fidelity
**High-fidelity.** Final colors, typography, motion and interactions. The shaders are
production-ready; the chrome should be recreated pixel-faithfully using the
Paperdoodle components.

---

## Architecture

```
┌─────────────────────────────────────────────┐
│  <canvas id="wp">   ← full-viewport, z:0      │  ← webgl-wallpaper.js renders here
│                                               │
│   [ top menu bar ]  ← z:20, paper + blur      │  ← chrome (React in the ref impl)
│                                               │
│        [ wallpaper picker dock ]  ← z:20      │
└─────────────────────────────────────────────┘
```

1. `shaders.js` defines `window.PD_SHADERS` — an ordered array of 5 shader defs:
   `{ id, name, tag, accent, frag }`. `frag` is a complete GLSL ES 1.00 fragment
   shader (a shared `COMMON` header + the per-effect `main`).
2. `webgl-wallpaper.js` defines `window.PDWallpaper(canvas)` — a minimal renderer:
   full-screen triangle, swappable fragment program, RAF loop, and uniform feeding.
3. The chrome (in the HTML, built with React + the Paperdoodle bundle) creates one
   `PDWallpaper`, calls `engine.setShader(PD_SHADERS[i])` on switch, and forwards
   pointer events.

### Reusing the engine (any framework)
```js
const engine = new PDWallpaper(canvasEl);
engine.setShader(PD_SHADERS[0]);              // pick a wallpaper
window.addEventListener('pointermove', e => engine.pointer(e.clientX, e.clientY));
window.addEventListener('pointerdown', e => engine.click(e.clientX, e.clientY));
```
`pointer(x,y)` and `click(x,y)` take **CSS pixels, top-left origin** (raw clientX/Y).
The engine normalizes and flips Y internally.

### Shader uniform contract
Every fragment shader receives:
| uniform | type | meaning |
|---|---|---|
| `u_res` | `vec2` | drawing-buffer size, px |
| `u_time` | `float` | seconds since start |
| `u_mouse` | `vec2` | smoothed pointer, `0..1`, **y up** |
| `u_mvel` | `vec2` | pointer velocity (per-frame, 0..1 space) |
| `u_ripples[12]` | `vec3[]` | `xy` = click pos (0..1), `z` = age in seconds; `z < 0` = inactive slot |

Clicks are stored as a ring of up to 12 ripples, each living `LIFE = 6s`
(see `webgl-wallpaper.js`). Shaders read the age (`z`) to animate splats/waves that
grow and fade.

### Important rendering note
The canvas is created with **`preserveDrawingBuffer: true`**. This is intentional:
with `alpha:false` and a throttled RAF (backgrounded tab, screenshot tooling), an
un-preserved buffer composites to **black**. Preserving it keeps the last frame on
screen. `setShader()` also draws **one frame immediately** so a switch repaints even
when RAF is paused. Keep both behaviors if you port the engine.

---

## Screens / Views

### 1. Desktop (the whole view)
- **Purpose:** ambient, fidget-able wallpaper; switch between five effects.
- **Layout:** full-viewport `<canvas>` fixed at `inset:0`, `z-index:0`,
  `cursor:crosshair`, `touch-action:none`. All chrome is `position:fixed` above it.

### 2. Top menu bar
- **Position/size:** fixed top, full width, height **40px**, padding `0 24px`
  (`--space-5`).
- **Background:** `color-mix(in srgb, var(--paper-50) 72%, transparent)` with
  `backdrop-filter: blur(5px)`.
- **Border:** bottom `2px solid var(--ink-800)` (`--border-ink`).
- **Left cluster:** a `✦` mark in `--pen-blue` (18px), the wordmark
  **"Paperdoodle OS"**, then faux menus **"Wallpaper · Doodle · View"** in
  `--ink-600`. Font `--font-marker` (Patrick Hand), `letter-spacing:0.6px`.
- **Right cluster (clock):** short weekday + month + day in `--ink-400`, then the
  time (`h:mm`). Updates every 20s. Font `--font-marker`, 15px.

### 3. Wallpaper picker dock
- **Position:** fixed, horizontally centered, `bottom:24px` (`--space-6`).
- **Container:** a Paperdoodle **`Card`** (paper fill, 2px wobbly ink border,
  `--shadow-paper`, slight tilt), padding ~`20px 24px 16px`.
- **Tape label:** a **`WashiTape`** (`color="blue"`, `tilt={-3}`) reading
  **"WALLPAPERS"**, pinned overlapping the top-left edge (`top:-14px; left:22px`).
- **Switch row:** flex row, `gap:12px` (`--space-3`), of 5 Paperdoodle **`Button`**s
  (`size="sm"`). The active one is `variant="primary"` (ballpoint blue fill); the
  rest are `variant="ghost"`. Each button label is preceded by an 11px hand-drawn
  "ink dot" (`border-radius:60% 40% 55% 45%`, `transform:rotate(-6deg)`,
  1.5px ink border) filled with that wallpaper's **accent** color.
- **Tagline:** one centered line below, `--fs-small`, `--ink-600`, max-width 520px,
  `text-wrap:pretty`: **"&lt;Name&gt;.** &lt;tag&gt;" (the bold name in `--ink-800`).
- Button accents (the dot colors): Ink Bloom `#2D5BA8`, Contours `#5B5347`,
  Highlighter `#EFCF3F`, Scribbles `#221F1A`, Grid Lens `#6B4FA0`.

### 4. Corner hint
- Fixed bottom-right, `pointer-events:none`. Font `--font-accent`
  (Gloria Hallelujah), 13px, `--ink-400`: "move to stir · click to doodle" then a
  second line with keycap chips "1–5 or ←→ to switch". Keycaps are `--font-marker`,
  `--ink-600`, 1.5px `--ink-300` border, wobbly radius.

---

## Interactions & Behavior
- **Pointer move:** forwarded to `engine.pointer()`. The engine eases the smoothed
  mouse toward the target at `0.12`/frame (springy lag) and derives velocity.
- **Pointer down (anywhere except chrome):** forwarded to `engine.click()`, pushing
  a ripple. Clicks whose `target.closest('.pd-ui')` is truthy are ignored so the
  picker UI stays clickable.
- **Switching:** clicking a dock button, or pressing **1–5**, **←**, **→**, sets the
  index → `engine.setShader(PD_SHADERS[i])`.
- **Persistence:** the chosen index is saved to `localStorage['pd-wallpaper-index']`
  and restored on load.
- **Motion:** all motion is shader-internal (continuous, slow time drift + reactive
  bumps). No CSS keyframes. The dock buttons use the Paperdoodle hover/press feel
  (straighten tilt + lift on hover, press-in on active).

## State Management
- `idx` (0–4): currently selected wallpaper. Drives the active button, the tagline,
  and `engine.setShader`. Persisted to `localStorage`.
- `now` (Date): clock, ticked every 20s.
- The engine owns its own runtime state (smoothed mouse, velocity, ripple ring,
  start time, compiled-program cache) — not React/app state.

## Design Tokens
All from the Paperdoodle design system (`_ds/.../tokens/*.css`). Key values:

**Colors (palette referenced by the shaders, hex):**
- Paper: `#FFFDF6 #FBF6E9 #F4ECD8 #EDE0C4 #E2D1AC`
- Ink: `#221F1A #2B2620 #5B5347 #8C8270`
- Pen blue: `#2D5BA8` / ink `#1E3F77`; red pen `#CB4536`
- Highlighter: yellow `#F6DE71` / `#EFCF3F`, pink `#F4B7C8`, mint `#BFE3C2`
- Lavender: `#E0D4F2`, ink `#6B4FA0`

(The shaders hard-code these as normalized `vec3` `#define`s in the `COMMON` header
of `shaders.js` — edit there to retune.)

**Type:** `--font-script` Caveat (display), `--font-marker` Patrick Hand (UI),
`--font-body` Kalam, `--font-accent` Gloria Hallelujah.
**Spacing:** 4px grid (`--space-1…24`). **Radius:** the asymmetric wobble set
`--radius-sketch-1/2/3`. **Shadow:** `--shadow-paper` (`2px 3px 0` ink),
`--shadow-lift` on hover.

## Assets
None. No images — paper grain, vignette, and all texture are generated procedurally
inside the shaders (value-noise + fBm). Fonts are Google Fonts loaded via the
design-system `fonts.css`.

## Files
- `webgl-wallpaper.js` — **the renderer** (`window.PDWallpaper`). ~140 lines, plain JS.
- `shaders.js` — **the five shaders** (`window.PD_SHADERS`) + shared GLSL header.
- `Paperdoodle Wallpapers.html` — the full reference implementation (chrome + wiring).
  Loads React 18 + the Paperdoodle component bundle for the chrome.

### Dependency to recreate the chrome
The reference HTML uses the Paperdoodle design system bundle and token CSS
(`_ds/paperdoodle-design-system-.../`), exposing components on
`window.PaperdoodleDesignSystem_9051b3` — `Button`, `Badge`, `WashiTape`, `Card`,
`Divider`. In the target codebase, use that design system's real components instead
of the bundled copy. The shader engine itself has **no** dependency on it.
