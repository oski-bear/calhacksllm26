# Project Ideas Ranked for UC Berkeley AI Hackathon 2026

This list is based on the team brainstorm plus patterns from the 2025 AI Hackathon and Cal Hacks 12.0 winners. Teammate names/contact info intentionally omitted.

## Ranking Criteria

- Prize fit: aligns with 2026 tracks or sponsor prizes.
- Demoability: can show a complete loop in under 5 minutes.
- Technical depth: has a real engineering challenge, not just prompt wrapping.
- Feasibility: buildable in 24 hours by a small team.
- Distinctiveness: not obviously a clone of last year's winners.
- Risk: legal/privacy/scraping/hallucination risks.

## 1. Agent Trust / "Yelp for AI Agents"

Working title: TrustLayer for Agents

One-liner:
Agents call other agents all the time, but they do not know who to trust. TrustLayer records task outcomes, tool reliability, citations, cost, latency, and user ratings so agents can choose safer collaborators.

Why it could win:

- Strong fit for Ddoski's Toolbox.
- Strong fit for Fetch.ai / Agentverse if implemented as a discoverable ASI:One agent that can evaluate or route to other agents.
- Fits Redis if you use memory/vector retrieval for reputation and historical task outcomes.
- Fits Sentry/Arize if you instrument failures, traces, evals, and error recovery.
- Concrete current-event angle: "Agentverse needs trust infrastructure."

Demo:

1. User asks the TrustLayer agent to complete a task, such as "book a coffee meeting plan near Berkeley" or "find a reliable summarizer for this article."
2. The agent queries 3 candidate tools/agents.
3. It scores them using past reviews, live test calls, latency, cost, citation quality, and error rate.
4. It chooses one, completes the task, logs the outcome, and emits a public trust receipt.
5. Another agent can query that receipt later.

MVP:

- A small registry of 5-8 mock/real agents.
- One ASI:One/Agentverse-compatible agent.
- One scoring model with transparent dimensions.
- One UI showing reputation graph, failure traces, and "why this agent was selected."
- GitHub repo and demo video.

Risks:

- "Marketplace" ideas can feel empty unless the demo has real agent calls.
- Similar-ish Cal Hacks projects existed: Agora and TrustBuddy. Differentiate with live task evaluation, reliability traces, and ASI-first workflow.

Verdict:
Best overall strategic idea from the brainstorm. Build it as infrastructure, not as a consumer ratings website.

## 2. Civic Live Fact-Checking / Elected Official Accountability

Working title: CivicLedger Live

One-liner:
A live fact-checking and accountability system that listens to political speech, extracts claims, checks them against trusted sources and the speaker's voting/history graph, then shows a sourced evidence trail.

Why it could win:

- Strong fit for Ddoski's World.
- Project No Cap won 3rd overall at Cal Hacks 12.0, which proves judges like real-time misinformation verification.
- Your twist can be narrower and deeper: elected officials, prior statements, legislation, jurisdiction, responsibilities, and contact info.
- Strong UI/UX potential: timeline, claim cards, evidence map, consistency score.

Demo:

1. Play a 60-second clip or live transcript from a public debate/hearing.
2. System extracts 4-6 declarative claims.
3. It retrieves source evidence from curated official/public sources.
4. It compares the claim against the official's prior votes/statements.
5. It outputs "supported / contradicted / unverifiable" with citations and a confidence score.

MVP:

- Focus on 2-3 public officials and one issue area, such as housing, climate, policing, or transit.
- Preload official sources and public datasets before the demo, but implement the app during hacking.
- Use Deepgram for speech-to-text if targeting voice.
- Use Browserbase or search/fetch tools for source retrieval.
- Use a strict claim/evidence schema to avoid hallucinated fact-checking.

Risks:

- Fact-checking is credibility-sensitive. Bad citations or overconfident ratings will hurt.
- Last year's NoCap already won; you need a sharper civic-accountability angle.

