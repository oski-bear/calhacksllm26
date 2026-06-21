# Devpost Submission Draft

## General Info

### Project name

MyAutoBenefits

### Elevator pitch

Find benefits you qualify for, then let safe AI browser agents draft and submit applications with your review.

Alternative if you want the word "government" in there:

AI finds government benefits you qualify for, then browser agents help fill out applications safely.

## Recommended Tracks And Prizes

### Main track

Select: **GRAND PRIZE - Ddoski's World Track**

Why: this is the social impact / systemic inequity track, and MyAutoBenefits is directly about economic opportunity, public benefits access, and reducing paperwork burden for low-income families.

### Sponsor / prize checkboxes to select

Select these:

- **Best Use of Claude**
- **Best Use of Browserbase**
- **Best UI/UX**
- **Most Technical Hack**
- **SkyDeck Grand Prize Winner** if Devpost lets you opt into it

Only select if you actually add the integration before submission:

- **Using Redis Beyond Caching / Best Use of Redis**: do **not** select right now. The plan mentions Redis, but the current app uses SQLite and does not appear to actually call Redis.

Do not select unless something changes:

- Fetch AI / Agentverse
- Deepgram
- Sentry API
- Arize
- Simular
- Orkes
- Pika
- QNX
- Cognition / Devin
- Band
- UFB physical AI
- Cognichip
- Terac
- TokenRouter
- ArmorIQ

## Built With

Use some or all of these Devpost tags:

React, Vite, Material UI, JavaScript, Python, Flask, SQLite, Anthropic Claude, Claude Code, Browserbase, Playwright, AI agents, browser automation, rule-based eligibility engine, HTML, CSS, GitHub

If there is a free-form text box:

Built with a React + Vite + MUI frontend, a Flask/Python backend, SQLite persistence, deterministic benefits eligibility rules, Anthropic Claude for personalized explanations and draft answers, and Browserbase/Playwright for the live browser-agent application demo.

## Project Story

```markdown
## Inspiration

Public benefits can be life-changing, but the path to getting them is still a maze. Families are expected to know which programs exist, understand eligibility rules, gather the right documents, re-enter the same information across multiple portals, and then wait through county or agency review. A missed program or missing proof document can mean leaving food, health coverage, phone discounts, or energy assistance on the table.

We wanted to build an AI project that was useful in a high-stakes real-world setting, not just another chatbot. The core idea behind MyAutoBenefits is simple: people should be able to enter their situation once, see the benefits they may qualify for, understand why, and get safe help completing applications.

## What it does

MyAutoBenefits is an AI-powered benefits navigator and application assistant.

A user enters one household profile: location, household size, income, expenses, current benefits, immigration/citizenship status, and immediate needs. The app then checks that profile against program rules and surfaces benefits such as CalFresh, WIC, Medi-Cal, LIHEAP energy assistance, California LifeLine, and CalWORKs.

For each program, MyAutoBenefits shows:

- whether the user likely qualifies or may qualify
- estimated monthly or yearly value when we can estimate it safely
- expected application time
- official application links and eligibility links
- a document checklist so users know what proof to prepare
- plain-language explanations of the matched rules

For the end-to-end demo, CalFresh and WIC are agent-ready. Claude drafts user-specific application answers, and a Browserbase cloud browser agent opens a safe routed portal, fills out the application, submits the demo flow, captures confirmation proof, and saves the application status so judges can return to the proof later. Other benefits are still surfaced with official next steps even when auto-apply is not available yet.

## How we built it

We built the frontend in React, Vite, and Material UI, with a paper-doodle inspired visual direction to make a stressful benefits workflow feel more approachable. The intake flow is modeled after real benefits screeners: it collects household members, income sources, expenses, health coverage, existing benefits, and urgent needs.

The backend is a Flask/Python API. It runs deterministic eligibility checks for the programs we support, persists profiles, uploaded documents, and application confirmations in SQLite, and exposes routes for eligibility, document management, Claude-drafted answers, and browser-agent status.

We used Anthropic Claude for the parts where natural language helps most: friendly explanations, summaries, and draft answers that the user can review. We intentionally did not let the model be the sole source of truth for eligibility. The core eligibility matching is rule-based, and the app links back to official program sources.

We used Browserbase with Playwright to run the application-agent demo in a real cloud browser session. The agent fills a routed benefits portal flow, captures screenshots and confirmation evidence, and returns a live session/proof view. This let us demonstrate the hard part of the product: moving from "you might qualify" to "your application packet is ready."

## Challenges we ran into

The hardest challenge was balancing ambition with safety. Public benefits are high-stakes: a wrong eligibility answer can waste someone's time or discourage them from applying, and a wrong form submission could create real harm. We had to design MyAutoBenefits around trust instead of pure automation.

That meant keeping eligibility logic grounded in deterministic rules, showing official links, making the application flow reviewable, and using a safe routed portal for the live demo rather than silently submitting real government forms.

Browser automation was also challenging. Form-filling agents are powerful, but real portals are brittle and vary across counties and programs. We scoped the end-to-end demo to CalFresh and WIC while still showing other benefits as reviewable next steps.

Finally, we had to make the UI dense enough to be useful without overwhelming users. The app needs to show value, eligibility, documents, application time, official links, and agent status in a way that judges can understand quickly.

## Accomplishments that we're proud of

We are proud that MyAutoBenefits is more than a benefits chatbot. It has a real intake flow, rule-based program matching, estimated value, document checklists, official links, AI-generated explanations, draft application answers, and a live Browserbase agent flow for CalFresh and WIC.

We are also proud of the trust and safety details: the app does not ask Claude to invent eligibility, it avoids unnecessary sensitive data in model calls, it gives users review points, and it saves browser-agent proof so the result is auditable.

The most exciting part is that the demo shows a full loop: enter your situation once, discover benefits, prepare documents, draft application answers, run an agent, and come back to a verified submission record.

## What we learned

We learned that AI agents are most useful when they are paired with narrow, well-defined responsibility boundaries. A model is great at explaining rules and drafting text, but eligibility and submission need structure, citations, and human review.

We also learned that benefits access is a UX problem as much as it is a technical problem. Showing "you may qualify" is not enough. People need to know how much it might help, how long it takes, what documents to bring, what official site to trust, and what happens next.

Most importantly, we learned that in high-impact domains, the winning AI pattern is not maximum autonomy. It is grounded automation: rules first, AI assistance second, user control always.

## What's next for MyAutoBenefits

Next, we want to expand beyond the CalFresh and WIC demo flows into a broader California benefits assistant that can support Medi-Cal, CalWORKs, LIHEAP, California LifeLine, housing assistance, and local nonprofit programs.

We would also add multilingual intake, OCR for uploaded documents, stronger rule retrieval over official PDFs, county-specific eligibility differences, secure document storage, and partnerships with benefits navigators or legal aid groups.

Longer term, MyAutoBenefits could become a trusted application layer between families and fragmented public benefits systems: one profile, many programs, transparent eligibility, and safe AI help with the paperwork.
```

