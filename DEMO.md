# Demo Runbook

## What To Show

1. Open the app and click **Load CalFresh + WIC demo profile**.
2. Click **Find my benefits**.
3. Show the dashboard with CalFresh and WIC in **Ready to auto-apply**.
4. Click **Auto-apply with AI agent** on CalFresh.
5. Show the Browserbase-completed BenefitsCal-style confirmation receipt.
6. Go back and repeat for WIC.

The agent navigates to realistic BenefitsCal/WIC URLs in Browserbase, but
Playwright intercepts those page loads and serves our local demo portal HTML.
This is intentional: no real government application is submitted during the
demo.

The demo profile creates a fresh `oski.demo+...@example.com` email each time,
so repeated rehearsals start with clean application statuses.

## Environment

Create `backend/.env`:

```sh
ANTHROPIC_API_KEY=
BROWSERBASE_API_KEY=
BROWSERBASE_PROJECT_ID=
```

Anthropic is optional. Browserbase is needed for the cloud-browser screenshots.

## Start The App

From the repo root:

```sh
PYTHONPATH=backend venv/bin/python backend/app.py
```

In another terminal:

```sh
cd frontend
PATH="/Users/study/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/`.

## Verify Before Judging

With both servers running:

```sh
venv/bin/python scripts/verify_demo.py
```

Expected output:

```text
Demo E2E passed
Screenshots: /tmp/benefits_frontend_e2e
```

The script checks the full path:

- demo profile loads
- rich profile data round-trips through `/api/profile`
- eligibility dashboard shows CalFresh and WIC
- CalFresh agent returns confirmation `CF-DEMO-4821`
- WIC agent returns confirmation `WIC-DEMO-2048`
- agent pages show realistic BenefitsCal/WIC portal URLs
- submitted portal screenshots render
- dashboard moves completed programs into **Submitted applications**
- browser console has no React/resource errors
