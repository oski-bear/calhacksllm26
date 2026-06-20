# Winner Patterns vs Project Ideas

This memo evaluates the scraped winning projects dataset against the team's project ideas and recommends which ideas to build, how to reshape them, and what prize paths to target.

Source dataset:
- `research_notes/scraped_winning_projects_dataset.csv`
- 122 winner/recognized Devpost projects scraped from UC Berkeley AI Hackathon 2025 and Cal Hacks 12.0.

## Executive Recommendation

Best strategic build:

**CivicTrust: live civic fact-checking powered by trusted evidence agents.**

This is a merge of two of the strongest ideas:

- Civic live fact-checking / elected official accountability.
- Agent Trust / "Yelp for AI agents."

The reason to merge them: TrustLayer alone is strong infrastructure but may feel abstract at a judging table. Civic fact-checking alone is compelling but risks looking like a clone of Project No Cap, which already won 3rd overall at Cal Hacks 12.0. Together, the project becomes sharper:

> "When a public figure makes a claim, CivicTrust routes the claim to specialized evidence agents, scores the reliability of each source/agent, and produces a transparent trust receipt with citations, uncertainty, and consistency against the speaker's public record."

This gives you:

- A clear social-impact story.
- A concrete 5-minute demo.
- An agentic architecture judges can understand.
- A strong UI/UX surface.
- Good sponsor fit: Fetch.ai/Agentverse, Browserbase, Redis, Deepgram, Anthropic, Sentry/Arize.
- A differentiator from generic fact-checkers: the trust receipt and agent reliability layer.

Highest-ceiling alternative:

**BenchBuddy: a constrained physical AI build/debug assistant.**

If the team can handle hardware/camera/voice reliably, this has the highest "judge walks away remembering it" factor. It fits the strongest winner archetype: physical-world AI with a working loop.

Safest fallback:

**TrustLayer for Agents as an agent reliability debugger/protocol, not a marketplace.**

This is easier than hardware and good for sponsor prizes, but you need a dramatic concrete demo or it may feel too infrastructural.

## What Winning Projects Have In Common

The common winning shape is:

> Specific user + painful real-world setting + AI reasoning + real tool/data/hardware action + visible output + polished story.

The strongest winners were not just "AI for X." They completed a loop.

Examples from the dataset:

- FaceTimeOS: FaceTime/iMessage input -> AI plans -> Mac actions -> screenshot/status confirmation.
- pFOG: wearable sensor data -> ML detects freezing of gait -> servo stimulation -> patient resumes movement.
- ChipChat: circuit prompt/image -> Verilog/diagram/pipeline -> GDS/manufacturing-style artifact.
- Expungo: legal documents -> eligibility analysis -> voice guidance -> completed forms.
- Bob: AR glasses audio/video -> multimodal reasoning -> physical-work instructions and warnings.
- Project No Cap: article/call claims -> source checking -> misinformation/bias analysis.

## Dataset Signals That Matter

From the 122 scraped winner/recognized projects:

- 114/122 had an embedded demo video.
- 105/122 had a GitHub or try-it-out link.
- 89/122 had a GitHub link specifically.
- Winners averaged about 4.13 gallery assets.
- Top tech tags included Python, React, TypeScript, Claude, Gemini, FastAPI, Next.js, Groq, Letta, Vapi, Flask, ChromaDB, Fetch.ai, and Supabase.

The category counts are overlapping, but useful:

- 101 projects matched agent/workflow automation language.
- 92 projects matched hardware/physical AI language.
- 85 projects matched voice/audio language.
- 84 projects matched camera/vision/AR language.
- 79 projects matched document/data/RAG language.
- 74 projects matched health/clinical/care language.
- 65 projects matched civic/legal/trust/misinformation language.

Important interpretation:

Winners are often hybrids. The best projects are not "a health app" or "an agent app." They are things like "a voice-driven hospital command-center agent with live patient data" or "a wearable ML system that physically intervenes."

## Best Qualities To Copy

### 1. One Hard, Visible Loop

Judges should see the system finish a real task live.

Bad:
"Our AI helps people fact-check information."

Better:
"Watch it listen to this debate clip, extract three claims, call four evidence agents, reject one low-trust source, and produce a cited truth/consistency receipt."

### 2. Real-World Interface

Voice, camera, documents, browser actions, maps, hardware, or external APIs make the demo feel less like a chatbot.

High-signal interfaces from winners:

- FaceTime/iMessage.
- AR glasses.
- Wearables/sensors.
- Cameras and computer vision.
- Voice agents.
- Legal/medical PDFs.
- Live dashboards.
- Browser/web source retrieval.
- Hardware/robots.

### 3. Specific Stakes

The winning projects usually had a clear user and high-friction problem:

