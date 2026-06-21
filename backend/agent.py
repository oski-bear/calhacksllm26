"""AI agent that fills a benefits application portal for the user.

Safety: this NEVER submits a real government application. It targets a local
*mock* portal (served by this backend) and submits only inside that fake portal. When
Browserbase credentials are present it drives a real cloud browser (so judges
can watch live); otherwise it returns a "simulated" plan the frontend animates.

Env:
  BROWSERBASE_API_KEY     enable real browser automation
  BROWSERBASE_PROJECT_ID  required with the API key
  MOCK_PORTAL_BASE        default http://localhost:5001/mock
"""

import base64
import os

CURRENT_YEAR = 2026
BASE_DIR = os.path.dirname(__file__)

# The ordered fill steps shown to the user, per program.
STEPS = {
    "calfresh": [
        "Opening BenefitsCal application portal…",
        "Entering applicant name & date of birth…",
        "Entering contact details…",
        "Entering home address & county…",
        "Entering household size & income…",
        "Entering rent & utility expenses…",
        "Submitting completed demo application…",
        "Capturing the confirmation number.",
    ],
    "wic": [
        "Opening California WIC request portal…",
        "Entering contact details…",
        "Entering location & county…",
        "Selecting participant category…",
        "Entering household size & income…",
        "Noting adjunctive eligibility…",
        "Submitting completed demo request…",
        "Capturing the confirmation number.",
    ],
}


def _split_name(name):
    parts = (name or "").strip().split()
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def _primary(profile):
    members = profile.get("members") or []
    return members[0] if members else {}


def _ages(profile):
    ages = []
    for m in profile.get("members") or []:
        by = m.get("birthYear")
        if by:
            try:
                ages.append(CURRENT_YEAR - int(float(by)))
            except (TypeError, ValueError):
                pass
    return ages


def _conditions(profile):
    conds = set()
    for m in profile.get("members") or []:
        for c in m.get("conditions") or []:
            conds.add(c)
    return conds


def _monthly(amount):
    try:
        return f"${float(amount) / 12:,.0f}"
    except (TypeError, ValueError):
        return "$0"


def _expense_monthly(profile, *types):
    per_year = {"weekly": 52, "biweekly": 26, "semimonthly": 24, "monthly": 12, "yearly": 1}
    total = 0.0
    for e in profile.get("expenses") or []:
        if any(t.lower() in (e.get("type") or "").lower() for t in types):
            try:
                total += float(e.get("amount") or 0) * per_year.get(e.get("frequency"), 12) / 12
            except (TypeError, ValueError):
                pass
    return f"${total:,.0f}"


def field_values(program_id, profile):
    """Map the rich intake profile to the mock portal's form field values."""
    first, last = _split_name(profile.get("name"))
    primary = _primary(profile)
    ages = _ages(profile)
    conds = _conditions(profile)
    pregnant = "Yes" if "Pregnant" in conds else "No"
    dob = ""
    if primary.get("birthMonth") and primary.get("birthYear"):
        dob = f"{int(primary['birthMonth']):02d}/01/{primary['birthYear']}"

    common = {
        "firstName": first,
        "lastName": last,
        "email": profile.get("email", ""),
        "phone": profile.get("phone", "(510) 555-0148"),
        "address": profile.get("address", "2120 Dwight Way"),
        "city": profile.get("city", "Berkeley"),
        "zip": profile.get("zipcode", ""),
        "county": profile.get("county", ""),
        "householdSize": str(profile.get("householdSize", len(profile.get("members") or []) or 1)),
        "monthlyIncome": _monthly(profile.get("income")),
    }

    if program_id == "calfresh":
        return {
            **common,
            "dob": dob,
            "ssn": "•••-••-••••",  # never auto-enter a real SSN
            "rent": _expense_monthly(profile, "rent", "mortgage"),
            "utilities": _expense_monthly(profile, "utilit"),
            "pregnant": pregnant,
            "childrenUnder18": str(sum(1 for a in ages if a < 18)),
        }

    if program_id == "wic":
        category = "Pregnant" if "Pregnant" in conds else (
            "Child under 5" if any(a < 5 for a in ages) else "—"
        )
        benefits = profile.get("currentBenefits") or []
        adjunctive = next(
            (b for b in benefits if b in ("Medi-Cal", "CalFresh / SNAP", "CalWORKs")), "No"
        )
        return {
            **common,
            "contactMethod": "Text",
            "language": "Spanish",
            "category": category,
            "dueDate": profile.get("dueDate", "11/2026"),
            "adjunctive": adjunctive,
        }

    return common


