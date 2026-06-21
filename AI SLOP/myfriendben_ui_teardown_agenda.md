# MyFriendBen UI Teardown Agenda

Goal: use the MyFriendBen Illinois screener as a high-quality UX reference for our benefits navigator without copying proprietary assets, logos, illustrations, or exact copy.

Important guardrail:

> Copy patterns, not protected assets. Use screenshots and notes as visual reference. Recreate our own components, icons, illustrations, copy, colors, and data model for BridgeBenefits / Cal-focused benefits prep.

## Why We Like It

| Quality | What To Learn |
|---|---|
| Low-stress intake | The flow feels approachable instead of bureaucratic. |
| Step-by-step structure | Each page asks for a small amount of information. |
| Plain-language copy | The UI reduces fear and confusion around benefits. |
| Strong spacing and hierarchy | It is easy to see what matters on each screen. |
| Trustworthy tone | It does not feel like a scammy third-party form. |
| Fast perceived progress | Users understand where they are in the screener. |

## Teardown Tasks

| Task | Output |
|---|---|
| Walk through every screener step manually | Screenshot each page, input state, error state, review screen, and results page. |
| Map the information architecture | Flow diagram from landing/intake to results and next steps. |
| Identify reusable UI patterns | Component list: progress indicator, cards, radio groups, checkboxes, form fields, helper text, result cards, CTA buttons. |
| Capture copywriting patterns | Notes on how questions are phrased, how sensitive questions are softened, and where trust language appears. |
| Capture visual system | Approximate typography, spacing, border radius, button treatment, card treatment, and color roles. |
| Inspect static assets | Inventory public asset URLs, CSS bundles, fonts, icons, and images for reference only. |
| Decide what not to copy | Do not reuse exact logo, illustrations, proprietary screenshots, exact wording, or brand styling. |
| Convert findings into Claude brief | One concise UI spec Claude can implement in our app. |

## Suggested Screenshot Set

Create a reference folder:

```bash
mkdir -p "AI SLOP/references/myfriendben-ui"
```

Capture:

- Start / welcome page
- Household composition page
- Location page
- Income pages
- Expense pages
- Current benefits page
- Review / confirmation page
- Results page
- Error and validation states
- Mobile viewport versions
- Any tooltip / helper text states

## Browser Inspection Plan

Use Playwright, Chrome DevTools, or manual browser inspection to collect a reference inventory:

| Inspect | Why |
|---|---|
| CSS variables and computed styles | Recreate spacing/color hierarchy in our own design system. |
| Font files | Identify the typography mood; use our own safe alternative if needed. |
| Network requests | Understand whether the screener is purely client-side or server-driven. |
| Static images/icons | Know what visual language they use, but create our own equivalents. |
| Form validation | Copy the UX principle of friendly error handling. |
| Mobile behavior | Benefits users may be phone-first. |

## Possible Local Commands

Use these only as reference-gathering helpers, not as a license to reuse assets:

```bash
mkdir -p "AI SLOP/references/myfriendben-ui"
```

```js
// Playwright sketch for screenshots.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("https://screener.myfriendben.org/il/step-1", { waitUntil: "networkidle" });
await page.screenshot({ path: "AI SLOP/references/myfriendben-ui/01-mobile-start.png", fullPage: true });
await browser.close();
```

```js
// Asset inventory sketch.
const assets = performance.getEntriesByType("resource")
  .map((entry) => entry.name)
  .filter((url) => /\.(css|js|png|jpg|jpeg|svg|webp|woff2?)($|\?)/i.test(url));
console.log([...new Set(assets)].join("\n"));
```

## Claude Brief We Eventually Want

> Use MyFriendBen as the UX inspiration: step-by-step, friendly, low-stress, mobile-first, with clean progress and plain-language benefit questions. Do not copy their logo, exact text, illustrations, or CSS. Build our own Berkeley/California themed version for BridgeBenefits. Our differentiator is that results include rule-cited eligibility receipts, missing-document preflight, and a human-reviewed Browserbase draft-fill flow.

## What To Copy Conceptually

- Progressive intake instead of a giant form
- Warm and nonjudgmental question phrasing
- Clear progress indicator
- Big touch targets
- Minimal fields per page
- Plain-language helper text for confusing eligibility concepts
- Results grouped by likely / maybe / unlikely
- Checklist-style next steps

## What To Add Beyond MyFriendBen

- Rule-cited eligibility receipts
- Missing-document preflight
- Drafted application packet
- Browserbase review-only form fill
- California program focus
- Human review mode
- Audit trail showing which facts matched which rules
- Explicit "we never submit without your approval" safety language

## Current Competitive Takeaway

MyFriendBen is the best UI reference, but it does not seem to own our hackathon wedge: California-specific, rule-cited, document-aware application drafting with a visible review-only browser agent.