## Ethics / AI Concerns Answer

Use this for the Devpost ethics question:

```markdown
Because MyAutoBenefits works in a high-stakes domain, we treated AI safety and ethics as a core product requirement rather than an afterthought.

First, we do not let the model be the final authority on eligibility. Benefits eligibility can affect food, health care, cash aid, and housing stability, so a confident but wrong answer could cause real harm. Our app uses deterministic rule checks for the core screening flow, links users to official program sources, and frames results as "likely eligible" or "may qualify" rather than a final agency decision. Claude is used for explanations and draft answers, not as an unchecked eligibility oracle.

Second, we designed the application agent around human review. The Browserbase agent demonstrates form filling in a safe routed portal flow and saves proof of what happened. The intended product pattern is review-before-submit: the user should see the information being used, confirm it, and decide when to submit. We do not want invisible agents silently filing irreversible government forms.

Third, we minimized sensitive data exposure. We avoid asking for unnecessary information like SSNs in the demo, keep API keys out of the repository, and only send limited non-sensitive context to Claude for summaries and draft answers. Uploaded documents and application confirmations are stored locally for the demo, and a production version would need encryption, retention controls, access logging, and a clear deletion flow.

Fourth, we considered prompt injection and reliability. Government or third-party web pages should be treated as untrusted input, so the agent should keep system instructions separate from page content and operate within narrow allowed actions. We also built fallback behavior so the app fails safely instead of pretending an application was completed.

Finally, we considered social and environmental impact. Socially, the goal is to reduce paperwork burden for low-income families, not replace benefits workers or legal advice. The app points users to official sources and makes uncertainty visible. Environmentally, we avoid unnecessary model calls by using rule-based logic for screening and reserving AI calls for moments where language generation is valuable.

Our guiding principle was: automate paperwork, not judgment; assist the user, do not override them.
```

## Shorter Ethics Answer

Use this if the field is short:

```markdown
We treated this as a high-stakes AI workflow. The app does not let Claude make final eligibility decisions; screening is grounded in deterministic rules and official sources, while Claude is used for explanations and draft answers. The Browserbase agent follows a review-before-submit pattern and demonstrates form filling in a safe routed portal rather than silently filing irreversible real applications. We minimize sensitive data, avoid SSNs in the demo, keep API keys out of git, and would require encryption, retention controls, and deletion tools in production. We also treat portal content as untrusted input to reduce prompt-injection risk. Our principle: automate paperwork, not judgment.
```

## Demo Script Angle

Use this as the 15-second judge pitch:

```markdown
MyAutoBenefits helps a family go from "I don't know what I qualify for" to "my application packet is ready." The user enters one household profile, we surface benefits and estimated value, show exactly what documents to prepare, then Claude drafts the answers and a Browserbase agent fills the CalFresh/WIC application flow while saving proof for review.
```

