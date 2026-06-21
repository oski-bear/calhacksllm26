# UC Berkeley AI Hackathon 2026 Win Strategy

Sources used:
- Event website: https://ai.hackberkeley.org/
- Live site: https://live.hackberkeley.org/
- 2026 Devpost: https://ai-hackathon-2026.devpost.com/
- Fetch.ai hackpack: https://www.fetch.ai/events/hackathons/uc-berkeley-ai-hackathon-2026/hackpack
- AI Hackathon 2025 gallery: https://uc-berkeley-ai-hackathon-2025.devpost.com/project-gallery
- Cal Hacks 12.0 gallery: https://cal-hacks-12-0.devpost.com/project-gallery
- Full scraped winner table: ./devpost_winners_relevant_info.md

## Short Answer

The strongest winning shape is not "AI app with a chatbot." It is a working, demoable system where AI takes action in a real workflow, preferably with one of these accelerants:

- Physical or real-world interface: voice, camera, AR glasses, sensors, robots, maps, phone calls, live audio, documents, or external tools.
- A sharp target user and painful setting: hospital, emergency response, accessibility, legal aid, chip design, air traffic control, research, civic truth, developer workflow.
- A concrete outcome: files generated, forms completed, hardware moved, route planned, alert sent, document checked, code changed, source verified.
- A clean demo and story: judges understand the problem in 15 seconds and see the system complete a full loop in under 5 minutes.

If the team wants to maximize winning odds, build something with a real use case, a visible end-to-end action loop, and a strong presentation. A polished UI helps, but a pretty mockup without working depth is not the pattern.

## Current Event Facts

- Dates: June 20-21, 2026.
- Check-in: live site says first-time hacker check-in starts 8:30 AM, general check-in starts 9:00 AM on Saturday, June 20.
- Hacking starts: 11:00 AM Saturday, according to Fetch.ai's event schedule.
- Submission: Devpost says submit by Sunday, June 21 at 11:00 AM PDT, with edits until 12:00 PM. The live site also says initial draft due 11:00 AM and editable until noon, except table location.
- Judging starts: 1:00 PM Sunday.
- Finalist pitches and closing: 4:00-6:00 PM Sunday.
- Presentation limit: live site says judges spend 5 minutes at each table, so all presentations must be 5 minutes or under.
- Main judging criteria from 2026 Devpost: application, functionality/quality, creativity, and technical complexity.
- Live site gives a similar rubric: impact, functionality, technical complexity, and creativity.
- Rules: ideation before the hackathon is okay, but implementation must happen during the hacking period. Prior projects/code can disqualify you.

## 2026 Prize Surface

Main track grand prizes:

- Ddoski's World: social impact.
- Ddoski's Toolbox: developer, creator, knowledge-worker, productivity, automation tools.
- Ddoski's Lab: science, engineering, health, medical, hardware, embedded systems, complex technical applications.
- Ddoski's Playground: games, interactive experiences, generative art, humor, experimental interfaces.

Organizer prizes from the live site:

- Top 10 finalists.
- SkyDeck Grand Prize Winner.
- Best UI/UX.
- Best Solo Hack.
- Most Technical Hack.
- Most Berkeley Hack.
- Best Beginner Hack.
- Hacker's Choice.
- Most Questionable Use of 24 Hours.

Sponsor opportunities that matter strategically:

- Fetch.ai / Agentverse: explicitly wants agents that are discoverable through ASI:One, take meaningful action, use tools/APIs/data/other agents, and are more than a chatbot or API wrapper. Judging weights: functionality and technical implementation 25%, Fetch.ai tech use 25%, innovation 20%, real-world usefulness 20%, UX/presentation 10%.
- Anthropic: rewards ambitious Claude Code projects tackling meaningful issues in health, education, economic opportunity, or other high-impact domains.
- Redis: wants AI memory/vector/context retrieval beyond caching, creativity, real human problems, and technical implementation.
- Deepgram: wants voice-powered experiences where voice is essential, creative, and technically executed well.
- QNX / physical AI / robotics-oriented prizes: reward reliable embedded/real-time/physical AI and projects that robotics teams would plausibly use.
- Sentry: rewards strong technical execution, clear communication, reliability thinking, and team problem-solving.

## What Won Last Year

I scraped 20 winners from UC Berkeley AI Hackathon 2025 and 102 winner/recognized projects from Cal Hacks 12.0.

High-signal examples:

- AI Hackathon 2025 grand prize social impact: pFOG, a wearable Parkinson's Freezing of Gait detector with ML and a servo-actuated physical intervention.
- AI Hackathon 2025 grand prize productivity/devtools: ChipChat, prompt/image-to-chip-design with Verilog, diagrams, and GDS output.
- AI Hackathon 2025 grand prize creativity: Cameron, a camera-as-agent that observes and acts in real time.
- Cal Hacks 12.0 1st overall: FaceTimeOS, a Mac agent controlled through FaceTime/iMessage with voice, screenshots, and multi-step task execution.
- Cal Hacks 12.0 2nd overall: Ted.AI, a sensor-equipped teddy bear for children's mental wellness with multimodal emotion sensing and a dashboard.
- Cal Hacks 12.0 3rd overall: Project No Cap, a real-time misinformation verification system using web/article/call/meeting analysis.
- Cal Hacks 12.0 Best Hardware: Hardware Context Protocol, an SDK/networking layer to let LLMs discover and control hardware nodes.
- Cal Hacks 12.0 Most Creative: Bob, AR glasses that use audio/video/object detection to guide physical work.
- Cal Hacks 12.0 Greatest Social Impact: Expungo, an AI expungement eligibility and form assistant with privacy-conscious document processing.