def _portal_url(program_id):
    base = os.environ.get("MOCK_PORTAL_BASE", "http://localhost:5001/mock")
    page = "benefitscal" if program_id == "calfresh" else "wic"
    return f"{base}/{page}.html"


def _portal_file(program_id):
    page = "benefitscal" if program_id == "calfresh" else "wic"
    return os.path.join(BASE_DIR, "mock", f"{page}.html")


def _is_local_url(url):
    return (
        url.startswith("http://localhost:")
        or url.startswith("https://localhost:")
        or url.startswith("http://127.0.0.1:")
        or url.startswith("https://127.0.0.1:")
    )


def _confirmation(program_id):
    return "WIC-DEMO-2048" if program_id == "wic" else "CF-DEMO-4821"


def run_application(program_id, profile):
    """Fill the mock portal. Returns mode, steps, mapped values, and (if
    Browserbase is configured) a live-view URL + final screenshot."""
    steps = STEPS.get(program_id, STEPS["calfresh"])
    values = field_values(program_id, profile)
    portal_url = _portal_url(program_id)

    api_key = os.environ.get("BROWSERBASE_API_KEY")
    project_id = os.environ.get("BROWSERBASE_PROJECT_ID")

    if not (api_key and project_id):
        return {
            "mode": "simulated",
            "program": program_id,
            "portalUrl": portal_url,
            "steps": steps,
            "values": values,
            "liveViewUrl": None,
            "confirmation": _confirmation(program_id),
            "note": "Set BROWSERBASE_API_KEY and BROWSERBASE_PROJECT_ID to run a real browser.",
        }

    # Real browser automation via Browserbase against our local mock portal.
    # The final click is safe because the page is static demo HTML.
    try:
        from browserbase import Browserbase
        from playwright.sync_api import sync_playwright

        bb = Browserbase(api_key=api_key)
        session = bb.sessions.create(project_id=project_id)

        live_url = None
        try:
            debug = bb.sessions.debug(session.id)
            live_url = getattr(debug, "debugger_fullscreen_url", None) or getattr(
                debug, "debuggerFullscreenUrl", None
            )
        except Exception:
            pass

        screenshot_b64 = None
        confirmation = _confirmation(program_id)
        with sync_playwright() as p:
            browser = p.chromium.connect_over_cdp(session.connect_url)
            context = browser.contexts[0] if browser.contexts else browser.new_context()
            page = context.pages[0] if context.pages else context.new_page()
            if _is_local_url(portal_url):
                with open(_portal_file(program_id), encoding="utf-8") as f:
                    page.set_content(f.read(), wait_until="load")
            else:
                page.goto(portal_url, wait_until="load")
            for name, value in values.items():
                try:
                    page.fill(f'[name="{name}"]', str(value), timeout=4000)
                    page.wait_for_timeout(350)  # let the live view show each field
                except Exception:
                    pass
            try:
                page.click('[data-agent-submit="true"]', timeout=4000)
                page.wait_for_timeout(800)
                confirmation = page.locator("#confirmation").inner_text(timeout=2000)
            except Exception:
                pass
            screenshot_b64 = base64.b64encode(page.screenshot()).decode()
            # Do not close the Browserbase browser here; closing it makes the
            # live debugger iframe disconnect before judges can see the result.

        try:
            debug = bb.sessions.debug(session.id)
            live_url = getattr(debug, "debugger_fullscreen_url", None) or getattr(
                debug, "debuggerFullscreenUrl", None
            )
        except Exception:
            pass

        return {
            "mode": "browserbase",
            "program": program_id,
            "portalUrl": portal_url,
            "steps": steps,
            "values": values,
            "liveViewUrl": live_url,
            "sessionId": session.id,
            "screenshot": screenshot_b64,
            "confirmation": confirmation,
        }
    except Exception as err:
        # Never break the demo — fall back to the simulated plan.
        return {
            "mode": "simulated",
            "program": program_id,
            "portalUrl": portal_url,
            "steps": steps,
            "values": values,
            "liveViewUrl": None,
            "confirmation": _confirmation(program_id),
            "error": str(err),
        }
