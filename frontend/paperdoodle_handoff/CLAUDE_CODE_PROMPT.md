# Paste this into Claude Code

Put the `paperdoodle_handoff/` folder somewhere in the repo (e.g. repo root or
`frontend/src/theme/`), then start a Claude Code session in the `frontend/` dir and
paste the prompt below.

---

## The prompt

> Restyle this entire frontend with the **Paperdoodle** design system — a warm,
> hand-drawn, paper-and-ink aesthetic (parchment surfaces, 2px wobbly ink borders,
> marker/handwriting fonts, hard offset shadows, slight tilts).
>
> The design system is in `paperdoodle_handoff/design_system/`. **Read these first:**
> - `paperdoodle_handoff/INTEGRATION_MUI.md` — how to apply it to THIS MUI + Emotion
>   app. Follow it.
> - `paperdoodle_handoff/design_system/readme.md` — the full aesthetic spec.
> - `paperdoodle_handoff/design_system/tokens/*.css` — exact colors, type, spacing,
>   radii, shadows, animations. Use these values, don't invent new ones.
>
> Do this:
> 1. Load the tokens globally: `import` `design_system/styles.css` in `src/main.jsx`
>    (copy the folder into `src/theme/paperdoodle/` first).
> 2. Rewrite `src/theme.js` into a Paperdoodle MUI theme using the palette, typography,
>    shape, shadows and `components.styleOverrides` shown in INTEGRATION_MUI.md. This is
>    the main lever — most screens restyle automatically through it.
> 3. Port `WrittenHeading`, `WashiTape`, and `Highlight` from
>    `design_system/components/` into `src/components/paperdoodle/` (switch them to ES
>    `import React from 'react'`). Use `WrittenHeading` for the app title and major
>    section headers; use the others sparingly.
> 4. Grep for and remove hard-coded colors (`#0d7d6f`, `#3f51b5`, `#f5f7fa`, raw
>    box-shadows) across `src/`, routing them through theme tokens.
> 5. Walk every screen (`Dashboard`, `AgentView`, `ProgramDetail`, `BasicInfoForm`,
>    `DraftReview`, `DocumentsSection`, `ApplicationProofView`, `StatusScreens`) plus
>    `BenHeader`/`PenguinLogo`, and fix anything that didn't pick up the theme.
> 6. Match the **voice**: sentence-case warm copy, UPPERCASE marker labels on
>    buttons/tags, no emoji (use ✦ ✓ → marks sparingly).
>
> Constraints: keep all existing functionality, routing and data flow intact — this is
> a restyle, not a rewrite. Don't put the wobble/tilt on dense tables (keep rows
> straight); reserve it for cards, buttons, chips and tape labels. Run `npm run dev`
> and verify each screen renders before finishing.

---

## Tips
- If Claude Code can't see the folder, `cp -r paperdoodle_handoff frontend/` so it's
  inside the working dir, or pass the absolute path.
- Want the animated shader background too? Add to the prompt: *"Also wire the WebGL
  wallpaper in `src/assets/design_handoff_shader_wallpapers/` (its README explains the
  `PDWallpaper` engine) as a subtle background behind the dashboard hero."*
- Do it incrementally if the diff gets big: ask for **`theme.js` + global CSS first**,
  run the app, then **one screen at a time**.
