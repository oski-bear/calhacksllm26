# Winner Patterns vs Active Project Ideas

This note compares the current project direction against the patterns in the scraped winning projects dataset. The current flagship is **BridgeBenefits**, a trust-first benefits navigator for low-income families. For the full product and demo spec, see [benefits_navigator_win_spec.md](benefits_navigator_win_spec.md).

## What Winning Projects Tend To Have

The strongest winners usually combine five things:

| Pattern | What It Means For Us |
|---|---|
| A legible pain point | Judges should understand the problem in one sentence. |
| A working end-to-end demo | The project should produce a visible result, not only a concept. |
| AI that makes decisions | Retrieval, classification, planning, scoring, summarization, or tool use should be central. |
| A polished user surface | Good UI matters because it makes the technical work feel real. |
| A memorable story | Public-good, accessibility, safety, education, or infrastructure stories land well. |

## Active Ideas Ranked By Winner Fit

| Rank | Idea | Winner Fit | Reason |
|---:|---|---:|---|
| 1 | BridgeBenefits | 9/10 | Best current fit: social impact, hard eligibility logic, external browser action, rule citations, and a concrete output. |
| 2 | CivicTrust | 8/10 | Strong public-good fallback, but benefits navigation has a cleaner action loop and sponsor fit. |
| 3 | TrustLayer for Agents | 8/10 | Very AI-native and sponsor-aligned, but needs a concrete workflow to avoid feeling abstract. |
| 4 | MemoryVault MCP | 7/10 | Buildable and useful, especially as a component, but standalone novelty is weaker. |
| 5 | SongForge | 7/10 | Fun and demoable; needs excellent scoring and UX to beat existing music-learning apps. |
| 6 | CartPilot / ErrandOps | 6/10 | Useful everyday agent; data access and prior art weaken the hackathon edge. |
| 7 | TrustRank Browser | 6/10 | Strong societal idea, but broad search/moderation products are hard to make convincing quickly. |

## Recommended Build Direction

Build **BridgeBenefits** as the main project and frame it as benefits access with auditable eligibility receipts. Borrow the best parts of the other active ideas:

- From TrustLayer: use eligibility receipts, source citations, and audit trails.
- From MemoryVault: store case state, program rules, and draft packets in a controllable memory layer.
- From TrustRank Browser: label source credibility, but only inside the benefits workflow.

The pitch should be:

> "BridgeBenefits screens a family for public assistance, cites the exact rules behind each eligibility suggestion, builds a missing-document checklist, and drafts applications for human review before submission."

## Build Scope For A Winning Demo

| Timebox | Deliverable |
|---|---|
| First 4 hours | Persona, seeded program rules, intake flow, household schema, basic UI shell. |
| First night | Eligibility engine, RAG citations, program cards, document checklist, draft packet. |
| Final morning | Browserbase draft-fill demo, audit trail, polished mobile UI, video, Devpost. |

## Avoid These Failure Modes

- A generic chatbot with a benefits skin.
- Eligibility suggestions without citations.
- Real application submission without human review.
- Too many programs or jurisdictions.
- A dashboard that looks complete but does not actually draft an application packet.
- A pitch focused on originality instead of usefulness, trust, and working evidence.
