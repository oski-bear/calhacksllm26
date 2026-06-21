"""SQLite persistence.

A user is identified by their email (no passwords). Profiles are saved and
loaded as plain dicts in the same shape the frontend already uses, so there's
no field renaming to get wrong.
"""

import json
import os
import sqlite3
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "benefits.db")

# Scalar profile fields, stored as text so they round-trip with the form
# exactly. `currentBenefits` is a list, stored separately as JSON.
PROFILE_FIELDS = [
    "name",
    "email",
    "income",
    "maritalStatus",
    "age",
    "householdSize",
    "state",
    "citizenship",
    "education",
    "filedTaxes",
]


def _connect():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # rows behave like dicts
    return conn


def init_db():
    """Create the users table if it doesn't exist yet."""
    # email is defined explicitly (unique); the rest are plain text columns.
    other_columns = ",\n          ".join(
        f"{field} TEXT" for field in PROFILE_FIELDS if field != "email"
    )
    conn = _connect()
    conn.execute(
        f"""
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          {other_columns},
          currentBenefits TEXT,
          updated_at TEXT
        )
        """
    )
    # Uploaded documents, linked to a user by email. The real file lives on
    # disk (see app.py); here we only keep metadata.
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          label TEXT,
          filename TEXT NOT NULL,
          original_name TEXT,
          uploaded_at TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL,
          program_id TEXT NOT NULL,
          status TEXT NOT NULL,
          confirmation TEXT,
          mode TEXT,
          portal_url TEXT,
          session_id TEXT,
          submitted_at TEXT,
          UNIQUE(email, program_id)
        )
        """
    )
    conn.commit()
    conn.close()


def save_profile(profile):
    """Insert or update a profile, keyed by email. Returns the saved profile."""
    email = (profile.get("email") or "").strip()
    if not email:
        raise ValueError("email is required")

    data = {field: (profile.get(field) or "") for field in PROFILE_FIELDS}
    data["email"] = email
    data["currentBenefits"] = json.dumps(profile.get("currentBenefits", []))
    data["updated_at"] = datetime.now(timezone.utc).isoformat()

    columns = list(data.keys())
    placeholders = ", ".join("?" for _ in columns)
    column_list = ", ".join(columns)
    # On a repeat email, update every column except the email itself.
    updates = ", ".join(f"{c}=excluded.{c}" for c in columns if c != "email")

    conn = _connect()
    conn.execute(
        f"INSERT INTO users ({column_list}) VALUES ({placeholders}) "
        f"ON CONFLICT(email) DO UPDATE SET {updates}",
        [data[c] for c in columns],
    )
    conn.commit()
    conn.close()
    return get_profile(email)


def get_profile(email):
    """Load a profile by email, or None if we haven't seen this email."""
    conn = _connect()
    row = conn.execute(
        "SELECT * FROM users WHERE email = ?", [(email or "").strip()]
    ).fetchone()
    conn.close()
    if row is None:
        return None

    profile = {field: row[field] for field in PROFILE_FIELDS}
    profile["currentBenefits"] = json.loads(row["currentBenefits"] or "[]")
    return profile


# --- Documents -------------------------------------------------------------

def _document_to_dict(row):
    return {
        "id": row["id"],
        "label": row["label"],
        "filename": row["filename"],
        "original_name": row["original_name"],
        "uploaded_at": row["uploaded_at"],
    }


def add_document(email, label, filename, original_name):
    """Record an uploaded document. Returns the new row as a dict."""
    conn = _connect()
    cur = conn.execute(
        "INSERT INTO documents (email, label, filename, original_name, uploaded_at) "
        "VALUES (?, ?, ?, ?, ?)",
        [
            (email or "").strip(),
            label,
            filename,
            original_name,
            datetime.now(timezone.utc).isoformat(),
        ],
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM documents WHERE id = ?", [cur.lastrowid]
    ).fetchone()
    conn.close()
    return _document_to_dict(row)


def list_documents(email):
    """All documents for a user, newest first."""
    conn = _connect()
    rows = conn.execute(
        "SELECT * FROM documents WHERE email = ? ORDER BY id DESC",
        [(email or "").strip()],
    ).fetchall()
    conn.close()
    return [_document_to_dict(r) for r in rows]


def get_document(doc_id):
    """One document by id, or None."""
    conn = _connect()
    row = conn.execute("SELECT * FROM documents WHERE id = ?", [doc_id]).fetchone()
    conn.close()
    return _document_to_dict(row) if row else None


def delete_document(doc_id):
    """Delete a document row. Returns the deleted row (so the caller can remove
    the file from disk), or None if it didn't exist."""
    doc = get_document(doc_id)
    if doc is None:
        return None
    conn = _connect()
    conn.execute("DELETE FROM documents WHERE id = ?", [doc_id])
    conn.commit()
    conn.close()
    return doc


# --- Applications ---------------------------------------------------------

def _application_to_dict(row):
    return {
        "id": row["id"],
        "email": row["email"],
        "program_id": row["program_id"],
        "status": row["status"],
        "confirmation": row["confirmation"],
        "mode": row["mode"],
        "portal_url": row["portal_url"],
        "session_id": row["session_id"],
        "submitted_at": row["submitted_at"],
    }


def save_application(email, program_id, result):
    """Upsert one program application status for a user."""
    email = (email or "").strip()
    if not email:
        raise ValueError("email is required")
    if not program_id:
        raise ValueError("program_id is required")

    data = {
        "email": email,
        "program_id": program_id,
        "status": "submitted",
        "confirmation": result.get("confirmation", ""),
        "mode": result.get("mode", ""),
        "portal_url": result.get("portalUrl", ""),
        "session_id": result.get("sessionId", ""),
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }
    columns = list(data.keys())
    placeholders = ", ".join("?" for _ in columns)
    updates = ", ".join(f"{c}=excluded.{c}" for c in columns if c not in ("email", "program_id"))

    conn = _connect()
    conn.execute(
        f"INSERT INTO applications ({', '.join(columns)}) VALUES ({placeholders}) "
        f"ON CONFLICT(email, program_id) DO UPDATE SET {updates}",
        [data[c] for c in columns],
    )
    row = conn.execute(
        "SELECT * FROM applications WHERE email = ? AND program_id = ?",
        [email, program_id],
    ).fetchone()
    conn.commit()
    conn.close()
    return _application_to_dict(row)


def list_applications(email):
    """All application statuses for a user, newest first."""
    conn = _connect()
    rows = conn.execute(
        "SELECT * FROM applications WHERE email = ? ORDER BY submitted_at DESC",
        [(email or "").strip()],
    ).fetchall()
    conn.close()
    return [_application_to_dict(r) for r in rows]