Verdict:
High upside if you keep the scope narrow and make the evidence trail excellent.

## 3. Physical AI Build Assistant

Working title: BenchBuddy

One-liner:
An AI assistant that watches your physical workbench through a webcam/phone camera, identifies parts and mistakes, and talks you through building or debugging something in real time.

Why it could win:

- Strong fit for Ddoski's Lab, Most Technical Hack, Best Physical AI, Deepgram, QNX/embedded if used, and possibly Best UI/UX.
- Winner pattern is very strong: pFOG, ICU, Bob, Hardware Context Protocol, Ted.AI, MIRAI, MARC, Wingman.
- Physical demos feel memorable at a table.

Demo:

1. Point camera at a simple breadboard, resistor set, circuit diagram, LEGO mechanism, or hackathon hardware kit.
2. Ask: "What is wrong with this build?"
3. System detects components/positions, compares to a desired schematic, and speaks corrective steps.
4. Optional: turn on an LED/servo or produce a "pass/fail build receipt."

MVP:

- Webcam stream.
- One object/component detector, even if constrained to a few known parts.
- Voice interface with Deepgram/Vapi.
- Visual overlay with bounding boxes and next-step instructions.
- Optional Arduino/ESP32 for final physical feedback.

Risks:

- Hardware can eat time.
- Requires someone on the team comfortable debugging sensors/camera/serial.

Verdict:
Probably the highest table-demo charisma if the team can handle hardware.

## 4. Automatic Shopping Route Optimizer

Working title: CartPilot

One-liner:
Tell it what you need, where you are, your transport options, and constraints; it finds nearby stores, prices, inventory signals, and returns the cheapest/fastest shopping route.

Why it could win:

- Strong real-world utility.
- Good Fetch.ai fit if the agent does multi-step planning and tool execution.
- Good Browserbase fit if it uses the web to fetch store pages.
- Good business-case story.

Demo:

1. User asks for "cheap dinner groceries plus a phone charger within 45 minutes by walking/BART."
2. Agent searches stores, prices, hours, and transit/walking route.
3. It returns a ranked itinerary and lets user swap constraints.

MVP:

- Limit to Berkeley/Southside stores.
- Use Google Places / maps, public store pages, and a small cached catalog.
- Focus on 3-5 item baskets.

Risks:

- Store inventory and prices are messy.
- If it only makes recommendations and does not execute anything, it can feel like a normal planner.

Verdict:
Feasible and useful, but needs a sharp demo and good data workaround.

## 5. Local LLM Memory Manager

Working title: MemoryVault MCP

One-liner:
A local-first memory layer for LLMs that lets users inspect, edit, approve, revoke, and export what AI systems remember about them.

Why it could win:

- Strong Ddoski's Toolbox fit.
- Strong Redis/memory/vector search angle.
- Good privacy and local-data story.
- Could be packaged as an MCP server, which fits current agent tooling.

Demo:

1. Multiple agents write memories during a task.
2. User opens the dashboard and sees "what the AI thinks it knows."
3. User edits/deletes a memory.
4. A later agent response changes because of the memory permission.

MVP:

- Local SQLite/JSON + vector store.
- MCP endpoint for read/write/query memory.
- Consent UI with memory diff.
- Chrome/desktop demo showing two AI sessions sharing controlled memory.

Risks:

- Devtool memory projects are common.
- Must show a real workflow, not just CRUD for notes.

Verdict:
Good fallback if hardware/civic scope feels too risky.

## 6. LeetCode for Music

Working title: SongForge

One-liner:
A game where users recreate short musical phrases and get scored automatically on pitch, rhythm, timbre, and arrangement accuracy.

Why it could win:

- Strong Ddoski's Playground fit.
- Potentially excellent UI/UX.
- Deepgram/audio/speech adjacent, maybe Pika/Midjourney if paired with creative generation.

Demo:

