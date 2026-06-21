// Talks to the Flask backend. Same-origin by default (Flask serves the built
// frontend in production), so relative URLs "just work". In dev, Vite proxies
// /api to the Flask server (see vite.config.js), so relative URLs work there too.
// Override with VITE_API_BASE if you ever host the API on a different origin.
const API_BASE = import.meta.env.VITE_API_BASE ?? ''

// Send the user's info to the eligibility engine and get back the program list.
export async function fetchEligibility(userInfo) {
  const res = await fetch(`${API_BASE}/api/eligibility`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.programs
}

// Ask the backend (Claude) for a friendly summary + per-program explanations.
// Returns { summary, explanations: { programId: text } }.
export async function fetchExplanations(userInfo) {
  const res = await fetch(`${API_BASE}/api/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  return res.json()
}

// Ask the backend (Claude) to draft the application for one program.
// Returns { statement, answers: [{ question, answer }] }.
export async function fetchDraft(userInfo, programId) {
  const res = await fetch(`${API_BASE}/api/draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userInfo, programId }),
  })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  return res.json()
}

// Save (or update) the user's profile, keyed by email. Returns the saved profile.
export async function saveProfile(userInfo) {
  const res = await fetch(`${API_BASE}/api/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.profile
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Start the AI agent and poll until it finishes. `onProgress` receives
// { status, liveViewUrl, sessionId, ... } as soon as Browserbase publishes it.
// Returns { mode, steps, values, liveViewUrl, portalUrl, ... }.
export async function applyWithAgent(programId, profile, onProgress) {
  const start = await fetch(`${API_BASE}/api/agent/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ programId, profile }),
  })
  if (!start.ok) {
    throw new Error(`Server responded with ${start.status}`)
  }
  let job = await start.json()
  onProgress?.(job)

  while (job.status === 'running') {
    await sleep(1000)
    const status = await fetch(`${API_BASE}/api/agent/status/${encodeURIComponent(job.jobId)}`)
    if (!status.ok) {
      throw new Error(`Server responded with ${status.status}`)
    }
    job = await status.json()
    onProgress?.(job)
  }

  if (job.status === 'done' && job.result) {
    return job.result
  }
  throw new Error(job.error || 'Agent job did not finish')
}

// Load submitted/in-progress application records for a user.
export async function fetchApplications(email) {
  const res = await fetch(`${API_BASE}/api/applications?email=${encodeURIComponent(email)}`)
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.applications
}

// Load a saved profile by email, or null if we haven't seen this email.
export async function getProfile(email) {
  const res = await fetch(`${API_BASE}/api/profile?email=${encodeURIComponent(email)}`)
  if (res.status === 404) {
    return null
  }
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.profile
}

// --- Documents ---

// List a user's uploaded documents.
export async function listDocuments(email) {
  const res = await fetch(`${API_BASE}/api/documents?email=${encodeURIComponent(email)}`)
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.documents
}

// Upload a file (multipart) for a user. Returns the saved document record.
export async function uploadDocument(email, label, file) {
  const form = new FormData()
  form.append('email', email)
  form.append('label', label)
  form.append('file', file)
  // Note: don't set Content-Type; the browser adds the multipart boundary.
  const res = await fetch(`${API_BASE}/api/documents`, { method: 'POST', body: form })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  const data = await res.json()
  return data.document
}

// Delete a document by id.
export async function deleteDocument(id) {
  const res = await fetch(`${API_BASE}/api/documents/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`)
  }
  return true
}

// Parse a spoken transcript into pre-filled form data via Claude on the backend.
export async function parseVoiceIntake(transcript) {
  const res = await fetch(`${API_BASE}/api/voice-intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transcript }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Server error ${res.status}`)
  }
  return res.json()
}

// URL to view/download a document.
export function documentDownloadUrl(id) {
  return `${API_BASE}/api/documents/${id}/download`
}