- Visually impaired users navigating the world.
- Parkinson's patients freezing while walking.
- Air traffic controllers under cognitive load.
- Nurses/hospitals coordinating care.
- People trying to clear criminal records.
- Chip designers going from idea to artifact.

The idea needs to name a user whose problem is expensive, risky, painful, or frequent.

### 4. Technical Specificity

Winning Devposts explain exactly what was difficult:

- Real-time audio routing.
- Sensor fusion.
- Multi-agent orchestration.
- RAG over complex domain documents.
- Object detection.
- Streaming WebSockets.
- Hardware protocol design.
- Trust/evaluation/reliability scoring.

You need one or two technical "spikes" that are demoable and explainable.

### 5. Sponsor Tech Is Central

Sponsor prizes go to projects where the sponsor product is not decorative.

Weak:
"We used Fetch.ai somewhere."

Strong:
"Each evidence checker is an Agentverse agent; our router selects between them based on trust receipts, then exposes the result through ASI:One."

### 6. A Devpost That Looks Complete

Winners almost always had:

- Demo video.
- Screenshots.
- GitHub link.
- Clear story sections.
- "What it does / how we built it / challenges / accomplishments."

Make the Devpost part of the product, not an afterthought.

## What To Avoid

Avoid:

- A broad social platform that requires network effects.
- A generic chatbot.
- A fact-checker with no source rigor.
- A pretty UI that does not complete a live action.
- An overbroad "AI does everything" assistant.
- Anything legally sketchy, especially the Canvas/course-content archive idea.
- A sponsor API call bolted on at the end.

## Idea Scorecard

Scores are out of 10. "Win-modified score" assumes the recommended modifications are applied.

| Idea | Raw Score | Win-Modified Score | Main Weakness | Best Prize Path | Verdict |
| --- | ---: | ---: | --- | --- | --- |
| CivicTrust: civic fact-checking + TrustLayer | 8.0 | 9.4 | Must avoid being NoCap clone; citation rigor required | Ddoski's World, Fetch.ai, Browserbase, Deepgram, Redis, Anthropic, Best UI/UX | Best strategic choice |
| BenchBuddy physical build assistant | 7.6 | 9.2 | Hardware/camera risk | Ddoski's Lab, Best Physical AI, Deepgram, Most Technical, Best UI/UX | Highest ceiling if hardware works |
| TrustLayer for Agents standalone | 7.7 | 8.8 | Too abstract unless demo is concrete | Ddoski's Toolbox, Fetch.ai, Redis, Sentry/Arize, Best UI/UX | Strong sponsor-prize path |
| CartPilot shopping/errand optimizer | 6.6 | 7.8 | Data/inventory mess; may feel like planner | Toolbox, Browserbase, Fetch.ai, Best UI/UX | Good fallback, needs execution loop |
| MemoryVault MCP | 6.8 | 7.7 | Many memory tools exist; CRUD risk | Toolbox, Redis, Sentry, Best UI/UX | Best as feature in TrustLayer |
| SongForge / LeetCode for Music | 6.4 | 7.4 | Audio scoring + copyright risk | Playground, Best UI/UX, Deepgram/Pika if shaped well | Fun, not strongest win path |
| TrustRank social/search ranking | 5.8 | 7.2 | Network effects; vague trust problem | World, Browserbase, Redis | Fold into CivicTrust |
| Jerkbot 9000 | 3.8 | 5.5 | Prompt personality, low depth | Playground, Most Questionable Use | Side quest only |
| Canvas/course content archive | 1.5 | 4.5 if consent-based pivot | Policy/IP/privacy risk | Education/Toolbox if fully consent-based | Do not build original version |

## Best Idea: CivicTrust

### Modified Winning Shape

Do not build "live fact-checking in general."

Build:

**A civic accountability control room for public claims.**

Narrow scope:

- One geography: Berkeley, California, or national politics.
- One issue: housing, climate, public safety, transit, education, or AI policy.
- 2-3 officials or candidates.
- 5-10 known public source types: voting records, legislation pages, official statements, budgets, meeting transcripts, trusted news, public datasets.

### Core Product Loop

1. Input:
   - A short live transcript, uploaded audio clip, YouTube/debate clip, or pasted speech.

2. Claim extraction:
   - Extract declarative claims.
   - Ignore opinions and rhetoric.
   - Normalize claims into a structured schema.

3. Agent routing:
   - Send each claim to specialized evidence agents:
     - Official records agent.
     - News/source corroboration agent.
     - Voting/history consistency agent.
     - Domain data agent.

4. Trust scoring:
   - Score evidence and agents on:
     - Source authority.
     - Citation quality.
     - Recency.
     - Agreement/disagreement.
     - Past reliability.
     - Whether the source is primary or secondary.

