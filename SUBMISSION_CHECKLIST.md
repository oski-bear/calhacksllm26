# Submission Checklist

Current time pressure: submit by 11:00 AM, judging at 1:00 PM. Optimize for a
stable demo and a clear story, not new features.

## 30-Minute Pre-Submit Check

Run these from the repo root:

```sh
git status --short --branch
PYTHONPATH=backend venv/bin/python -m unittest discover -s tests
venv/bin/python scripts/verify_agent_fallback.py
PATH="/Users/study/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm --prefix frontend run lint
PATH="/Users/study/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm --prefix frontend run build
```

If there is time and Browserbase is configured, start both servers and run:

```sh
PYTHONPATH=backend venv/bin/python backend/app.py
cd frontend && PATH="/Users/study/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH" npm run dev -- --host 127.0.0.1
venv/bin/python scripts/verify_demo.py
```

Expected full-demo output:

```text
Demo E2E passed
Screenshots: /tmp/benefits_frontend_e2e
```

## Demo Story

1. Load the CalFresh + WIC demo profile.
2. Run eligibility and show the rule-grounded recommendations.
3. Point out the agent-ready packet: identity, household, income, location,
   current benefits, and WIC signal.
4. Point out the per-program document preflight: CalFresh county follow-up
   proofs and WIC appointment proofs.
5. Point out each card's official apply link and eligibility/rules link.
6. Auto-apply to CalFresh. Open the live Browserbase session if it appears early.
7. Show verified fields/actions, confirmation `CF-DEMO-4821`, and saved proof.
8. Go back to dashboard, click **View agent proof**, then return.
9. Repeat for WIC.
10. End on the dashboard with both submissions saved and proof thumbnails.

## Judge Talking Points

- The hard part is not another chatbot; it is mapping a messy household profile
  into program-specific eligibility and application fields.
- The agent is auditable: fields, clicks, confirmation, screenshot, and
  persisted status are all visible.
- The document checklist solves a real approval bottleneck: users can submit a
  draft now, but know exactly what to bring/upload for verification.
- The submission boundary is safe: Browserbase drives a routed portal mock, so
  no real government application is filed.
- The user stays in control. In a real deployment the final submit would be
  explicit human review, not silent background submission.

## Do Not Change After 10:30 AM

- Browserbase agent selectors in `backend/agent.py`
- Mock portal `name=...` fields or `data-agent-*` hooks
- `frontend/src/api.js` base URL
- Demo confirmation numbers: `CF-DEMO-4821`, `WIC-DEMO-2048`
