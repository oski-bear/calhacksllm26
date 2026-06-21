// Talks to the Flask backend. One place to change the URL if it moves.
const API_BASE = 'http://localhost:5000'

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

// URL to view/download a document.
export function documentDownloadUrl(id) {
  return `${API_BASE}/api/documents/${id}/download`
}
