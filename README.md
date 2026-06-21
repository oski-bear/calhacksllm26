# Benefits Navigator

Benefits Navigator helps a low-income California household discover benefits,
review what information will be reused, and auto-apply to the two programs we
demo end-to-end: CalFresh and WIC.

The demo is intentionally safe. Browserbase opens realistic BenefitsCal and
California WIC URLs, then Playwright routes those page loads to local
high-fidelity mock portals. The agent creates/fills/reviews/submits inside the
mock portals only, captures confirmation proof, and saves the verified
application status to SQLite.

## What Works

- Rich household intake with saved profile data
- Rule-based eligibility results for California benefit programs
- CalFresh and WIC prioritized in demo mode
- Claude-generated explanations/draft answers when `ANTHROPIC_API_KEY` exists
- Browserbase live cloud browser for CalFresh and WIC auto-apply flows
- Safe fallback animation when Browserbase credentials are missing
- Submitted confirmations, Browserbase evidence, and portal screenshots saved
  back to the dashboard

## Stack

React + MUI, Flask, SQLite, Anthropic, Browserbase, Playwright.

## Setup

From the repo root:

```sh
python3 -m venv venv
venv/bin/pip install -r backend/requirements.txt
cd frontend && npm install
```

Create `backend/.env`:

```sh
ANTHROPIC_API_KEY=
BROWSERBASE_API_KEY=
BROWSERBASE_PROJECT_ID=
```

Anthropic is optional. Browserbase is required for the live cloud-browser proof.

## Run Locally

Backend:

```sh
PYTHONPATH=backend venv/bin/python backend/app.py
```

Frontend:

```sh
cd frontend
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/` and use **Load CalFresh + WIC demo profile**.

## Fast Checks

These do not need API keys:

```sh
PYTHONPATH=backend venv/bin/python -m unittest discover -s tests
venv/bin/python scripts/verify_agent_fallback.py
cd frontend && npm run lint && npm run build
```

With Flask and Vite running, and Browserbase configured:

```sh
venv/bin/python scripts/verify_demo.py
```

Expected:

```text
Demo E2E passed
Screenshots: /tmp/benefits_frontend_e2e
```

## Safety Boundary

This project does not submit real government applications. The cloud browser
uses real-looking public URLs only as the navigation target; requests are
intercepted and fulfilled with local static portal HTML.
