"""Claude integration: turn eligibility results into warm, personalized guidance.

Uses the Anthropic API (claude-opus-4-8). Requires ANTHROPIC_API_KEY in the
environment (load it from backend/.env). Kept separate from the deterministic
eligibility engine so the engine stays fast and works without an API key.
"""

import json
import os

import anthropic

MODEL = "claude-opus-4-8"

SYSTEM_PROMPT = (
    "You are a warm, encouraging benefits navigator helping low-income "
    "Californians understand government assistance programs. Write in plain, "
    "supportive language at about a 6th-grade reading level, and never be "
    "judgmental. For each program write 1-2 sentences: why this person likely "
    "qualifies, and one concrete next step they can take. Avoid jargon and "
    "spell out acronyms the reader may not know."
)

# The JSON shape we ask Claude to return (structured output).
RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "summary": {"type": "string"},
        "programs": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "id": {"type": "string"},
                    "explanation": {"type": "string"},
                },
                "required": ["id", "explanation"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["summary", "programs"],
    "additionalProperties": False,
}


def _client():
    """Build the Anthropic client, or raise a clear error if the key is missing."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set")
    return anthropic.Anthropic(api_key=api_key)


def generate_explanations(user, programs):
    """Ask Claude for a friendly summary + per-program explanations.

    Returns {"summary": str, "explanations": {program_id: str}}.
    """
    client = _client()

    situation = {
        "name": user.get("name", ""),
        "annual_income": user.get("income", ""),
        "household_size": user.get("householdSize", ""),
        "state": user.get("state", ""),
        "citizenship": user.get("citizenship", ""),
    }
    program_summaries = [
        {
            "id": p["id"],
            "name": p["name"],
            "status": p["status"],
            "reasons": p.get("reasons", []),
        }
        for p in programs
    ]

    user_message = (
        "Here is the person's situation:\n"
        f"{json.dumps(situation, indent=2)}\n\n"
        "Here are the programs they may qualify for, with the rule-based "
        "reasons the engine produced:\n"
        f"{json.dumps(program_summaries, indent=2)}\n\n"
        "Write a short, friendly overall summary for this person, then a "
        "personalized explanation for each program. Use the same id for each."
    )

    # Simple generation task: low effort, no extended thinking — keeps it fast.
    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        output_config={
            "effort": "low",
            "format": {"type": "json_schema", "schema": RESPONSE_SCHEMA},
        },
        messages=[{"role": "user", "content": user_message}],
    )

    text = next(block.text for block in response.content if block.type == "text")
    data = json.loads(text)
    explanations = {item["id"]: item["explanation"] for item in data["programs"]}
    return {"summary": data["summary"], "explanations": explanations}
