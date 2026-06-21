"""Verify the agent's no-credentials fallback is explicit and safe."""

import sys
from copy import deepcopy
from pathlib import Path
from uuid import uuid4
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from agent import run_application  # noqa: E402
from app import app  # noqa: E402


PROFILE = {
    "name": "Oski Bear",
    "email": "oski.demo@example.com",
    "phone": "(510) 555-0148",
    "address": "2120 Dwight Way",
    "city": "Berkeley",
    "zipcode": "94704",
    "county": "Alameda",
    "income": "24000",
    "householdSize": "2",
    "currentBenefits": ["Medi-Cal"],
    "members": [
        {"isPrimary": True, "birthMonth": 4, "birthYear": "2001", "conditions": ["Pregnant"]},
        {"isPrimary": False, "birthYear": "2024", "conditions": []},
    ],
}


def main():
    with patch.dict("os.environ", {"BROWSERBASE_API_KEY": "", "BROWSERBASE_PROJECT_ID": ""}):
        result = run_application("calfresh", PROFILE)

    assert result["mode"] == "simulated"
    assert result["fallbackReason"] == "missing_browserbase_credentials"
    assert result["liveViewUrl"] is None
    assert result["confirmation"] == "CF-DEMO-4821"
    assert result["automationEvidence"]["mode"] == "simulated"
    assert result["automationEvidence"]["confirmationVerified"] is True
    assert "BROWSERBASE_API_KEY" in result["note"]

    email = f"oski.fallback-route+{uuid4().hex}@example.com"
    route_profile = deepcopy(PROFILE)
    route_profile["email"] = email
    with patch.dict("os.environ", {"BROWSERBASE_API_KEY": "", "BROWSERBASE_PROJECT_ID": ""}):
        client = app.test_client()
        res = client.post("/api/agent/apply", json={"programId": "calfresh", "profile": route_profile})
        assert res.status_code == 200
        body = res.get_json()
        assert body["mode"] == "simulated"
        assert body["applicationPersisted"] is False
        assert "application" not in body

        apps_res = client.get(f"/api/applications?email={email}")
        assert apps_res.status_code == 200
        assert apps_res.get_json()["applications"] == []
    print("Agent fallback verification passed")


if __name__ == "__main__":
    main()