Aggregate demo-readiness signals from the scraped winners:

- 114 of 122 winner/recognized projects had an embedded demo video.
- 105 of 122 had a GitHub or try-it-out link.
- Winners averaged about 4 gallery assets/screenshots.
- Top repeated tech tags were Python, React, TypeScript, Claude, Gemini, FastAPI, Next.js, Groq, Letta, Vapi, Tailwind, Flask, ChromaDB, Fetch.ai, and Supabase.

## What Judges Seem To Reward

1. Working end-to-end loops.

The winning projects usually show input -> reasoning -> action -> result. Examples: FaceTime call controls a Mac, pFOG senses gait and triggers stimulation, Expungo reads legal docs and creates guidance/forms, ChipChat produces actual circuit artifacts.

2. Real-world stakes.

Health, emergency response, accessibility, legal aid, eldercare, clinical trials, chips, civic truth, and developer productivity all did well. "This helps a specific user do a hard thing" beats "this is generally useful."

3. AI that touches reality.

Voice, cameras, physical devices, AR, robotics, browser automation, documents, maps, payments, and external APIs were everywhere. The common theme is AI crossing out of a chat box into a workflow.

4. Technical specificity.

Good winners can explain what was hard: sensor fusion, WebSocket streaming, multi-agent orchestration, RAG over legal/medical data, real-time audio, hardware control, protocol design, or model evaluation.

5. Sponsor fit when it is central.

Sponsor prizes go to teams that make the sponsor technology part of the core product. A tacked-on API call is weak. A workflow that could not work without Agentverse, Deepgram, Browserbase, Redis, Sentry, etc. is much stronger.

6. Presentation completeness.

The Devpost page matters. Winners usually had video, screenshots, a GitHub link, and a crisp "what it does / how we built it / challenges / accomplishments" story.

## What Usually Does Not Win

These can still be good projects, but they are weaker unless you add a distinctive loop:

- Generic "AI tutor," "AI finance buddy," "AI resume helper," "AI planner," "AI chatbot for X."
- Thin wrappers around one model/API with no hard workflow.
- Broad marketplaces or social networks that need network effects to be valuable.
- Fact-checkers without careful sourcing, uncertainty, and a trustworthy demo.
- Projects where the UI looks good but judges cannot see the system actually doing something.
- Overbroad moonshots where the team cannot demo a narrow working slice.
- Anything using prior code, unauthorized course content, private data, or IP-sensitive material.

## The Winning Formula

Use this sentence before committing to an idea:

"For [specific user], when [painful situation], our system uses [AI capability + real data/tool/hardware] to [take concrete action], producing [visible outcome] in under [time], and the demo proves it by [live action]."

If you cannot fill that sentence, the idea is still foggy.

## Best 24-Hour Execution Plan

Before hacking starts:

- Decide the track and 1-2 sponsor prizes you are actually targeting.
- Write the 5-minute demo script first.
- Write the Devpost title and 2-3 sentence pitch first.
- Draw the architecture and define the exact "happy path."
- Prepare legal public datasets, docs, hardware parts, and accounts, but do not implement before hacking starts.

Saturday 11 AM to 4 PM:

- Build the boring vertical slice: one input, one action, one output.
- Do not build auth, onboarding, dashboards, or settings unless required for the demo.

Saturday 4 PM to midnight:

- Add the differentiator: hardware/voice/browser/agent-to-agent/source verification/live data.
- Start recording short clips as soon as something works.

Sunday morning:

- Submit Devpost draft before 10:30 AM.
- Add screenshots, a demo video, GitHub link, sponsor requirements, and table location.
- Freeze the demo path. Only fix bugs that affect the demo.

Judging:

- 15 seconds: who it helps and why it matters.
- 60 seconds: live demo of the main action.
- 90 seconds: technical architecture and why it was hard.
- 60 seconds: impact and why your version is different.
- 30 seconds: prizes/sponsor fit and what is next.

## Practical Recommendation

Pick one of these two strategic lanes:

1. High-risk, high-reward: physical/multimodal AI.
   Build something with camera/voice/hardware/AR/browser control that visibly changes the world. This maps to Lab, Playground, Most Technical, Physical AI, Deepgram, Fetch.ai, and possibly Best UI/UX.

2. Safer, still prize-capable: agentic workflow for a painful domain.
   Build a focused tool that uses agents to do a real task with external tools, memory, citations, reliability, and a great demo. This maps to Toolbox, World, Fetch.ai, Redis, Browserbase, Sentry, Anthropic, and Best UI/UX.

Given your team's current ideas, I would not build a generic consumer app. I would either build an agent trust/reputation system for Agentverse-style agents, or a narrowly scoped civic fact-checking/accountability demo with real sources and a beautiful "evidence trail" UI.
