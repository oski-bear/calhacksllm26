# Judge Q&A Cheat Sheet — Benefits Navigator

Judges are VCs, founders, and engineers. They score 6 things, including two **new**
this year: **Ethical Considerations** and **Brainstorming & Process**. Those are our
strongest cards — work them in even if not asked.

## Say these unprompted if you have a gap
- **Ethics:** SSN is never sent to the AI; no real government submissions; agent is
  auditable; human review before submit in production.
- **Process:** deterministic-first (not an AI wrapper); scoped to 2 programs end-to-end
  on purpose; iterated on demo fidelity + safety (see commits, tests, verify scripts).

---

## The make-or-break question

**"Isn't this just a ChatGPT wrapper?"**
> "No — that's the core of our design. Eligibility is a **deterministic rules engine**
> with the real Federal Poverty Level thresholds as data, so results are reproducible and
> auditable. Claude only does what LLMs are good at — explaining and drafting language.
> Browserbase does real browser automation. The hard engineering is **mapping one messy
> profile into program-specific eligibility and form fields**, not calling an API."

---

## Technical

**"What did you actually build?"**
> "React/MUI front end; Flask + SQLite backend persisting profile, documents, and
> application status; a rule-based eligibility engine; Claude for explanations + drafting
> with structured JSON output; Browserbase + Playwright for the live agent; plus a unit
> test suite and end-to-end verify scripts."

**"How accurate is the eligibility?"**
> "It's grounded in real California thresholds — Federal Poverty Level by household size,
> citizenship, dependents — and it shows its reasoning per program. It's a **screening
> estimate**; the county makes the final determination. We're upfront about that rather
> than overpromising."

**"Why Browserbase instead of an API?"**
> "Government benefit portals have **no public submission API** — browser automation is
> the only realistic path, and Browserbase gives us a real, auditable cloud browser we
> can show you live."

---

## Ethics / privacy *(new category — nail this)*

**"What about privacy and safety?"**
> "Three deliberate choices: we **never send the SSN to the AI model**; the database and
> uploaded documents stay out of version control; and the agent **only submits to safe
> mock portals** — no real government side effects. In production, the final submit would
> be **explicit human review**, not silent automation. The user always stays in control."

**"Are you submitting real government applications?"**
> "No — by design. The agent navigates realistic BenefitsCal/WIC URLs, but we **route
> those to high-fidelity local mock portals**. Real portals require identity verification,
> and auto-submitting them raises legal and terms-of-service issues. A real deployment
> would need official agency partnerships plus human-in-the-loop approval."

**"What's real vs. mocked?"**
> "Real: the eligibility engine, the Claude calls, the live Browserbase cloud browser,
> the persistence, the proof screenshots. Mocked **on purpose**: the destination portals,
> for safety. We're upfront about that boundary."

---

## Application / market *(new-category context)*

**"How is this different from GetCalFresh / mRelief / MyFriendBen?"**
> "Those are great **screeners** — they tell you what you might qualify for. We screen
> **and** auto-fill and submit with an auditable agent, **reuse one profile across
> programs**, and draft the actual answers. Screening is table stakes; the agent is the
> leap."

**"Who would use this / who pays?"**
> "Counties and states lose money and outcomes when eligible residents don't enroll, so
> there's real appetite to fund outreach; community nonprofits are another channel.
> Benefits navigation is already a funded space with paid players."

---

## Process *(new category — nail this)*

**"How did you decide what to build?"**
> "We whiteboarded the full flow, then made a hard call to go **deterministic-first** and
> ship **two programs end-to-end** rather than ten shallow ones. We iterated heavily on
> demo fidelity and the safety boundary — it's visible in our commit history, tests, and
> verify scripts."

**"What was the hardest part?"**
> "Two things: mapping a real household's messy data into each program's specific fields,
> and building the **safe Browserbase routing** so we get a real automation demo without
> touching real government systems."

---

## Forward-looking

**"What's next?"**
> "More programs; real submission via official agency APIs/partnerships; automatic
> **re-certification** so benefits don't lapse; multilingual support; and grounding
> explanations in real rule text via retrieval."

---

## Handling the impact stat

We deliberately **don't cite a specific number** (we couldn't source one). If pushed:
> "We didn't want to quote a figure we couldn't verify, but the unclaimed-benefits gap
> is well-documented for programs like SNAP and the Earned Income Tax Credit — millions
> of eligible people don't enroll because of process friction. That friction is exactly
> what we're attacking."

(If someone on the team finds a real, sourced number before judging, swap it into the
PITCH.md hook.)

---

## 🚨 If the demo breaks

> "We have a built-in fallback that runs the same flow without the cloud browser, plus a
> test + verify-script suite — let me show you the saved proof from our last run."

Stay calm. The persisted confirmations (CF-DEMO-4821, WIC-DEMO-2048) and saved
screenshots are your backup. **Do not** touch `backend/agent.py` selectors, the mock
portal field names, the API base URL, or the demo confirmation numbers during judging
(see SUBMISSION_CHECKLIST.md).
