# Paperdoodle — Design System

A warm, hand-drawn design system for **Jay Chen's personal portfolio**. Everything looks
like it was sketched, inked, and taped onto a sheet of aged paper: parchment surfaces,
wobbly 2px ink borders, marker/handwriting type, highlighter swipes, washi tape, and a
signature "being written" reveal on headers. The reference aesthetic is the
[Wired Elements](https://wiredjs.com) sketchy-UI look, dialed toward a calmer
notebook-and-pen feeling rather than pure wireframe roughness.

> **Brand name** "Paperdoodle" is the internal name for this system. The product it dresses
> is Jay Chen's portfolio site.

---

## Sources

This system was built from the materials below. You don't need access to use the system,
but if you have it, these will let you go deeper:

- **GitHub — portfolio repo:** [`JMyoi/JMyoi.github.io`](https://github.com/JMyoi/JMyoi.github.io)
  - `PRD.md` — the product brief: paper/parchment theme, hand-written load animation +
    scribbling audio, page-flip transitions between project pages, the section list
    (Hero, Journey, Projects, Skills, Footer).
  - `Portfolio/src/assets/Resume.md` — the real content (education, MyLua Health internship,
    projects: BudgetFlow, Battleship, Chitchat, LMS, the C++ DSA library, sorting analysis).
  - `Portfolio/public/icons.svg` — a small social/UI sprite (imported to `assets/icons.svg`).
  - **Note:** at the time of writing, the repo's `Portfolio/` app was still the default
    Vite + React + Tailwind starter — the paper/doodle design had *not* been implemented yet.
    This system therefore realizes the PRD's vision rather than copying shipped screens.
- **Screenshot:** `uploads/Screenshot 2026-06-17 161647.png` — the Wired Elements landing page,
  used as the hand-drawn aesthetic reference (sketchy borders, lavender fills, stacked-paper panel).

Explore the repo above to recreate or extend the real site more faithfully.

---

## Content fundamentals

**Voice — first person, warm, a little playful.** Copy is written as Jay talking to a
visitor: *"I build full-stack apps, dabble in machine learning, and keep a soft spot for C++."*
Use **I / my** for Jay, **you** for the reader. Friendly but not cutesy.

- **Casing:** sentence case everywhere for headings and body (*"A few things I've built"*,
  *"The journey so far"*). UPPERCASE is reserved for small UI labels, tags, and button text
  (set in the marker font with wide letter-spacing) — e.g. `FULL-STACK FINANCE`, `RÉSUMÉ`.
- **Headers read like handwriting:** short, declarative, conversational —
  *"Let's build something."*, *"In the toolbox"*, *"hello, I'm —"*.
- **Tone:** confident and concrete. Project copy leads with what the thing *does*, then the
  interesting technical decisions, in plain language. No marketing fluff, no buzzwords.
- **Punctuation as texture:** an em-dash or a middot (·) to separate clauses, a trailing
  *"✓"* or *"✦"* doodle as a flourish. Sparingly.
- **Emoji:** essentially none. The "doodle" feel comes from drawn marks (washi tape, highlighter,
  wavy dividers, the ✦ on dividers), not emoji. A bare check/asterisk glyph is the most you'll see.
- **Numbers & dates:** plain and human — *"2026 — Present"*, *"M.S. Computer Science"*.

---

## Visual foundations

**Palette.** A warm aged-paper world. Surfaces are parchment (`--paper-50 … --paper-400`,
`#FFFDF6` down to `#E2D1AC`). Text and borders are warm near-black "ink"
(`--ink-900 … --ink-100`). Accents are pens and markers: **ballpoint blue** `#2D5BA8`
(`--accent`, primary actions), **red pen** `#CB4536` (`--danger`), graphite, plus a
**lavender** secondary lifted from the Wired reference. Highlighter tones (yellow `#F6DE71`,
pink, mint) and a "mark" yellow for `::selection`. Imagery, were any added, should be warm
and slightly desaturated to sit on paper — no cold blues, no glossy gradients.

**Type.** Four hand-lettered voices (Google Fonts; see *Font substitution* below):
- `--font-script` **Caveat** — the flowing display face. Hero name and "written-on" headers only.
- `--font-marker` **Patrick Hand** — headings, UI labels, buttons, badges.
- `--font-body` **Kalam** (Light) — paragraphs and long reading.
- `--font-accent` **Gloria Hallelujah** — rare handwritten asides (washi tape labels, signature).
- Mono falls back to Kalam for the rare code snippet.
Scale runs `--fs-display` 72 → `--fs-caption` 14. Line-heights are generous (body 1.55);
handwriting reads better with a little air and slightly open letter-spacing.

**Spacing & layout.** 4px base grid (`--space-1…24`). The portfolio frame is a centered
`1126px` column with inked side borders on paper. Layouts breathe more than digital-native
ones — the mid scale is generous. Min hit target `--control-md` = 44px.

**Corners — the wobble.** The signature move is asymmetric multi-value `border-radius`
(`--radius-sketch-1/2/3`, `--radius-blob`) which reads as a *drawn-by-hand* box. Pair it with
a **2px ink border** (`--border-ink`) and a **tiny rotation** (`--tilt-1/2/3`, ±0.6–1.4°).
`--radius-soft` (10px) is the calmer option for swatches/specimens.

**Backgrounds.** Token-driven, no image assets: a subtle two-layer **paper grain**
(`--paper-grain`, applied to `<body>`), plus optional **ruled-notebook** (`--bg-ruled`) and
**grid-paper** (`--bg-grid`) surfaces. Never full-bleed photos or gradients.

**Borders, rules & dividers.** 2px ink is the default. Dashed (`--border-dashed`) marks
cut-lines / section breaks; hairline (`--border-hair`) for the faintest separators; the
`Divider` component also offers a hand-drawn **wavy** rule.

**Shadows.** Hard, slightly-offset ink shadows like a sheet on a desk — `--shadow-paper`
(`2px 3px 0`), lifting to `--shadow-lift` on hover. `--shadow-stack` fakes several stacked
sheets (used on the project-detail sheet and the "stack" Card). `--shadow-soft` is a rare
ambient option. No diffuse Material elevation.

**Cards.** A sheet of paper: `--surface-card`, `--border-ink`, `--radius-sketch-1`,
`--shadow-paper`, ~`--space-6` padding. Optional `tilt`, `stack`, `flat`, and `interactive`
variants. Interactive cards straighten and lift on hover, press in on click.

**Motion.** Easing leans springy/loose (hand motion), never linear/robotic
(`--ease-doodle` overshoots). Signature animations live in `tokens/animation.css`:
- **write-on** (`pd-write-on`, `.pd-anim-write`) — text revealed left→right via `clip-path`,
  as if being hand-written. Powers `WrittenHeading`. ~1600ms.
- **wobble-in** / **ink-fade** — entrance settles with a tiny tilt / gentle fade-up.
- **highlighter-swipe** — the `Highlight` mark sweeps in.
- **page-flip** (`pd-page-flip-in/out`, ~720ms) — rotates around the left spine; used when a
  project card opens its detail page in the portfolio UI kit.
All entrance animation respects `prefers-reduced-motion: reduce` (falls back to the visible
end-state).

**Interaction states.** Hover: cards/buttons straighten their tilt and lift the shadow;
ghost controls gain a `--surface-hover` well. Active/press: nudge down-right and flatten the
shadow (the "pressed paper" feel). Focus: `--focus-ring` (a 2px accent ring on a paper gap).
Disabled: ~50% opacity, no shadow, no tilt.

**Transparency & blur.** Used sparingly — the sticky nav uses a translucent paper fill +
`blur(4px)`; washi tape is translucent. Otherwise surfaces are opaque.

---

## Iconography

The brand's iconography is **minimal and hand-feeling** — drawn strokes (the checkmark in
`Checkbox` draws itself on; the wavy divider; the underline doodle under written headings)
rather than a packed icon set. A few principles:

- **No emoji.** Decorative marks are drawn (washi, highlighter) or a single bare glyph
  (`✦`, `✓`, `→`, `·`) set in the marker/accent font.
- **Real social/brand icons** come from `assets/icons.svg` — a sprite imported from the
  portfolio repo (`#github-icon`, `#x-icon`, `#bluesky-icon`, `#discord-icon`, plus generic
  `#documentation-icon`, `#social-icon`). Reference with
  `<svg><use href="…/assets/icons.svg#github-icon"></use></svg>`. The portfolio footer uses
  `#github-icon`; email and LinkedIn are shown as marker-text links (no icon invented for them).
- **⚠️ Substitution flag:** the repo shipped only this small social sprite (originally Vite
  template icons, restyled). There is **no full hand-drawn UI icon set** in the source. If you
  need a broader UI icon set, prefer a thin, single-weight line set and keep it sparse, or ask
  Jay for a preferred set — don't hand-roll inconsistent SVGs.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link. Import-only; pulls in every token + font file.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`,
  `animation.css`, `base.css`.
- `readme.md` — this guide. · `SKILL.md` — Agent-Skill front-matter wrapper.
- `assets/icons.svg` — social/UI sprite.

**Components** (`window.PaperdoodleDesignSystem_*` after loading `_ds_bundle.js`)
- `components/forms/` — **Button** (primary / secondary / ghost / danger; sm/md/lg; block),
  **Input** (label, hint, error, multiline), **Checkbox** (+ radio).
- `components/feedback/` — **Badge** (default / blue / lavender / mint / yellow / red / solid).
- `components/layout/` — **Card** (tilt / stack / flat / interactive), **Divider** (dashed / wavy / plain, label, doodle).
- `components/brand/` — **WrittenHeading** (the write-on header), **Highlight** (swipe-in marker),
  **WashiTape** (decorative tape).
Each directory has a `*.card.html` specimen (Design System tab) and each component a
`.d.ts` + `.prompt.md`.

**Foundation specimen cards** — `guidelines/*.html` (Colors, Type, Spacing, Brand groups).

**UI kits**
- `ui_kits/portfolio/` — the full interactive portfolio: sticky `Nav`, write-on `Hero`,
  dashed-spine `Journey` timeline, taped `Projects` grid that **page-flips** into a
  `ProjectDetail` sheet, `Skills`, and a `Footer`. `index.html` mounts it; content lives in
  `data.js`; screens are small JSX files. Also registered as a Starting Point.
