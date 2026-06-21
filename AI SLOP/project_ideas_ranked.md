# Project Ideas Ranked After Benefits Pivot

These are the active ideas after the team narrowed toward a benefits-navigation project. Ranking is based on winner fit, usefulness, demo clarity, build feasibility, sponsor fit, and whether the idea has enough differentiation from existing products.

## Current Ranking

| Rank | Idea | Short Verdict | Why It Can Win | Main Risk |
|---:|---|---|---|---|
| 1 | BridgeBenefits | Best flagship idea | Clear social impact, hard eligibility logic, real action loop, strong Anthropic/Browserbase/Redis fit | Must avoid unsafe eligibility claims and accidental submission |
| 2 | CivicTrust | Strong fallback social-impact idea | Public-good story, live demo potential, agentic workflow, strong UI opportunity | Needs narrow scope to avoid becoming a generic fact-checker |
| 3 | TrustLayer for Agents | Strong technical/infrastructure idea | Fits AI-native hackathon themes, can show agent evaluation and trust receipts | Harder for judges to emotionally grasp without a concrete demo |
| 4 | MemoryVault MCP | Useful, buildable component | Practical for AI builders, easy to demo, could become part of another idea | Existing memory products are strong, so standalone novelty is weaker |
| 5 | CartPilot / ErrandOps | Useful consumer agent | Clear everyday pain and demoable optimization | Price and inventory data is messy; similar grocery-price products exist |
| 6 | SongForge | Fun and demo-friendly | Great live demo if polished, strong UX surface | Music training apps already exist; scoring needs to feel accurate |
| 7 | TrustRank Browser | Interesting but broad | Strong societal angle, networked trust graph is compelling | Search/browser products are crowded and hard to make convincing in 24 hours |

## 1. BridgeBenefits

**Concept:** A trust-first benefits co-pilot for low-income families. It takes a household situation, screens for relevant government/local assistance programs, cites exact eligibility rules, builds a document checklist, and drafts applications for human review.

**Winning version:** Do not build a broad benefits chatbot. Build a focused California/Alameda County demo for one family persona across CalFresh, WIC, Medi-Cal/CHIP, a utility/local assistance program, and one local referral. The core artifact is an auditable eligibility and application packet.

**Why it is strong:** The pain is real, the user is specific, the stakes are high, and the demo produces a concrete outcome. It also maps cleanly to Ddoski's World, Anthropic economic opportunity, Browserbase web agents, Redis rules/memory/RAG, and Best UI/UX.

**Must-have demo pieces:**

- Mobile-first guided intake.
- Rule-cited eligibility results.
- Program cards: likely eligible, maybe eligible, missing information, likely not eligible.
- Document checklist.
- Draft application packet.
- Browserbase fills a demo portal or staging form and stops before submission.
- Human review and audit trail.

**Modification to win:** Make trust the spine of the product. Every recommendation should show the user facts used, the rule cited, confidence/uncertainty, and the next safe action.

See [benefits_navigator_win_spec.md](benefits_navigator_win_spec.md) for the full build plan.

## 2. CivicTrust

**Concept:** A live civic accountability system that tracks public officials, their responsibilities, voting records, statements, donors, legislation, and debate/news claims, then produces live fact-checks and consistency scores with citations.

**Winning version:** Do not build "a fact-checking app." Build a civic command center for one specific live scenario: a mayoral debate, city council meeting, congressional hearing, or campaign interview. The demo should show transcript in, claims extracted, sources retrieved, past positions compared, and a judge-friendly "truth and consistency receipt" generated.

**Why it is strong:** The audience is obvious, the value proposition is legible, and the demo can be dramatic. It combines RAG, live transcription, citation quality, structured public data, and a polished dashboard.

**Must-have demo pieces:**

- Live or simulated transcript feed.
- Claim extraction with severity/importance ranking.
- Citation-backed verification.
- Past-position consistency check.
- Official profile page with votes, bills, statements, donors, and contact info.
- Shareable "claim receipt" for each verdict.

**Modification to win:** Make the experience feel like a live control room. Judges should understand in 20 seconds: "This catches political claims as they happen and shows the receipts."

## 3. TrustLayer for Agents

**Concept:** A ratings, trust, and audit layer for AI agents and tools. Every time an agent calls another agent/tool, the system records success, failure, latency, cost, hallucination risk, data access, and user feedback.

