"""Verify the hackathon demo path end to end.

Prereqs:
  1. Backend running at http://127.0.0.1:5001
  2. Frontend running at http://127.0.0.1:5173
  3. Browserbase credentials in backend/.env for a cloud-browser run

This script drives the same path a judge should see:
load demo profile -> eligibility dashboard -> CalFresh auto-apply -> WIC auto-apply.
It saves screenshots under /tmp/benefits_frontend_e2e.
"""

import re
import json
from urllib.parse import quote
from urllib.request import urlopen
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


FRONTEND_URL = "http://127.0.0.1:5173/"
OUT_DIR = Path("/tmp/benefits_frontend_e2e")


def main():
    OUT_DIR.mkdir(exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1100})
        console = []
        page.on("console", lambda msg: console.append(f"{msg.type}: {msg.text}"))

        page.goto(FRONTEND_URL, wait_until="networkidle")
        page.get_by_role("button", name="Load CalFresh + WIC demo profile").click()
        email = page.get_by_label("Email address").input_value()
        page.get_by_role("button", name=re.compile("Find my benefits", re.I)).click()
        page.wait_for_load_state("networkidle")
        verify_profile_roundtrip(email)

        expect(page.get_by_text("Ready to auto-apply")).to_be_visible(timeout=15000)
        expect(page.get_by_text("For the demo, we are focusing on the two end-to-end agent flows")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Agent-ready packet")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Household: 2 people")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Monthly income: $2,000")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Current benefits: Medi-Cal")).to_be_visible(timeout=15000)
        expect(page.get_by_text("WIC signal: pregnancy or child under 5")).to_be_visible(timeout=15000)
        expect(page.get_by_text("CalFresh (SNAP)")).to_be_visible(timeout=15000)
        expect(page.get_by_text("California WIC")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Also worth applying for")).to_be_hidden(timeout=15000)
        page.screenshot(path=str(OUT_DIR / "dashboard.png"), full_page=True)

        auto_apply(
            page,
            "CalFresh (SNAP)",
            "CalFresh application submitted. Confirmation #CF-DEMO-4821",
            "https://benefitscal.com/Public/login",
        )
        page.screenshot(path=str(OUT_DIR / "calfresh-agent.png"), full_page=True)

        page.get_by_role("button", name=re.compile("Back to dashboard", re.I)).click()
        expect(page.get_by_text("Submitted applications")).to_be_visible(timeout=15000)
        expect(page.get_by_text("CalFresh application submitted. Confirmation #CF-DEMO-4821")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Browserbase verified")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Ready to auto-apply")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Also worth applying for")).to_be_hidden(timeout=15000)

        auto_apply(
            page,
            "California WIC",
            "WIC appointment request submitted. Confirmation #WIC-DEMO-2048",
            "https://www.myfamily.wic.ca.gov/Home/AmIEligible",
        )
        page.screenshot(path=str(OUT_DIR / "wic-agent.png"), full_page=True)

        page.get_by_role("button", name=re.compile("Back to dashboard", re.I)).click()
        expect(page.get_by_text("CalFresh and WIC are submitted and verified for the demo.")).to_be_visible(timeout=15000)
        expect(page.get_by_text("CalFresh application submitted. Confirmation #CF-DEMO-4821")).to_be_visible(timeout=15000)
        expect(page.get_by_text("WIC appointment request submitted. Confirmation #WIC-DEMO-2048")).to_be_visible(timeout=15000)
        expect(page.get_by_text("Browserbase verified").first).to_be_visible(timeout=15000)
        expect(page.get_by_text("Also worth applying for")).to_be_hidden(timeout=15000)
        page.screenshot(path=str(OUT_DIR / "submitted-dashboard.png"), full_page=True)

        issues = [
            msg
            for msg in console
            if "React does not recognize" in msg
            or "Failed to load resource" in msg
            or "error" in msg.lower()
        ]
        if issues:
            raise AssertionError("Console issues found:\n" + "\n".join(issues[:10]))

        print("Demo E2E passed")
        print(f"Screenshots: {OUT_DIR}")
        browser.close()


def auto_apply(page, card_text, confirmation, portal_url):
    page.locator(".MuiCard-root").filter(has_text=card_text).get_by_role(
        "button", name=re.compile("Auto-apply", re.I)
    ).click()
    expect(page.get_by_text(re.compile("AI agent applying to"))).to_be_visible(timeout=15000)
    expect(page.get_by_text("Browserbase is running the portal automation now")).to_be_visible(timeout=5000)
    expect(page.get_by_text(portal_url)).to_be_visible(timeout=60000)
    expect(page.get_by_role("link", name="Open live browser")).to_be_visible(timeout=90000)
    expect(page.get_by_text("Browserbase navigated the routed portal")).to_be_visible(timeout=15000)
    expect(page.get_by_text("Browserbase cloud browser")).to_be_visible(timeout=15000)
    expect(page.get_by_text(re.compile(r"\d+ fields verified"))).to_be_visible(timeout=15000)
    expect(page.get_by_text(re.compile(r"\d+ actions verified"))).to_be_visible(timeout=15000)
    expect(page.get_by_text("Portal confirmation verified")).to_be_visible(timeout=15000)
    expect(page.get_by_text("Verification trail")).to_be_visible(timeout=15000)
    expect(page.get_by_text("Verified form fields")).to_be_visible(timeout=15000)
    expect(page.get_by_text("Verified portal actions")).to_be_visible(timeout=15000)
    expect(page.get_by_text(confirmation)).to_be_visible(timeout=60000)
    expect(page.get_by_alt_text("Submitted portal screenshot")).to_be_visible(timeout=15000)


def verify_profile_roundtrip(email):
    with urlopen(f"http://127.0.0.1:5001/api/profile?email={quote(email)}", timeout=10) as res:
        profile = json.load(res)["profile"]
    assert profile["zipcode"] == "94704"
    assert profile["county"] == "Alameda"
    assert profile["demoMode"] is True
    assert len(profile["members"]) == 2
    assert profile["members"][0]["conditions"] == ["Pregnant"]
    assert len(profile["expenses"]) == 2


if __name__ == "__main__":
    main()
