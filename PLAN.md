# Benefits Finder — Plan

An agent that takes a person's situation (income, location, household size) →
finds the government/local assistance programs they qualify for → drafts the
applications → auto-fills them via browser / voice / computer use.

## Stack
React (MUI) · Flask · SQLite + Redis · Anthropic · Browserbase · Deepgram

---

## ✅ Done — frontend demo shell (mock data)
- [x] Basic Info Form
- [x] Dashboard (eligible programs list)
- [x] Application detail (collect program-specific info)
- [x] Agent / computer-use view (animated portal auto-fill → submitted)

## 🟡 Backend (eligibility engine done)
- [x] Flask app scaffold (`backend/app.py`)
- [x] **Eligibility engine** — CA program rules as data + Python evaluator
      (income vs. Federal Poverty Level by household size, citizenship,
      dependents, waitlists). Returns status + plain-language reasons.
- [x] API contract — `POST /api/eligibility` → `{ programs: [...] }`
      (same shape as the frontend's mock data)
- [x] SQLite — **user profile** save/load by email (`backend/db.py`,
      `POST`/`GET /api/profile`); form persists on submit.
- [x] SQLite — **documents** table + file storage on disk
      (`POST`/`GET`/`DELETE /api/documents`, download endpoint).
      Applications/status table still to do.
- [ ] Redis (agent memory + RAG over program rules)
- [x] Wire frontend to the backend — form POSTs to `/api/eligibility`,
      Dashboard renders live results + reasons, with loading/error screens

## 🟡 The real agent
- [x] Anthropic — **personalized explanations** (`backend/claude_client.py`,
      `POST /api/explain`, claude-opus-4-8): warm per-program guidance + summary,
      merged into the dashboard as progressive enhancement. Needs
      `ANTHROPIC_API_KEY` in `backend/.env`; degrades gracefully without it.
- [x] Anthropic — **application drafting** (`draft_application` + `POST /api/draft`):
      a "Review your draft" screen (`DraftReview.jsx`) between the detail screen
      and the agent — Claude drafts a situation statement + Q&A answers, the user
      edits, then proceeds. Degrades gracefully without a key.
- [x] Browserbase — drives safe mock CalFresh/WIC portals end-to-end:
      account/assessment steps, form fill, review, signature/submit where
      applicable, and final confirmation screenshots. Requires
      `BROWSERBASE_API_KEY` + `BROWSERBASE_PROJECT_ID`; falls back to a
      simulated animation without credentials.
- [ ] Deepgram — voice agent calling county offices

## 🟡 Remaining frontend
- [x] **Profile page (PII)** — view & edit saved info ("Edit my info" on the
      dashboard); saving persists to the DB and re-checks eligibility.
- [x] Document upload/management on the profile page — "Your documents"
      section: upload, view/download, remove.
- [ ] Voice-call + transcript panel on the agent page (Deepgram half)
- [ ] Dashboard reflects per-program status (In progress / Submitted)
- [ ] "Auto re-apply to programs" (noted on whiteboard)
- [ ] Flesh out programs beyond CalFresh end-to-end

---

_Current focus: judging demo reliability + CalFresh/WIC portal fidelity._