5. Output:
   - A claim card with:
     - Verdict: supported, contradicted, misleading, unverifiable.
     - Confidence.
     - Evidence links.
     - Explanation.
     - "Consistency with past record."
     - Trust receipt showing which agents/sources were used and why.

### Why This Can Beat NoCap

Project No Cap already won with broad misinformation verification. You win by being narrower and deeper:

- Not "the internet is true/false."
- Instead: public accountability for a specific speaker, claim, issue, and evidence trail.
- Your differentiator is agent reliability and transparent trust receipts.
- Your UI can make uncertainty legible rather than pretending every claim has a binary truth answer.

### Prize Targets

Primary:

- Ddoski's World.
- Best UI/UX.
- Fetch.ai / Agentverse.

Secondary:

- Browserbase if agents use browser/web retrieval.
- Deepgram if live audio/speech is central.
- Redis if you use memory/vector retrieval for source and trust history.
- Anthropic if Claude handles claim extraction/reasoning or Claude Code builds much of the system.
- Sentry/Arize if you instrument failures, traces, and evals.

### Demo Script

Five-minute judging demo:

1. "We built CivicTrust because public speech is full of claims, but real-time fact-checking fails when it hides sources or overclaims certainty."
2. Play a 45-second clip or paste a transcript.
3. System extracts three claims.
4. Select one claim and show four evidence agents working.
5. Show one source rejected because it is stale, low-authority, or inconsistent.
6. Show final claim card: verdict, confidence, citations, consistency with past votes/statements.
7. Show trust receipt: which agents were used, what each returned, latency/errors, and why the final score was chosen.
8. End with: "This is not just a fact-checker. It is an accountability layer for agentic evidence."

### Must-Have MVP

- Claim extraction from transcript.
- 3-4 evidence agents/tools.
- Trust receipt object.
- Cited output with URLs.
- Clean UI with claim cards and evidence drawer.
- One polished demo dataset/path.
- Devpost video.
- GitHub link.

### Stretch Features

- Live audio via Deepgram.
- Browserbase source retrieval.
- Redis memory of claim/source/agent history.
- Sentry or Arize trace view.
- Agentverse/ASI:One integration for at least one evidence agent.
- Debate timeline with color-coded claims.

### Biggest Risks

- Hallucinated citations.
- Overconfident verdicts.
- Too much scope.
- Weak live web retrieval under time pressure.

### Risk Controls

- Use a strict JSON schema for claims and evidence.
- Separate "verified facts" from "model reasoning."
- Save source snippets and URLs in evidence objects.
- Allow "unverifiable" as a first-class verdict.
- Use a curated issue/source set for the demo.
- Make source retrieval deterministic enough to survive judging.

## Second Best Idea: BenchBuddy

### Modified Winning Shape

Do not build a general assistant for all physical work.

Build:

**A real-time AI pair engineer for breadboards/electronics debugging.**

Narrow scope:

- One breadboard circuit.
- A small set of parts: LED, resistor, jumper wires, button, servo, Arduino/ESP32.
- One expected schematic.
- One camera angle.

### Core Product Loop

1. Camera sees the breadboard.
2. User asks by voice: "Why is my LED not turning on?"
3. System detects components/wires or uses visual reasoning on the image.
4. System compares the build to the expected schematic.
5. It highlights likely issues and gives spoken next steps.
6. Optional hardware check: user fixes it and the LED/servo passes a final validation.

### Why This Matches Winners

It directly copies the strongest winning archetype:

- Bob: AR/camera/voice physical work assistant.
- ICU: voice/gesture controlled camera for accessibility.
- pFOG: sensor-based physical intervention.
- Hardware Context Protocol: LLM-to-hardware control.
- Ted.AI: embedded sensors + emotional AI.

### Prize Targets

- Ddoski's Lab.
- Best Physical AI Hack.
- Most Technical Hack.
- Deepgram.
- QNX/embedded if feasible.
- Best UI/UX if the overlay is strong.

### Must-Have MVP

- Webcam capture.
- Upload/capture image into model.
- Voice or text instruction.
- Schematic/reference state.
- Visual overlay or structured diagnosis.
- One reliable demo circuit.

### Biggest Risk

Hardware and vision can consume the whole hackathon. Only choose this if the team has hardware access and someone comfortable with physical debugging.

## Third Best Idea: TrustLayer Standalone

### Modified Winning Shape

Do not build "Yelp for AI agents."

Build:

**CI/CD for AI agents: a reliability harness, trust receipt protocol, and routing layer.**

The product should answer:

- Which agent should I trust for this task?
- How do I know it did the work?
- What sources/tools did it use?
- Did it fail safely?
- Can another agent read the result later?

### Core Product Loop

