# Competitor Claim Reverification

Date: 2026-06-21

Question: are our competitor claims real, or are we hallucinating ourselves into a fake moat?

Short answer: **your claims are mostly correct, with two important nuances.** Link Health / LEO is closer than "just a chatbot," and Benefit Kitchen should not be dismissed as merely rough estimation. Still, I did not find a public product that cleanly owns our exact hackathon wedge: **California-specific, rule-cited eligibility receipts + document preflight + review-only browser form drafting.**

## Verification Table

| Claim | Verdict | Evidence | What It Means |
|---|---|---|---|
| Maryland Unified Benefits Screener / One Application is Maryland-only. | Confirmed. | Maryland governor page repeatedly frames the tool for "Marylanders." It covers Medicaid, SNAP, Emergency Assistance, WIC, and OHEP, and the later One Application lets Marylanders apply for several benefits at once. | Treat as validation, not a direct California competitor. Do not claim "one application for many benefits" is novel. |
| Anthropic + Maryland benefits assistant is Maryland-only. | Confirmed. | Anthropic describes a partnership with the State of Maryland to deploy Claude across Maryland agencies, including a benefits assistant for SNAP, Medicaid, temporary cash assistance, and WIC. | Great sponsor validation. We should pitch a California prototype, not novelty at category level. |
| Beacon Benefits Navigator is waitlist, not a working public app. | Confirmed from public site. | Its page says "We're building" the tool, has "Join the waitlist," and says it is "launching soon in select states." | A working demo beats a landing page. |
| MyFriendBen has great UI, works in only a few states, and does not auto-apply. | Mostly confirmed. | The public site/state selector lists Colorado, Illinois, Massachusetts, North Carolina, Washington, and Texas. State pages say it anonymously checks eligibility and estimates dollar value. The North Carolina FAQ explicitly says it is an estimate, not a benefit application, and that they are not able to combine separate applications into MyFriendBen. | It is the UI benchmark. Our wedge should be application prep/drafting, not just screening. |
| Link Health / LEO is just an AI chatbot and does not auto-apply. | Partly corrected. | Link Health calls LEO an AI chatbot, but also says it guides people through applications, handles screening/form completion/status updates, and that trained enrollment specialists review/approve submissions. A separate analysis says patient navigators audit applications submitted with LEO. | It is closer than "just chatbot." The safe distinction is: no public evidence of Browserbase-style auto-fill into official portals, but they do have AI-assisted enrollment with human review. |
| mRelief is SNAP-only. | Confirmed. | Digital Government Hub says mRelief helps people in all 53 U.S. states/territories determine SNAP eligibility and apply through web/text tools. It routes people to a simplified SNAP application, state portal, or community help. | Do not compete with mRelief on SNAP-only UX. Compete on multi-benefit California packet drafting. |
| Benefit Kitchen seems like rough estimation. | Needs correction. | Benefit Kitchen says it offers to-the-dollar screening for 25 programs, APIs live in all 50 states, CRM/datasets/integrations, application referrals, pre-filled forms, and caseworker assistance. It also says it does not use AI and includes legal disclaimers that final benefits may differ. | Do not call it "rough" in the pitch. Call it a deterministic screener/API/estimator, not an AI application co-pilot. |

## Additional Competitors / Prior Art Found Or Reconfirmed

