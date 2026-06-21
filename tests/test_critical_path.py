"""Fast critical-path tests for the hackathon demo.

These intentionally avoid Browserbase and Anthropic so they can run minutes
before submission. The slower cloud-browser proof lives in scripts/verify_demo.py.
"""

import os
import sys
import tempfile
import unittest
from copy import deepcopy
from pathlib import Path
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from agent import account_values, field_values, run_application  # noqa: E402
from app import app  # noqa: E402
import db  # noqa: E402
from eligibility import evaluate_all  # noqa: E402


DEMO_PROFILE = {
    "name": "Oski Bear",
    "email": "oski.demo@example.com",
    "phone": "(510) 555-0148",
    "address": "2120 Dwight Way",
    "city": "Berkeley",
    "zipcode": "94704",
    "county": "Alameda",
    "state": "CA",
    "citizenship": "U.S. Citizen",
    "assets": "250",
    "income": "24000",
    "householdSize": "2",
    "currentBenefits": ["Medi-Cal"],
    "members": [
        {
            "isPrimary": True,
            "relationship": "Self",
            "birthMonth": 4,
            "birthYear": "2001",
            "conditions": ["Pregnant"],
        },
        {
            "isPrimary": False,
            "relationship": "Child",
            "birthMonth": 8,
            "birthYear": "2024",
            "conditions": [],
        },
    ],
    "expenses": [
        {"type": "Rent", "amount": "1200", "frequency": "monthly"},
        {"type": "Utilities (gas, electric, water)", "amount": "180", "frequency": "monthly"},
    ],
}


class EligibilityTests(unittest.TestCase):
    def test_demo_profile_prioritizes_calfresh_and_wic(self):
        programs = {program["id"]: program for program in evaluate_all(DEMO_PROFILE)}

        self.assertEqual(programs["calfresh"]["status"], "eligible")
        self.assertEqual(programs["wic"]["status"], "eligible")
        self.assertTrue(programs["calfresh"]["auto_apply"])
        self.assertTrue(programs["wic"]["auto_apply"])
        self.assertTrue(any("Source:" in reason for reason in programs["calfresh"]["reasons"]))
        self.assertTrue(any("Source:" in reason for reason in programs["wic"]["reasons"]))

    def test_demo_profile_also_surfaces_non_auto_apply_benefits(self):
        programs = {program["id"]: program for program in evaluate_all(DEMO_PROFILE)}

        for program_id in ("medical", "liheap", "lifeline"):
            self.assertEqual(programs[program_id]["status"], "eligible")
            self.assertFalse(programs[program_id]["auto_apply"])

        self.assertEqual(programs["calworks"]["status"], "maybe")
        self.assertFalse(programs["calworks"]["auto_apply"])

    def test_wic_requires_pregnancy_or_child_under_five(self):
        profile = deepcopy(DEMO_PROFILE)
        profile["currentBenefits"] = []
        profile["members"] = [
            {
                "isPrimary": True,
                "birthMonth": 4,
                "birthYear": "1996",
                "conditions": [],
            }
        ]
        profile["householdSize"] = "1"

        programs = {program["id"]: program for program in evaluate_all(profile)}

        self.assertEqual(programs["wic"]["status"], "not_eligible")
        self.assertTrue(any("pregnant" in reason.lower() for reason in programs["wic"]["reasons"]))


