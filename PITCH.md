# Benefits Navigator — 3-Minute Pitch Script

**Format:** Science-fair table judging — 3 min pitch + 2 min Q&A, judged at least twice.
**Delivery:** Demo-driven. One person drives the app, one narrates (or same person).
**Goal:** Hit all 6 judging criteria — Application, Functionality/Quality, Creativity,
Technical Complexity, **Ethical Considerations (new)**, **Brainstorming & Process (new)**.

> Cues in **[brackets]** = what to click/show. *Italics* = which criterion the beat
> covers (for your reference — don't say it aloud). Target ~3:00 at a calm pace.

---

### [0:00–0:25] Hook & problem  *(Application)*

> "Every year, a huge amount of food, healthcare, and cash assistance that people are
> *entitled to* goes unclaimed — not because they're ineligible, but because the
> application process is overwhelming. One parent might qualify for five programs across
> four different websites, each asking the same thirty questions. **Benefits Navigator
> fixes that.**"

*(No hard statistic on purpose — we don't cite a number we can't source. If a judge
asks for figures, see QA.md.)*

### [0:25–0:45] What it is  *(Application / Creativity)*

> "You fill out **one** intake. We tell you exactly what you qualify for and *why*, then
> an **AI agent drafts and submits the actual applications for you** — with proof. Let me
> show you."

### [0:45–2:05] Live demo  *(Functionality / Quality)*

> **[Click "Load CalFresh + WIC demo profile" → "Find my benefits"]**
> "Here's a real household — income, family size, location. Instantly we get a ranked
> list of programs, plus an **impact summary**: programs found, estimated **dollars per
> month**, and **hours of paperwork saved**."
>
> **[Point at a card's eligibility reasons]**
> "Every result is **explained** — 'your income is under the limit for your household
> size.' That's not a chatbot guessing; it's a real rules engine."
>
> **[Point at the document preflight + Claude guidance]**
> "It lists exactly which documents to bring, and Claude writes plain-language guidance
> and **drafts your application answers**, which you can edit."
>
> **[Click "Auto-apply with AI agent" on CalFresh → open the live Browserbase session]**
> "Now the agent takes over — this is a **real cloud browser**, live. It creates the
> account, fills every field, reviews, and submits."
>
> **[Show confirmation CF-DEMO-4821 + the saved screenshot proof]**
> "Confirmation number, screenshot, status saved to the dashboard. **WIC works the same
> way.** From 'am I eligible?' to 'it's submitted' in minutes."

### [2:05–2:35] Technical depth & ethics  *(Technical Complexity / Ethical Considerations)*

> "Under the hood, three layers: a **deterministic eligibility engine** doing real
> Federal-Poverty-Level math — reliable and auditable, no hallucinations. **Claude** for
> the language and drafting. **Browserbase** for real browser automation. On ethics, we
> made deliberate choices: we **never send the SSN to the AI model**, the agent is
> **fully auditable** — every field and click is visible — and it only submits to **safe
> sandbox portals**, never a real government site without explicit human review."

### [2:35–3:00] Process & close  *(Brainstorming & Process)*

> "We chose this because the hard problem **isn't another AI wrapper** — it's translating
> a messy real household into dozens of program-specific rules and form fields. So we
> scoped on purpose: **two programs, fully end-to-end, with tests and a safety boundary**,
> instead of ten done halfway. Benefits Navigator: **the benefits you've earned, without
> the paperwork.** Thank you — happy to dig into any of it."

---

## Backup slide outline (for finals / if you want visuals)

Table judging is demo-first, but if you reach finals (3-min pitch *with visuals* in
Wheeler), use ~5 slides mirroring the beats above:

1. **Title** — Benefits Navigator + one-line tagline ("the benefits you've earned,
   without the paperwork").
2. **Problem** — the application maze (one household, many portals, repeated questions).
3. **Demo** — screenshots: dashboard impact summary → eligibility reasons → live
   Browserbase session → confirmation + proof. (Or a 45-sec screen recording as backup.)
4. **How it works** — the 3-layer diagram: deterministic engine · Claude · Browserbase;
   call out the safety boundary + SSN handling.
5. **Why us / what's next** — scoped on purpose; roadmap (more programs, official-API
   submission, recertification).

---

## Delivery tips

- **Lead with the demo, not the architecture.** Judges have ~5 min; show it working fast.
- **Open the live Browserbase session early** so judges watch the agent actually work.
- **Say the two new-category lines out loud** even if not asked — ethics (SSN/safe
  boundary/human-in-loop) and process (deterministic-first, scoped on purpose). Easy points.
- **If the live agent is slow/flaky**, narrate over it and fall back to the saved proof
  (see QA.md → "If the demo breaks").
- **Whole team must be at the table during judging.** Don't move tables.
