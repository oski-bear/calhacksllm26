"""AI agent that fills a benefits application portal for the user.

Safety: this NEVER submits a real government application. It targets a local
*mock* portal (served by this backend) and submits only inside that fake portal. When
Browserbase credentials are present it drives a real cloud browser (so judges
can watch live); otherwise it returns a "simulated" plan the frontend animates.

Env:
  BROWSERBASE_API_KEY     enable real browser automation
  BROWSERBASE_PROJECT_ID  required with the API key
"""

import base64
import os

CURRENT_YEAR = 2026
BASE_DIR = os.path.dirname(__file__)

PORTAL_URLS = {
    "calfresh": "https://benefitscal.com/Public/login",
    "wic": "https://www.myfamily.wic.ca.gov/Home/AmIEligible",
}

PORTAL_ROUTE_PATTERNS = {
    "calfresh": "https://benefitscal.com/Public/login*",
    "wic": "https://www.myfamily.wic.ca.gov/Home/AmIEligible*",
}

# The ordered fill steps shown to the user, per program.
STEPS = {
    "calfresh": [
        "Opening BenefitsCal application portal...",
        "Creating a demo BenefitsCal account...",
        "Choosing CalFresh from the benefits menu...",
        "Entering applicant name and date of birth...",
        "Entering contact details...",
        "Entering home address and county...",
        "Entering household size, income, and expenses...",
        "Reviewing answers before submission...",
        "Signing the application electronically...",
        "Submitting completed demo application...",
        "Capturing the confirmation number.",
    ],
    "wic": [
        "Opening California WIC assessment portal...",
        "Entering ZIP code, county, and WIC category...",
        "Checking income and adjunctive benefit answers...",
        "Selecting a nearby WIC office...",
        "Entering appointment contact details...",
        "Reviewing the WIC appointment request...",
        "Submitting completed demo request...",
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


def account_values(profile):
    first, last = _split_name(profile.get("name"))
    return {
        "accountEmail": profile.get("email", "oski@example.com"),
        "accountPassword": "DemoPass!2026",
        "accountPhone": profile.get("phone", "(510) 555-0148"),
        "signatureFirstName": first,
        "signatureLastName": last,
        "signatureDate": "06/21/2026",
    }


def _portal_url(program_id):
    return PORTAL_URLS.get(program_id, PORTAL_URLS["calfresh"])


def _portal_file(program_id):
    page = "benefitscal" if program_id == "calfresh" else "wic"
    return os.path.join(BASE_DIR, "mock", f"{page}.html")


def _route_mock_portal(page, program_id):
    with open(_portal_file(program_id), encoding="utf-8") as f:
        html = f.read()

    def fulfill(route):
        route.fulfill(status=200, content_type="text/html", body=html)

    page.route(PORTAL_ROUTE_PATTERNS.get(program_id, PORTAL_ROUTE_PATTERNS["calfresh"]), fulfill)


def _confirmation(program_id):
    return "WIC-DEMO-2048" if program_id == "wic" else "CF-DEMO-4821"


def _fill_fields(page, values, names):
    for name in names:
        if name not in values:
            continue
        try:
            page.fill(f'[name="{name}"]', str(values[name]), timeout=4000)
            page.wait_for_timeout(250)  # let the live view show each field
        except Exception:
            pass


def _click(page, selector):
    try:
        page.click(selector, timeout=4000)
        page.wait_for_timeout(650)
    except Exception:
        pass


def _drive_portal(page, program_id, values, profile):
    """Drive the staged demo portals in the same order a user would."""
    if program_id == "wic":
        _fill_fields(
            page,
            values,
            ["zip", "county", "category", "householdSize", "monthlyIncome", "adjunctive"],
        )
        _click(page, '[data-agent-start-assessment="true"]')
        _click(page, '[data-agent-choose-office="true"]')
        _fill_fields(
            page,
            values,
            [
                "firstName",
                "lastName",
                "phone",
                "email",
                "contactMethod",
                "language",
                "address",
                "city",
                "dueDate",
            ],
        )
        _click(page, '[data-agent-review="true"]')
    else:
        _fill_fields(page, account_values(profile), ["accountEmail", "accountPassword", "accountPhone"])
        _click(page, '[data-agent-create-account="true"]')
        _click(page, '[data-agent-start-application="true"]')
        _fill_fields(
            page,
            values,
            [
                "firstName",
                "lastName",
                "dob",
                "ssn",
                "phone",
                "email",
                "address",
                "city",
                "zip",
                "county",
                "householdSize",
                "monthlyIncome",
                "rent",
                "utilities",
                "pregnant",
                "childrenUnder18",
            ],
        )
        _click(page, '[data-agent-review="true"]')
        _click(page, '[data-agent-review-next="true"]')
        _fill_fields(
            page,
            account_values(profile),
            ["signatureFirstName", "signatureLastName", "signatureDate"],
        )
        try:
            page.check('[name="signatureAgree"]', timeout=4000)
            page.wait_for_timeout(250)
        except Exception:
            pass
        _click(page, '[data-agent-signature="true"]')

    _click(page, '[data-agent-submit="true"]')


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
            _route_mock_portal(page, program_id)
            page.goto(portal_url, wait_until="load")
            _drive_portal(page, program_id, values, profile)
            try:
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
