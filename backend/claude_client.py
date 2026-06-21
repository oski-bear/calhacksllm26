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


def _situation(user):
    """The non-sensitive applicant details we share with Claude (no SSN, etc.)."""
    return {
        "name": user.get("name", ""),
        "annual_income": user.get("income", ""),
        "household_size": user.get("householdSize", ""),
        "marital_status": user.get("maritalStatus", ""),
        "state": user.get("state", ""),
        "citizenship": user.get("citizenship", ""),
    }


def generate_explanations(user, programs):
    """Ask Claude for a friendly summary + per-program explanations.

    Returns {"summary": str, "explanations": {program_id: str}}.
    """
    client = _client()

    situation = _situation(user)
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


# --- Application drafting --------------------------------------------------

DRAFT_SYSTEM_PROMPT = (
    "You help people complete U.S. government assistance applications. Draft "
    "clear, honest, first-person answers using ONLY the information provided. "
    "Never invent facts. If something an answer needs is unknown, write a short "
    "bracketed placeholder like '[please confirm]'. Keep answers concise and "
    "ready to paste directly into the application."
)

DRAFT_SCHEMA = {
    "type": "object",
    "properties": {
        "statement": {"type": "string"},
        "answers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "answer": {"type": "string"},
                },
                "required": ["question", "answer"],
                "additionalProperties": False,
            },
        },
    },
    "required": ["statement", "answers"],
    "additionalProperties": False,
}


VOICE_INTAKE_SYSTEM_PROMPT = (
    "You extract structured household information from a spoken transcript to pre-fill "
    "a California benefits eligibility form. Extract ONLY what is explicitly stated. "
    "Use empty strings for unmentioned text fields and empty arrays for unmentioned lists. "
    "The first member in the members array is always the applicant (relationship: 'Self'). "
    "Match county names exactly to California counties (e.g. 'Alameda', 'Los Angeles'). "
    "Match citizenship to one of: U.S. Citizen, Permanent Resident, Visa Holder, "
    "Other / Undocumented, Prefer not to say, or empty string. "
    "For income: category 'earned' = jobs/wages, 'benefits' = government assistance, 'other' = everything else. "
    "For fieldsExtracted, list short readable labels for each thing you found "
    "(e.g. 'name', 'county', 'monthly income', '2 household members', 'rent expense')."
)

VOICE_INTAKE_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "zipcode": {"type": "string"},
        "county": {"type": "string"},
        "citizenship": {
            "type": "string",
            "enum": ["U.S. Citizen", "Permanent Resident", "Visa Holder",
                     "Other / Undocumented", "Prefer not to say", ""],
        },
        "assets": {"type": "string"},
        "members": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "relationship": {
                        "type": "string",
                        "enum": ["Self", "Spouse / partner", "Child", "Parent", "Sibling",
                                 "Grandparent", "Grandchild", "Other relative", "Roommate / unrelated"],
                    },
                    "birthYear": {"type": "string"},
                    "birthMonth": {"type": "string"},
                    "conditions": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["Pregnant", "Has a disability / long-term illness",
                                     "Blind or visually impaired", "Veteran or active military",
                                     "Recently lost a job"],
                        },
                    },
                    "incomeSources": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "category": {"type": "string", "enum": ["earned", "benefits", "other"]},
                                "type": {"type": "string"},
                                "frequency": {"type": "string",
                                              "enum": ["weekly", "biweekly", "semimonthly", "monthly", "yearly"]},
                                "amount": {"type": "string"},
                            },
                            "required": ["category", "type", "frequency", "amount"],
                            "additionalProperties": False,
                        },
                    },
                },
                "required": ["relationship", "birthYear", "birthMonth", "conditions", "incomeSources"],
                "additionalProperties": False,
            },
        },
        "expenses": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "type": {
                        "type": "string",
                        "enum": ["Rent", "Mortgage", "Utilities (gas, electric, water)",
                                 "Child care", "Child support paid", "Medical / dental (out of pocket)",
                                 "Health insurance premiums", "Dependent / elder care"],
                    },
                    "amount": {"type": "string"},
                    "frequency": {"type": "string",
                                  "enum": ["weekly", "biweekly", "semimonthly", "monthly", "yearly"]},
                },
                "required": ["type", "amount", "frequency"],
                "additionalProperties": False,
            },
        },
        "currentBenefits": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["CalFresh / SNAP", "Medi-Cal", "CalWORKs", "SSI / SSDI",
                         "Social Security", "WIC", "Section 8 / Housing Choice Voucher",
                         "Unemployment", "LIHEAP (energy assistance)", "Free / reduced school meals"],
            },
        },
        "immediateNeeds": {
            "type": "array",
            "items": {
                "type": "string",
                "enum": ["Food", "Housing / shelter", "Health care", "Child care", "Mental health",
                         "Family planning", "Job resources", "Legal help", "Baby supplies",
                         "Transportation", "Utility assistance"],
            },
        },
        "fieldsExtracted": {
            "type": "array",
            "items": {"type": "string"},
        },
    },
    "required": ["name", "zipcode", "county", "citizenship", "assets",
                 "members", "expenses", "currentBenefits", "immediateNeeds", "fieldsExtracted"],
    "additionalProperties": False,
}


def parse_voice_intake(transcript):
    """Parse a freeform spoken transcript into structured form data.

    Returns a dict matching the intake form's data shape.
    Uses claude-haiku for speed — this is in the interactive UX loop.
    """
    client = _client()
    user_message = (
        f'Transcript: "{transcript}"\n\n'
        "Extract all household information from this transcript to pre-fill the "
        "California benefits eligibility form. Use empty values for anything not mentioned."
    )
    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=VOICE_INTAKE_SYSTEM_PROMPT,
        output_config={
            "format": {"type": "json_schema", "schema": VOICE_INTAKE_SCHEMA},
        },
        messages=[{"role": "user", "content": user_message}],
    )
    text = next(block.text for block in response.content if block.type == "text")
    return json.loads(text)


def draft_application(user, program):
    """Draft the application: a first-person situation statement + Q&A answers.

    Returns {"statement": str, "answers": [{"question": str, "answer": str}]}.
    """
    client = _client()

    user_message = (
        f"Program: {program['name']}\n\n"
        f"Applicant information:\n{json.dumps(_situation(user), indent=2)}\n\n"
        "Draft a short first-person 'situation statement' for this application, "
        "then draft answers to the questions this application commonly asks — "
        "choose the relevant ones (e.g. household members, income sources, rent "
        "and utility costs, and whether they need expedited help). Base every "
        "answer on the applicant information; mark anything unknown with a "
        "bracketed placeholder."
    )

    response = client.messages.create(
        model=MODEL,
        max_tokens=2000,
        system=DRAFT_SYSTEM_PROMPT,
        output_config={
            "effort": "low",
            "format": {"type": "json_schema", "schema": DRAFT_SCHEMA},
        },
        messages=[{"role": "user", "content": user_message}],
    )

    text = next(block.text for block in response.content if block.type == "text")
    return json.loads(text)
