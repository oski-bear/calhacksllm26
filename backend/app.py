"""Flask backend for Benefits Finder.

Endpoints:
  GET  /api/health       quick check that the server is up
  POST /api/eligibility  body: the form's userInfo  ->  { "programs": [...] }
"""

import os
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(__file__)

# Load backend/.env so ANTHROPIC_API_KEY is available (file is gitignored).
load_dotenv(os.path.join(BASE_DIR, ".env"))

from eligibility import evaluate_all
from claude_client import generate_explanations, draft_application
import db
from db import init_db, save_profile, get_profile
from agent import run_application

app = Flask(__name__)
CORS(app)  # allow the React dev server to call us during development

MOCK_DIR = os.path.join(BASE_DIR, "mock")

init_db()  # make sure the database and tables exist on startup

# Uploaded files live on disk here; the database only stores metadata.
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/eligibility")
def eligibility():
    user = request.get_json(silent=True) or {}
    programs = evaluate_all(user)
    return jsonify({"programs": programs})


@app.post("/api/explain")
def explain():
    """Claude-generated, personalized guidance for the programs the user may get.
    Recomputes eligibility server-side so we don't trust client-sent results."""
    user = request.get_json(silent=True) or {}
    programs = [
        p for p in evaluate_all(user) if p["status"] in ("eligible", "maybe")
    ]
    try:
        result = generate_explanations(user, programs)
    except RuntimeError as err:
        # Missing API key — surface a clear, non-fatal signal.
        return jsonify({"error": str(err)}), 503
    except Exception as err:  # noqa: BLE001 - report any API failure to the client
        return jsonify({"error": "explanation failed", "detail": str(err)}), 502
    return jsonify(result)


@app.post("/api/draft")
def draft():
    """Claude-drafted application answers for one program (review before applying)."""
    body = request.get_json(silent=True) or {}
    user = body.get("userInfo") or {}
    program_id = body.get("programId")
    program = next(
        (p for p in evaluate_all(user) if p["id"] == program_id), None
    )
    if program is None:
        return jsonify({"error": "unknown program"}), 404
    try:
        result = draft_application(user, program)
    except RuntimeError as err:
        return jsonify({"error": str(err)}), 503
    except Exception as err:  # noqa: BLE001 - report any API failure to the client
        return jsonify({"error": "drafting failed", "detail": str(err)}), 502
    return jsonify(result)


@app.post("/api/profile")
def save_profile_route():
    profile = request.get_json(silent=True) or {}
    try:
        saved = save_profile(profile)
    except ValueError as err:
        return jsonify({"error": str(err)}), 400
    return jsonify({"profile": saved})


@app.get("/api/profile")
def get_profile_route():
    profile = get_profile(request.args.get("email", ""))
    if profile is None:
        return jsonify({"profile": None}), 404
    return jsonify({"profile": profile})


@app.post("/api/documents")
def upload_document():
    email = request.form.get("email", "").strip()
    label = request.form.get("label", "").strip()
    file = request.files.get("file")
    if not email or file is None:
        return jsonify({"error": "email and file are required"}), 400

    original_name = secure_filename(file.filename) or "document"
    # Store under a unique name to avoid collisions; keep the extension.
    extension = os.path.splitext(original_name)[1]
    stored_name = uuid4().hex + extension
    file.save(os.path.join(UPLOAD_DIR, stored_name))

    doc = db.add_document(email, label or original_name, stored_name, original_name)
    return jsonify({"document": doc})


@app.get("/api/documents")
def list_documents_route():
    documents = db.list_documents(request.args.get("email", ""))
    return jsonify({"documents": documents})


@app.get("/api/documents/<int:doc_id>/download")
def download_document(doc_id):
    doc = db.get_document(doc_id)
    if doc is None:
        return jsonify({"error": "not found"}), 404
    return send_file(
        os.path.join(UPLOAD_DIR, doc["filename"]),
        as_attachment=False,
        download_name=doc["original_name"],
    )


@app.delete("/api/documents/<int:doc_id>")
def delete_document_route(doc_id):
    doc = db.delete_document(doc_id)
    if doc is None:
        return jsonify({"error": "not found"}), 404
    # Remove the file from disk too (ignore if it's already gone).
    try:
        os.remove(os.path.join(UPLOAD_DIR, doc["filename"]))
    except OSError:
        pass
    return jsonify({"ok": True})


@app.post("/api/agent/apply")
def agent_apply():
    """Have the AI agent draft an application by filling the mock portal."""
    body = request.get_json(silent=True) or {}
    program_id = body.get("programId", "calfresh")
    profile = body.get("profile") or {}
    result = run_application(program_id, profile)
    return jsonify(result)


@app.get("/mock/<path:filename>")
def mock_portal(filename):
    """Serve the demo (mock) benefits portals the agent fills."""
    return send_from_directory(MOCK_DIR, filename)


if __name__ == "__main__":
    app.run(port=5001, debug=True)