| Competitor / Pattern | Relevance | Notes |
|---|---|---|
| State integrated benefits applications | Very high category-level prior art | Code for America's field guide says 35 states offer integrated applications for 3+ assessed benefits, and 5 states offer all five assessed programs in one application. |
| Benefits Data Trust / Benefits Launch | Historically very close | Beeck Center documented BDT's phone-based application assistance for up to 11 benefit programs, including collecting documents and submitting applications on callers' behalf. BDT has since ceased operations according to later nonprofit profiles, but the workflow is real prior art. |
| Single Stop | Strong B2B screener | Screens for 20+ / 27 benefits, provides referrals/application guides/local resources, and includes case management/reporting for organizations. |
| ACCESS NYC / ACCESS HRA | Strong official government UX | ACCESS NYC screens for programs; ACCESS HRA lets users apply for SNAP, Cash Assistance, and Medicaid renewal, with some combined application flow. |
| BenefitsCal + GetCalFresh | California source of truth | BenefitsCal is the official CA portal. GetCalFresh now explains CalFresh and routes users to BenefitsCal. Our product should prepare users for BenefitsCal rather than pretend to replace it. |
| Nava AI public-benefits experiments | Strong design validation | Nava tested AI tools for navigators, including policy Q&A and document review/preflight, and explicitly kept humans in the loop. |
| SafetyNet Navigator | Watchlist only | A public page claims a single intake that checks SNAP/Medicaid/LIHEAP/local grants and auto-fills forms, but I did not find evidence that it is a deployed product. Treat as idea collision, not a major competitor. |

## Updated Competitive Truth

Do **not** say:

- "Nobody has built a benefits navigator."
- "Nobody screens across multiple benefits."
- "Nobody helps people apply."
- "Nobody uses AI here."
- "Nobody has one application."

Those are false or too easy to attack.

Say:

> Existing tools mostly stop at screening, referrals, navigator support, or official state portals. We built a California-focused application prep co-pilot that shows its work: cited eligibility receipts, missing-document preflight, and a review-only browser draft-fill flow where the user stays in control.

## Best Hackathon Wedge After Reverification

The defensible demo is not "AI benefits navigator." That space is crowded.

The defensible demo is:

1. **California specificity**: BenefitsCal / CalFresh / Medi-Cal / CalWORKs / WIC / CARE-FERA.
2. **Rule-cited eligibility receipts**: every recommendation shows the exact rule and user facts.
3. **Document preflight**: tells the family which docs are missing or likely to cause denial/delay.
4. **Application packet**: converts intake into editable answers for real applications.
5. **Browserbase review-only fill**: visible agent action, no silent submission.
6. **Human-in-loop trust**: inspired by Link Health/Nava/BDT, but packaged as a hackathon-visible product.

## Source Links

- Maryland Unified Benefits Screener: https://governor.maryland.gov/news/press-releases/governor-moore-announces-new-mobile-friendly-tool-streamline-benefits-access-marylanders
- Maryland + Anthropic: https://www.anthropic.com/news/maryland-partnership
- Beacon Benefits Navigator: https://www.beacon-benefits.org/
- MyFriendBen: https://www.myfriendben.org/
- MyFriendBen North Carolina FAQ: https://bennc.org/faq/
- MyFriendBen Massachusetts page: https://www.myfriendben.org/massachusetts/
- Link Health LEO: https://link-health.org/meet-leo/
- Link Health benefits program: https://link-health.org/benefits-program/
- Link Health about page: https://link-health.org/about-us/
- Reboot Democracy on Link Health: https://rebootdemocracy.ai/blog/ai-equity-public-benefits
- mRelief Digital Government Hub profile: https://digitalgovernmenthub.org/publications/mrelief/
- Benefit Kitchen: https://benefitkitchen.com/
- Benefit Kitchen legal page: https://benefitkitchen.com/legal/
- Code for America Benefits Enrollment Field Guide: https://codeforamerica.org/explore/benefits-enrollment-field-guide/
- Beeck Center benefit eligibility rules report: https://beeckcenter.georgetown.edu/wp-content/uploads/2022/02/Benefit-Eligibility-Rules.pdf
- Single Stop screener: https://www.singlestop.org/screener-and-resources
- ACCESS NYC: https://access.nyc.gov/
- BenefitsCal: https://benefitscal.com/
- GetCalFresh: https://www.getcalfresh.org/en/
- Nava AI public benefits case study: https://www.navapbc.com/case-studies/ai-tools-public-benefits