1. User submits a task.
2. TrustLayer sends the task to multiple agents/tools.
3. It runs checks:
   - Did the output include citations?
   - Did the links resolve?
   - Did the answer contradict known source data?
   - How long did it take?
   - What did it cost?
4. It chooses the best agent.
5. It writes a signed/structured trust receipt.
6. A later agent queries the trust receipt and makes a better decision.

### Prize Targets

- Ddoski's Toolbox.
- Fetch.ai / Agentverse.
- Redis.
- Sentry/Arize.
- Best UI/UX.

### How To Make It Less Abstract

Pick one concrete demo domain:

- Source-verifying news/article summaries.
- Customer-support tool selection.
- Code review agent reliability.
- Civic evidence agents.

This is why CivicTrust is recommended as the stronger form: it gives TrustLayer a dramatic user-facing use case.

## Other Ideas: How To Improve Them

### CartPilot

Current weakness:
It sounds like a route planner plus shopping search. Useful, but less technically memorable.

Winning modification:

Build **ErrandOps**, a local errand agent that actually performs a multi-step workflow:

- Finds stores.
- Checks hours/prices/inventory signals.
- Builds route.
- Calls or messages a store via voice agent if uncertain.
- Produces a shareable itinerary with total price/time/confidence.

Target:

- Ddoski's Toolbox.
- Browserbase.
- Fetch.ai.
- Best UI/UX.

Demo killer detail:
Show two routes where the cheapest route is not the fastest, and the agent explains the tradeoff.

### MemoryVault MCP

Current weakness:
Many AI memory tools exist. A memory CRUD dashboard is not enough.

Winning modification:

Make it **Memory Firewall for Agents**:

- Agents request memories with scoped permissions.
- User approves/denies.
- Every memory read/write creates an audit receipt.
- Bad memory causes a visible bad action; revoking it fixes the next response.

Best use:
Fold into TrustLayer or CivicTrust as the memory/receipt layer.

### SongForge

Current weakness:
Fun but less aligned with observed grand-prize patterns unless it is extremely polished.

Winning modification:

Make it **AI rhythm/pitch judge for generated mini-challenges**, not copyrighted song recreation.

- Use generated/public-domain riffs.
- Score pitch, rhythm, and confidence.
- Show waveform/piano-roll diff.
- Make the UI feel like a game in the first 10 seconds.

Target:

- Ddoski's Playground.
- Best UI/UX.
- Deepgram/Pika if voice/audio/video is central.

### TrustRank Browser

Current weakness:
Network effects and "trusted social search" are too broad.

Winning modification:

Use it as a CivicTrust feature:

- Let users choose an evidence lens: official records, local journalism, academic sources, advocacy orgs.
- Show how the claim verdict changes by source lens.
- Keep every source transparent.

### Jerkbot 9000

Winning modification:

Only viable as comedy:

- Make it a painfully honest hackathon PM that roasts scope creep and auto-cuts features.
- It would need great UI and humor.
- Target Most Questionable Use of 24 Hours, not main prizes.

### Canvas / Course Archive

Do not build the original version.

Safe pivot:

- Consent-only personal course memory.
- Public syllabus/course-material assistant.
- Study guide generator for user-uploaded materials.

Still not recommended for winning unless it has a novel technical loop.

## Final Ranking

### 1. CivicTrust

Best balance of prize fit, impact, feasibility, technical depth, and story. This should be the default team choice unless the team is excited and capable of physical AI.

### 2. BenchBuddy

Highest ceiling and most memorable demo. Choose this if you have hardware/camera confidence and can constrain the build.

### 3. TrustLayer Standalone

Best sponsor-prize infrastructure idea. Strong fallback if you do not want civic/political risk.

### 4. CartPilot / ErrandOps

Useful and feasible, but needs an execution loop to rise above "planner."

### 5. MemoryVault MCP

Good component, weak standalone unless reframed as a permissions/audit firewall.

### 6. SongForge

Fun, but likely needs exceptional UI and audio scoring to beat more practical projects.

### 7. TrustRank Browser

Feature, not full project.

### 8. Jerkbot 9000

Only for fun.

### 9. Canvas Archive

Do not build.

## Concrete Build Choice

If deciding right now, choose:

**CivicTrust: live civic fact-checking with agent trust receipts.**

Build scope:

- One polished Next.js UI.
- One FastAPI/Node backend.
- 3-4 evidence agents.
- One trust receipt schema.
- One curated public-claims dataset.
- One live transcript/audio demo.
- One Devpost video.

Success criterion:

By judging, you can run this exact demo without improvising:

1. Paste/play a public claim.
2. Extract claims.
3. Route to evidence agents.
4. Show source cards.
5. Reject or down-rank a weak source.
6. Produce a verdict with citations and uncertainty.
7. Show trust receipt.

That is a winning-shaped loop.