**Winning version:** Build an "agent trust receipt" protocol and dashboard. Show two agents using tools, one good and one unreliable. The dashboard should expose traces, ratings, and whether another agent should trust that tool in the future.

**Why it is strong:** It is highly AI-native and sponsor-friendly. It maps well to MCP/tool ecosystems and current concerns around agent reliability.

**Must-have demo pieces:**

- MCP/tool registry with trust scores.
- Automatic score updates from task outcomes.
- Trace viewer for tool calls.
- Safety labels such as "handles private data," "often times out," "citation quality low."
- A simple API or SDK wrapper.

**Modification to win:** Anchor it in a concrete workflow, such as a research agent choosing between web search, citation, calendar, and database tools. A pure marketplace is too abstract; trust receipts make it memorable.

## 4. MemoryVault MCP

**Concept:** A local-first data and memory manager for LLMs that lets users control what memories agents can save, search, delete, export, or share across apps.

**Winning version:** Do not pitch it as generic memory. Pitch it as "private memory permissions for agents." The demo should show an assistant remembering useful preferences while blocking or redacting sensitive data.

**Why it is strong:** It is feasible, relevant to agent builders, and can be implemented as a small MCP server plus polished UI.

**Must-have demo pieces:**

- Local memory store.
- Memory permissions by app or agent.
- Search and recall interface.
- Delete/export controls.
- Sensitive-data detection and redaction.

**Modification to win:** Use it as an enabling layer inside CivicTrust or TrustLayer if the team wants a stronger overall story. As a standalone project it needs a crisp privacy angle to beat existing memory infrastructure.

## 5. CartPilot / ErrandOps

**Concept:** A shopping and errand agent. The user enters what they need, location, transportation mode, time constraints, and store preferences. The app proposes a route optimized for price, distance, item availability, and time.

**Winning version:** Narrow to one domain such as groceries near Berkeley. Show a route that saves money and time compared with naive shopping.

**Why it is strong:** It solves an everyday pain and is easy to explain. The agentic planning angle is real.

**Must-have demo pieces:**

- Natural-language shopping list input.
- Store/item matching.
- Route optimization.
- Price/time tradeoff view.
- Map or itinerary.

**Modification to win:** Fake less and constrain more. If live inventory data is unavailable, use a seeded Berkeley store dataset and be transparent that the agent can plug into APIs later. The hackathon demo must work smoothly.

## 6. SongForge

**Concept:** LeetCode for music. Users recreate melodies, rhythms, chord progressions, or songs and receive scoring, levels, feedback, and challenges.

**Winning version:** Make it a tight musical challenge game, not a broad learning platform. For example: hear a melody, recreate it with keyboard/mic/MIDI, get pitch/rhythm/structure scoring, then climb a leaderboard.

**Why it is strong:** It is fun, visual, and demo-friendly. A polished UI and satisfying scoring loop could get attention.

**Must-have demo pieces:**

- Audio prompt playback.
- User performance capture.
- Pitch/rhythm similarity scoring.
- Progression of levels.
- Leaderboard or challenge mode.

**Modification to win:** Make the scoring feel magical. If it just looks like a toy piano, it will not place. If it gives precise feedback with a beautiful UI, it can become a crowd favorite.

## 7. TrustRank Browser

**Concept:** A social trust layer for websites and search results. Users subscribe to experts or communities, and their ratings influence what sites are boosted, downranked, labeled, or filtered.

**Winning version:** Build a browser/search overlay for one high-stakes domain, such as climate misinformation, health misinformation, or local politics. Show how an expert network changes the ranking and labels sources.

**Why it is interesting:** It blends community moderation, search personalization, and information credibility.

**Main concern:** It is hard to build and hard to prove in a short hackathon. Existing search engines, browser extensions, and moderation systems already cover pieces of this.

**Modification to win:** Do not build a general search engine. Build a credibility lens that can run on top of Google/Kagi/Brave-style results or a provided search API. The win condition is trust labeling, not search itself.

## Best Combined Strategy

The strongest path is now:

1. Build **BridgeBenefits** as the main project.
2. Use **TrustLayer** concepts internally as "eligibility receipts" and application audit trails.
3. Use **MemoryVault** concepts only if they help store case state, program rules, and user-controlled draft packets.

This gives the project a social-impact narrative, technical depth, working action loop, good UI surface, and a memorable judge pitch.
