import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  documentDownloadUrl,
} from '../api.js'

// "Your documents" section on the profile page: upload, view/download, remove.
// Documents are stored per user (by email) on the backend.
export default function DocumentsSection({ email }) {
  const [docs, setDocs] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  async function refresh() {
    try {
      setDocs(await listDocuments(email))
    } catch (err) {
      setError(err.message)
    }
  }

  // Load the user's documents when the section mounts (or the email changes).
  useEffect(() => {
    let active = true
    listDocuments(email)
      .then((documents) => {
        if (active) setDocs(documents)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [email])

  async function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      await uploadDocument(email, file.name, file)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      e.target.value = '' // allow re-uploading the same filename
    }
  }

  async function handleDelete(id) {
    setError(null)
    try {
      await deleteDocument(id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">Your documents</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload documents once and we'll reuse them across applications.
        </Typography>

        {docs.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No documents uploaded yet.
          </Typography>
        ) : (
          <Stack spacing={1.5} divider={<Divider flexItem />}>
            {docs.map((doc) => (
              <Stack
                key={doc.id}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Stack spacing={0} sx={{ minWidth: 0 }}>
                  <Link
                    href={documentDownloadUrl(doc.id)}
                    target="_blank"
                    rel="noopener"
                  >
                    {doc.original_name}
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    {doc.label} · {new Date(doc.uploaded_at).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Button size="small" color="error" onClick={() => handleDelete(doc.id)}>
                  Remove
                </Button>
              </Stack>
            ))}
          </Stack>
        )}

        {error && (
          <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="outlined"
          component="label"
          disabled={busy}
          sx={{ mt: 2 }}
        >
          {busy ? 'Uploading…' : 'Upload a document'}
          <input type="file" hidden onChange={handleUpload} />
        </Button>
      </CardContent>
    </Card>
  )
}
