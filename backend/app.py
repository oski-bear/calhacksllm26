"""Flask backend for Benefits Finder.

Endpoints:
  GET  /api/health       quick check that the server is up
  POST /api/eligibility  body: the form's userInfo  ->  { "programs": [...] }
"""

import os
import threading
from uuid import uuid4

from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(__file__)

# Load backend/.env so ANTHROPIC_API_KEY is available (file is gitignored).
load_dotenv(os.path.join(BASE_DIR, ".env"))

from eligibility import evaluate_all
from claude_client import generate_explanations, draft_application, parse_voice_intake
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

# In-memory job state for the demo's live Browserbase runs. The persisted source
# of truth remains SQLite after a verified submission.
AGENT_JOBS = {}
AGENT_JOBS_LOCK = threading.Lock()


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
    if user.get("demoMode"):
        programs = [p for p in programs if p["id"] in ("calfresh", "wic")]
    try:
        result = generate_explanations(user, programs)
    except RuntimeError as err:
        # Missing API key is okay in demo mode; keep the rule-based flow quiet.
        return jsonify({"summary": "", "explanations": {}, "skipped": str(err)})
    except Exception as err:  # noqa: BLE001 - report any API failure to the client
        return jsonify({"error": "explanation failed", "detail": str(err)}), 502
    return jsonify(result)


@app.post("/api/voice-intake")
def voice_intake():
    """Parse a freeform spoken transcript into pre-filled form data via Claude."""
    body = request.get_json(silent=True) or {}
    transcript = (body.get("transcript") or "").strip()
    if not transcript:
        return jsonify({"error": "transcript is required"}), 400
    try:
        parsed = parse_voice_intake(transcript)
        return jsonify(parsed)
    except RuntimeError as err:
        return jsonify({"error": str(err), "fieldsExtracted": []}), 503
    except Exception as err:  # noqa: BLE001
        return jsonify({"error": str(err)}), 500


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
        return jsonify({"statement": "", "answers": [], "skipped": str(err)})
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


@app.get("/api/applications")
def list_applications_route():
    applications = db.list_applications(request.args.get("email", ""))
    return jsonify({"applications": applications})


@app.post("/api/agent/apply")
def agent_apply():
    """Have the AI agent draft an application by filling the mock portal."""
    body = request.get_json(silent=True) or {}
    program_id = body.get("programId", "calfresh")
    profile = body.get("profile") or {}
    result = run_application(program_id, profile)
    _persist_agent_result(program_id, profile, result)
    return jsonify(result)


@app.post("/api/agent/start")
def agent_start():
    """Start a browser agent job and return immediately so the frontend can
    show the Browserbase live-view link while the run is still happening."""
    body = request.get_json(silent=True) or {}
    program_id = body.get("programId", "calfresh")
    profile = body.get("profile") or {}
    job_id = uuid4().hex
    job = {
        "jobId": job_id,
        "status": "running",
        "program": program_id,
        "portalUrl": None,
        "liveViewUrl": None,
        "sessionId": None,
        "result": None,
        "error": None,
    }
    with AGENT_JOBS_LOCK:
        AGENT_JOBS[job_id] = job

    thread = threading.Thread(
        target=_run_agent_job,
        args=(job_id, program_id, profile),
        daemon=True,
    )
    thread.start()
    return jsonify(_agent_job_snapshot(job_id)), 202


@app.get("/api/agent/status/<job_id>")
def agent_status(job_id):
    snapshot = _agent_job_snapshot(job_id)
    if snapshot is None:
        return jsonify({"error": "unknown job"}), 404
    return jsonify(snapshot)


def _run_agent_job(job_id, program_id, profile):
    def publish_session(update):
        with AGENT_JOBS_LOCK:
            job = AGENT_JOBS.get(job_id)
            if not job:
                return
            job.update({
                "portalUrl": update.get("portalUrl") or job.get("portalUrl"),
                "liveViewUrl": update.get("liveViewUrl") or job.get("liveViewUrl"),
                "sessionId": update.get("sessionId") or job.get("sessionId"),
            })

    try:
        result = run_application(program_id, profile, on_session=publish_session)
        _persist_agent_result(program_id, profile, result)
        with AGENT_JOBS_LOCK:
            job = AGENT_JOBS.get(job_id)
            if job:
                job.update({
                    "status": "done",
                    "portalUrl": result.get("portalUrl") or job.get("portalUrl"),
                    "liveViewUrl": result.get("liveViewUrl") or job.get("liveViewUrl"),
                    "sessionId": result.get("sessionId") or job.get("sessionId"),
                    "result": result,
                    "error": None,
                })
    except Exception as err:  # noqa: BLE001 - keep job failures visible to the UI
        with AGENT_JOBS_LOCK:
            job = AGENT_JOBS.get(job_id)
            if job:
                job.update({"status": "error", "error": str(err)})


def _agent_job_snapshot(job_id):
    with AGENT_JOBS_LOCK:
        job = AGENT_JOBS.get(job_id)
        return dict(job) if job else None


def _persist_agent_result(program_id, profile, result):
    email = (profile.get("email") or "").strip()
    if email and _is_verified_browserbase_submission(result):
        result["application"] = db.save_application(email, program_id, result)
        result["applicationPersisted"] = True
    else:
        result["applicationPersisted"] = False
    return result


def _is_verified_browserbase_submission(result):
    evidence = result.get("automationEvidence") or {}
    return (
        result.get("mode") == "browserbase"
        and bool(result.get("confirmation"))
        and evidence.get("confirmationVerified") is True
    )


@app.get("/mock/<path:filename>")
def mock_portal(filename):
    """Serve the demo (mock) benefits portals the agent fills."""
    return send_from_directory(MOCK_DIR, filename)


if __name__ == "__main__":
    app.run(port=5001, debug=True, threaded=True)