class AgentMappingTests(unittest.TestCase):
    def test_calfresh_field_mapping_masks_ssn_and_reuses_expenses(self):
        values = field_values("calfresh", DEMO_PROFILE)
        account = account_values(DEMO_PROFILE)

        self.assertEqual(values["firstName"], "Oski")
        self.assertEqual(values["lastName"], "Bear")
        self.assertEqual(values["dob"], "04/01/2001")
        self.assertEqual(values["ssn"], "•••-••-••••")
        self.assertEqual(values["monthlyIncome"], "$2,000")
        self.assertEqual(values["rent"], "$1,200")
        self.assertEqual(values["utilities"], "$180")
        self.assertEqual(values["childrenUnder18"], "1")
        self.assertEqual(account["accountEmail"], DEMO_PROFILE["email"])
        self.assertEqual(account["signatureFirstName"], "Oski")

    def test_wic_field_mapping_uses_category_and_adjunctive_benefit(self):
        values = field_values("wic", DEMO_PROFILE)

        self.assertEqual(values["category"], "Pregnant")
        self.assertEqual(values["adjunctive"], "Medi-Cal")
        self.assertEqual(values["contactMethod"], "Text")
        self.assertEqual(values["language"], "Spanish")
        self.assertEqual(values["zip"], "94704")

    def test_missing_browserbase_returns_safe_simulation(self):
        with patch.dict(os.environ, {"BROWSERBASE_API_KEY": "", "BROWSERBASE_PROJECT_ID": ""}):
            result = run_application("calfresh", DEMO_PROFILE)

        self.assertEqual(result["mode"], "simulated")
        self.assertEqual(result["confirmation"], "CF-DEMO-4821")
        self.assertEqual(result["fallbackReason"], "missing_browserbase_credentials")
        self.assertIsNone(result["liveViewUrl"])
        self.assertTrue(result["automationEvidence"]["confirmationVerified"])


class FlaskRouteTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.original_db_path = db.DB_PATH
        db.DB_PATH = str(Path(self.tmp.name) / "benefits-test.db")
        db.init_db()
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def tearDown(self):
        db.DB_PATH = self.original_db_path
        self.tmp.cleanup()

    def test_profile_eligibility_and_safe_agent_route(self):
        profile = deepcopy(DEMO_PROFILE)
        profile["email"] = "route-test@example.com"

        save_res = self.client.post("/api/profile", json=profile)
        self.assertEqual(save_res.status_code, 200)
        self.assertEqual(save_res.get_json()["profile"]["email"], profile["email"])

        eligibility_res = self.client.post("/api/eligibility", json=profile)
        self.assertEqual(eligibility_res.status_code, 200)
        ids = {program["id"] for program in eligibility_res.get_json()["programs"]}
        self.assertIn("calfresh", ids)
        self.assertIn("wic", ids)

        with patch.dict(os.environ, {"BROWSERBASE_API_KEY": "", "BROWSERBASE_PROJECT_ID": ""}):
            agent_res = self.client.post(
                "/api/agent/apply",
                json={"programId": "calfresh", "profile": profile},
            )
        self.assertEqual(agent_res.status_code, 200)
        agent_body = agent_res.get_json()
        self.assertEqual(agent_body["mode"], "simulated")
        self.assertFalse(agent_body["applicationPersisted"])

        apps_res = self.client.get(f"/api/applications?email={profile['email']}")
        self.assertEqual(apps_res.status_code, 200)
        self.assertEqual(apps_res.get_json()["applications"], [])

    def test_verified_browserbase_result_persists_application(self):
        result = {
            "mode": "browserbase",
            "portalUrl": "https://benefitscal.com/Public/login",
            "liveViewUrl": "https://browserbase.example/session-test",
            "sessionId": "session-test",
            "confirmation": "CF-DEMO-4821",
            "screenshot": "base64-png",
            "automationEvidence": {
                "filledFields": ["firstName", "lastName"],
                "clickedControls": ["Submit application"],
                "confirmationVerified": True,
            },
        }

        saved = db.save_application("persist-test@example.com", "calfresh", result)
        rows = db.list_applications("persist-test@example.com")

        self.assertEqual(saved["confirmation"], "CF-DEMO-4821")
        self.assertEqual(rows[0]["program_id"], "calfresh")
        self.assertEqual(rows[0]["mode"], "browserbase")
        self.assertEqual(rows[0]["live_view_url"], "https://browserbase.example/session-test")
        self.assertEqual(rows[0]["screenshot"], "base64-png")
        self.assertEqual(rows[0]["verified_field_count"], 2)
        self.assertEqual(rows[0]["verified_control_count"], 1)
        self.assertTrue(rows[0]["confirmation_verified"])


if __name__ == "__main__":
    unittest.main()