1. User hears a short riff.
2. User records or composes an attempt.
3. System scores timing/pitch similarity and shows a replayable breakdown.
4. Leaderboard and streaks.

MVP:

- Use public-domain melodies or generated riffs, not copyrighted songs.
- Score MIDI/audio with pitch and beat extraction.
- Make the UI feel like a game immediately.

Risks:

- Audio scoring is nontrivial.
- "Recreate songs" can create copyright headaches.
- Less aligned with the strongest observed winner patterns unless the UI is exceptional.

Verdict:
Fun and demoable, but not the most strategic for grand prizes.

## 7. Social Media / Search Ranking by Trusted Networks

Working title: TrustRank Browser

One-liner:
A browser/search layer where users subscribe to trusted experts or communities, and those ratings influence which sites or claims appear higher/lower.

Why it could win:

- Strong social impact angle if focused on misinformation.
- Can merge with the civic fact-checking idea.

Demo:

1. Search a controversial topic.
2. See normal results.
3. Toggle a trusted expert/community lens.
4. Results reorder with explanations and source ratings.

Risks:

- Network effects are hard in a hackathon.
- "Ratings platform" without seeded experts feels fake.
- Could be confused with existing browser extensions/search filters.

Verdict:
Better as a feature inside CivicLedger than as the whole project.

## 8. Jerkbot 9000

One-liner:
A deliberately rude/funny AI coach or assistant.

Why it could win:

- Could compete for Most Questionable Use of 24 Hours or Playground if hilarious and polished.

Risks:

- Very unlikely to win main prizes.
- Easy to become just a prompt personality.

Verdict:
Only build if the team wants a comedic side quest, not a serious win attempt.

## 9. Canvas / Course Content Archive

Original shape:
Access material/content from other people's classes.

Do not build that version.

Why:

- Likely violates school policies, copyright/IP norms, and privacy expectations.
- Could be disqualifying or just make judges uncomfortable.

Safer pivot:

Consent-based personal Canvas/RAG assistant for your own enrolled courses, or a study tool that summarizes publicly shared syllabi/readings. Still probably less prizeable than the top ideas.

## Recommended Final Choice

Best odds:
Build TrustLayer for Agents and aim at Ddoski's Toolbox plus Fetch.ai, Redis, Sentry/Arize, and maybe Best UI/UX.

Best spectacle:
Build BenchBuddy and aim at Ddoski's Lab plus Physical AI, Deepgram, Most Technical, and Best UI/UX.

Best social-impact story:
Build CivicLedger Live and aim at Ddoski's World plus Browserbase/Deepgram/Fetch.ai/Anthropic, but only if you make citations and uncertainty rock-solid.

## If You Choose TrustLayer: Concrete Build Spec

Core objects:

- Agent profile: name, capabilities, endpoint, owner, cost, required permissions.
- Task receipt: requested task, agent called, tools used, outcome, latency, errors, citations, user rating.
- Trust score: reliability, accuracy, citation quality, safety, cost, latency.
- Dispute/failure log: what failed and how the system recovered.

Minimum stack:

- Next.js/React frontend.
- FastAPI or Next API backend.
- SQLite/Postgres/Supabase for receipts.
- Redis or Chroma for memory/retrieval.
- Fetch.ai Agentverse/ASI:One integration for sponsor eligibility.
- Sentry for reliability traces if targeting that prize.

Demo script:

1. "I need an agent to summarize and verify this article."
2. TrustLayer queries three candidate agents.
3. One agent hallucinates a source, one is slow, one returns cited output.
4. TrustLayer selects the reliable agent and explains why.
5. User accepts the output; TrustLayer writes a trust receipt.
6. A second task uses the updated reputation to make a better choice.

Devpost pitch:

"As AI agents become marketplaces, users and agents need a way to know who to trust. TrustLayer is a reputation and reliability protocol for agent-to-agent work: it measures task success, citations, latency, cost, and failure recovery, then exposes those scores to agents through ASI:One so they can choose collaborators that actually complete work."
