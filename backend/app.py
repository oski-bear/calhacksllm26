"""Flask backend for Benefits Finder.

Endpoints:
  GET  /api/health       quick check that the server is up
  POST /api/eligibility  body: the form's userInfo  ->  { "programs": [...] }
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

from eligibility import evaluate_all
from db import init_db, save_profile, get_profile

app = Flask(__name__)
CORS(app)  # allow the React dev server to call us during development

init_db()  # make sure the database and tables exist on startup


@app.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.post("/api/eligibility")
def eligibility():
    user = request.get_json(silent=True) or {}
    programs = evaluate_all(user)
    return jsonify({"programs": programs})


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


if __name__ == "__main__":
    app.run(port=5000, debug=True)
