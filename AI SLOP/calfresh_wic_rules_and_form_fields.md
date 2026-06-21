# CalFresh And WIC Rules Plus Agent Intake Fields

Date researched: 2026-06-21

Purpose: define the exact rules and intake data our hackathon app should collect to screen for California CalFresh and California WIC, then draft application packets or review-only portal forms.

Important safety note: the app should never say "you definitely qualify." Use "likely eligible," "may qualify," "needs review," or "likely not eligible." County CalFresh workers and local WIC staff make the official determination.

## Recommended End-To-End Demo Scope

Build one shared intake that feeds two working benefit workflows:

1. CalFresh: eligibility receipt, document checklist, BenefitsCal-style application draft, review-only browser fill.
2. WIC: eligibility receipt, WIC appointment/application request draft, document checklist, review-only form fill.

Do not auto-submit real government applications in the demo. The safe winning demo is "drafted and ready for user review."

## Source Map

| Program | Primary Sources Used |
|---|---|
| CalFresh | CDSS CF 285 CalFresh application PDF, CDSS H.R.1 CalFresh FAQ, USDA/FNS SNAP eligibility page, SFHSA CalFresh eligibility page, Santa Clara County 2025-2026 CalFresh chart, BenefitsCal/GetCalFresh public pages |
| WIC | California WIC MyFamily pages, California WIC eligibility assessment, USDA/FNS WIC eligibility page, PHFE WIC first appointment/documents page, PHFE WIC apply page, SignUpWIC/WIC for You intake examples |

## CalFresh: Eligibility Rules

### Official Application Path

- California residents apply online through BenefitsCal or through their county social services office.
- GetCalFresh now primarily prepares users and sends them to BenefitsCal rather than accepting the application itself.
- A CalFresh application can begin with only name, address, and signature, but a complete application requires much more information and verification.
- Most applications are processed within 30 days.
- Expedited CalFresh may be available faster if the household meets emergency food criteria.

### Household Rule

For CalFresh, the "household" is not just everyone at the address.

Ask:

- Who lives with the applicant?
- Who buys and prepares food together?
- Who buys/prepares food separately?
- Are there spouses living together?
- Are there children under age 22 living with a parent?
- Is anyone age 60+ with a disability unable to buy/prepare meals separately?
- Does anyone get most meals from an institution, facility, communal dining site, shelter, or food program?

Implementation rule:

- Default household = people living together who regularly buy and prepare food together.
- Some people must be grouped together under SNAP rules even if they claim separate food purchasing/preparation, especially spouses and most children under 22 living with parents.
- For the hackathon, show "household grouping needs review" when the household has complex living arrangements.

### California Residency

- The applicant must apply in California for California CalFresh.
- Collect county, home address, mailing address, homelessness status, and whether they need help choosing a mailing address.

### Income Rules

CalFresh income is complex because California uses broad-based categorical eligibility for many households.

For a fast hackathon screen:

- Most non-assistance CalFresh households in California should be screened against the 200% Federal Poverty Level gross monthly income limit.
- Federal SNAP also has 130% gross and 100% net income tests; households with elderly/disabled members can have special rules.
- A household with an elderly or disabled member may have a higher pathway or only need to pass the net income test in certain cases.
- Benefit amount is based on net income after allowable deductions.

### CalFresh Income Limits Effective 2025-10-01 To 2026-09-30

Use this table for the demo rules engine.

| Household Size | Max Monthly Allotment | 130% Gross Limit | 100% Net Limit | 165% Elderly/Disabled Separate Household Gross | 200% CA MCE Gross Limit |
|---:|---:|---:|---:|---:|---:|
| 1 | $298 | $1,696 | $1,305 | $2,152 | $2,610 |
| 2 | $546 | $2,292 | $1,763 | $2,909 | $3,526 |
| 3 | $785 | $2,888 | $2,221 | $3,665 | $4,442 |
| 4 | $994 | $3,483 | $2,680 | $4,421 | $5,360 |
| 5 | $1,183 | $4,079 | $3,138 | $5,177 | $6,276 |
| 6 | $1,421 | $4,675 | $3,596 | $5,934 | $7,192 |
| 7 | $1,571 | $5,271 | $4,055 | $6,690 | $8,110 |
| 8 | $1,789 | $5,867 | $4,513 | $7,446 | $9,026 |
| Each additional member | +$218 | +$596 | +$459 | +$757 | +$918 |

### Income To Collect

Earned income:

- Wages
- Salary
- Tips
- Commissions
- Temporary/seasonal/training income
- Work-study income
- Self-employment gross income
- Self-employment business type and business start date
- Self-employment expense choice: 40% flat deduction or actual expenses

Unearned income:

- Social Security
- SSI/SSP
- Cash aid
- CalWORKs/TANF/GA/GR/CAPI
- Pension
- Child/spousal support received
- Government/railroad disability or retirement
- Veterans benefits or military pension
- Unemployment Insurance
- State Disability Insurance
- Workers compensation
- Financial aid, school grants, loans, scholarships
- Gifts of money
- Help with rent, food, or clothing
- Room and board from renters
- Lottery/gambling winnings
- Insurance or legal settlements
- Private disability or retirement
- Strike benefits
- Rental income
- Other recurring or one-time money

Income continuity:

- Whether each income source is expected to continue.
- If not continuing, explanation.
- Whether anyone lost a job, changed jobs, quit a job, or reduced work hours in the last 60 days.
- Whether anyone is on strike.

### Deductions And Expenses To Collect

The agent should collect these because they can increase benefit amount or affect eligibility:

- Rent or house payment
- Mortgage
- Property tax and insurance if billed separately
- Gas, electric, or fuel used for heating/cooling if billed separately
- Telephone/cell phone expense
- Water, sewage, garbage
- Homeless shelter expense
- Whether anyone outside the household helps pay these expenses
- Whether the household receives or expects LIHEAP
- Child care or dependent adult care needed for work, school, training, or job search
- Whether someone else helps pay child/adult care costs
- Legally obligated child support paid, including back child support
- Out-of-pocket medical expenses for elderly or disabled members

Allowable elderly/disabled medical expense categories from the CalFresh form:

- Medical or dental care
- Hospitalization, outpatient treatment, nursing care
- Prescribed medications
- Health insurance premiums
- Medicare premiums
- Dentures, hearing aids, prosthetics
- Attendant care due to age, illness, or infirmity
- Meals furnished to an attendant
- Prescribed over-the-counter medications
- Transportation and lodging for medical care
- Prescribed eyeglasses and contact lenses
- Prescribed medical supplies and equipment
- Service animal expenses
- Expected future medical expenses
- Reimbursements from Medi-Cal, insurance, family, or others

### Utility Rule Change To Capture

As of 2025-11-01, households without a member over 60 or with a disability generally need heating or cooling costs separate from housing costs to claim the Standard Utility Allowance. Households with a member over 60 or with a disability continue to have different treatment.

Implementation:

- Ask whether heating/cooling is paid separately from rent/mortgage.
- Ask whether any household member is age 60+ or disabled.
- Show "utility deduction may need county review" when uncertain.

### Resources / Assets

California often has no resource limit for most CalFresh households because of modified categorical eligibility, but the CF 285 application still asks about resources and certain edge cases still matter.

Collect:

- Cash on hand
- Checking accounts
- Savings accounts
- Safe deposit boxes
- Savings bonds
- Money market accounts
- Mutual funds
- Certificates of Deposit
- Stocks
- Bonds
- Other financial resources
- Whose name the resource is in
- Where the resource is held
- Value
- Whether it is a joint account
- Whether anyone sold, traded, gave away, or transferred a resource in the last 3 months

Use resources in the demo for:

- Expedited CalFresh tests
- Edge-case review
- Audit trail

### Expedited CalFresh Rules

Ask the expedited screen early because it is a strong demo moment.

A household may qualify for faster food benefits if:

- Monthly gross income is less than $150 and cash/checking/savings is $100 or less.
- Combined monthly gross income plus available liquid resources is less than monthly rent/mortgage plus utilities.
- Household is migrant/seasonal farm worker with liquid resources not exceeding $100 and income has stopped or will not exceed $25 in the next 10 days.

For the UI:

- Show "Potential expedited service" with exact facts used.
- Tell user county still determines final expedited status.

### Citizenship, Immigration, And SSN

Core rules to capture:

- Every person applying for CalFresh must provide an SSN if they have one, or proof they applied for one, unless an exception applies.
- Non-applicant household members do not have to provide SSN or immigration documents, but their income and relevant household information may still be needed.
- Parents or caretakers may apply for eligible children even if the adult is not eligible.
- CalFresh information about immigration is private and checked only for people applying for benefits.

H.R. 1 / 2026 immigration changes:

- CDSS says many lawfully present immigrant groups lost CalFresh eligibility beginning 2026-04-01.
- CDSS lists affected groups including asylees, refugees, most parolees, withheld removal, conditional entrants, trafficking victims, battered noncitizens, and certain Afghan/Iraqi/Ukrainian categories unless they fall into remaining eligible categories.

Implementation:

- Ask each household member whether they are applying.
- Only ask SSN/immigration fields for applying members.
- Include "prefer not to apply for this person" and "mixed-status household" paths.
- Avoid giving final immigration eligibility advice. Use "needs county review" for noncitizen statuses.

### Sponsored Noncitizen Rules

If an applying noncitizen is sponsored:

- Ask if sponsor signed I-864.
- If sponsor signed I-134, CF 285 says to skip the sponsor detail question.
- Collect sponsor name, phone, who is sponsored, and whether sponsor regularly helps with money, rent, clothes, food, or other support.

### Student Rules

CalFresh has special rules for students attending college or vocational school.

Collect:

- Whether any applying person attends college/vocational school.
- School/training name.
- Enrollment status: half-time or more, less than half-time.
- Number of units.
- Average work hours per week.
- Work-study eligibility/award/participation.
- Whether student works average 20 hours/week.
- Whether student cares for a child under age 12.
- Whether student receives CalWORKs.
- Whether student participates in an approved employment/training program.

For the demo:

- Do not fully adjudicate all student edge cases.
- If student is half-time or more and no exemption is obvious, mark "needs student eligibility review."

### Work And Community Engagement Rules

CDSS says new CalFresh work/community engagement requirements begin 2026-06-01 for some recipients.

Potentially subject if:

- Age 18-64.
- No disability.
- Not responsible for a dependent child under 14.
- Not otherwise excused.

Excuse categories CDSS lists include:

- Under 18 or over 64.
- Parent/responsible for dependent child under 14.
- Physical or mental health issue prevents 20 hours/week or 80 hours/month.
- Caring for a sick/injured/disabled person needing help more than 30 days.
- Getting or applying for disability benefits.
- Unable to work due to substance use condition, domestic violence, or chronic homelessness tied to health issue.
- Pregnant.
- Indian, Urban Indian, or California Indian under IHCIA.
- Participating at least half-time in an ORR training program.
- Going to school at least half-time, subject to student rules.
- Living in an ABAWD-waived area.

Qualifying activities include:

- Paid employment
- Volunteer work or community service
- Job training or work programs
- Education
- Workfare
- Combination of those activities

Collect:

- Age
- Disability/health limitation
- Pregnancy status
- Dependent child under 14
- Caregiving responsibilities
- Disability benefit receipt/application
- Substance use/domestic violence/chronic homelessness condition if user chooses to disclose
- Tribal/Indian status if user chooses to disclose
- ORR training participation
- School attendance
- County/area
- Current work/volunteer/training/education hours

### Foster Child Rule

If a foster child lives in the home:

- Ask whether the child was placed under a court dependency order.
- Ask if the household wants the foster child counted in the CalFresh case.
- If yes, foster care income is counted as unearned income.
- If no, foster care income is not counted as unearned income.

### Disqualification / Penalty Questions

CF 285 asks these, and an agent-filling workflow must capture them exactly:

- Has anyone been convicted of fraudulently receiving duplicate SNAP benefits in any state after 1996-09-22?
- Has anyone been convicted of trafficking SNAP/EBT benefits of $500 or more after 1996-09-22?
- Has anyone been found guilty of trading SNAP benefits for drugs after 1996-09-22?
- Has anyone been found guilty of trading SNAP benefits for firearms, ammunition, or explosives after 1996-09-22?
- Is anyone hiding/running from the law to avoid prosecution, custody, or jail for a felony or attempted felony?
- Has anyone been found by a court to be in violation of probation or parole?
- Has anyone recently quit a job without good reason?
- Is anyone on strike?

For the demo:

- Put these in a "sensitive legal questions" step with clear explanation.
- Use yes/no plus "who?" details where the form asks.

### Special Living/Food Arrangement Questions

Ask whether any applying person:

- Gets food from a food distribution program operated by a Native American reservation.
- Gets food from a communal dining facility for elderly/disabled people.
- Gets food from another food program.
- Lives in a group living arrangement for blind/disabled people.
- Lives in federally subsidized housing.
- Lives in a psychiatric hospital/mental institution.
- Lives in a hospital.
- Lives in long-term care or board-and-care.
- Lives in a homeless shelter.
- Lives in a shelter for battered women.
- Lives on a Native American reservation.
- Lives in a drug/alcohol rehabilitation center.
- Lives in a correctional/penal institution.
- Has an expected release date from an institution.

### CalFresh Required/Useful Documents

From BenefitsCal/CF 285 style guidance, collect document status for:

- Identity of applicant.
- SSNs or proof of SSN application for applying members.
- Immigration status documents for applying noncitizens.
- Proof of California residence/address.
- Earned income proof from last 30 days, such as pay stubs or employer statement.
- Self-employment income and expenses.
- Unearned income proof.
- Rent, mortgage, or shelter cost proof.
- Utility bills.
- Child/adult care costs.
- Child support paid.
- Medical expenses for elderly/disabled household members.
- Student status/work-study proof where relevant.
- Proof of job loss or reduced hours when relevant.
- Bank/resources information where relevant.
- Authorized representative identity if used.

## CalFresh: Agent Intake Schema

### Applicant And Contact

| Field | Required? | Notes |
|---|---:|---|
| legal_first_name | yes | Applicant name |
| legal_middle_name | no | |
| legal_last_name | yes | |
| other_names | no | Maiden/nicknames |
| date_of_birth | yes | |
| ssn | conditional | Required if applicant has one and is applying |
| homeless | yes | Impacts address/help |
| home_address_or_directions | yes unless homeless | |
| city | yes | |
| state | yes | Default CA |
| zip | yes | |
| mailing_address | no | If different |
| home_phone | no | |
| cell_phone | no | |
| text_permission | no | |
| work_or_message_phone | no | |
| email | no but useful | |
| preferred_written_language | no | |
| preferred_spoken_language | no | |
| interpreter_needed | derived | If not English |
| deaf_or_hard_of_hearing | no | Accommodation |
| disability_accommodation_needed | no | Optional |
| domestic_violence_history | no | Optional/sensitive |
| applying_for_medi_cal_too | no | CF 285 asks |

### Signature/Consent

| Field | Required? | Notes |
|---|---:|---|
| applicant_signature | yes for real submission | Review-only demo should not forge |
| signature_date | yes for real submission | |
| signer_role | yes | applicant/adult household member/authorized rep/guardian |
| understands_perjury_statement | yes | Present checkbox |
| understands_program_rules | yes | Present checkbox |
| contact_authorization | yes | User authorizes contact by phone/email/text/message |

### Expedited Screening

| Field | Required? | Notes |
|---|---:|---|
| gross_income_under_150 | yes | |
| cash_checking_savings_100_or_less | yes | |
| combined_income_resources | yes | Amount |
| monthly_rent_mortgage_utilities | yes | Amount |
| migrant_or_seasonal_farm_worker | yes | |
| liquid_resources_100_or_less | conditional | |
| income_stopped | conditional | |
| expected_income_next_10_days | conditional | Amount |

### Authorized Representative

| Field | Required? | Notes |
|---|---:|---|
| wants_case_authorized_rep | no | Helps with case/interview/forms/changes |
| case_rep_name | conditional | |
| case_rep_phone | conditional | |
| case_rep_street | conditional | |
| case_rep_city_state_zip | conditional | |
| wants_ebt_shopper_rep | no | Receives/spends benefits |
| shopper_rep_name | conditional | |
| shopper_rep_phone | conditional | |

### Interview Preference

| Field | Required? | Notes |
|---|---:|---|
| prefers_in_person_interview | no | Phone is default in many counties |
| needs_disability_interview_arrangement | no | |
| preferred_interview_day | no | today, next available, any day, weekday |
| preferred_interview_time | no | early morning, mid-morning, afternoon, late afternoon, anytime |

### Race/Ethnicity Optional Civil Rights Data

| Field | Required? | Notes |
|---|---:|---|
| declines_race_ethnicity | no | User can opt out |
| hispanic_or_latino | no | |
| hispanic_origin | no | Mexican, Puerto Rican, Cuban, other |
| race_categories | no | White, Black, American Indian/Alaska Native, Asian subgroups, Native Hawaiian/Pacific Islander subgroups, other/mixed |

### Prior Public Assistance

| Field | Required? | Notes |
|---|---:|---|
| household_ever_received_public_assistance | yes | TANF, Medicaid, SNAP/CalFresh, GA/GR, etc. |
| public_assistance_who | conditional | |
| public_assistance_county_state | conditional | |

### Household Member Table

Collect one row for every person in the home who buys/prepares food with the applicant, including the applicant.

| Field | Required? | Notes |
|---|---:|---|
| applying_for_benefits | yes | yes/no per person |
| last_name | yes | |
| first_name | yes | |
| middle_initial | no | |
| relationship_to_applicant | yes | |
| date_of_birth | yes | |
| gender | no | CF 285 uses M/F; app can be careful here |
| us_citizen_or_national | conditional | For applying people |
| ssn | conditional | Applying members if they have one |
| buys_prepares_food_with_household | yes | For our schema |
| elderly_60_plus | derived | From DOB |
| disabled | yes | Needed for deductions/work rules |
| pregnant | conditional | Work/WIC cross-benefit |
| dependent_child_under_14 | derived | Work rules |

Also collect:

- People living in home who do not buy/prepare food with applicant.
- Whether anyone has 10 years / 40 quarters work history or military service in the U.S.
- Whether anyone has, applied for, or plans to apply for T-Visa, U-Visa, or VAWA status.

### Noncitizen Table

For each noncitizen applying for benefits:

| Field | Required? | Notes |
|---|---:|---|
| name | yes | |
| date_of_entry_to_us | if known | |
| document_type | if known | Passport, alien registration, etc. |
| document_number | if known | |
| immigration_status_category | if known | LPR, CHE, refugee, asylee, etc. |
| sponsored | yes | |
| sponsor_followup_needed | derived | If sponsored |

### Sponsored Noncitizen Table

| Field | Required? | Notes |
|---|---:|---|
| sponsor_signed_i864 | conditional | If yes, complete rest |
| sponsor_signed_i134 | conditional | CF 285 says skip detailed sponsor question |
| sponsor_name | conditional | |
| sponsored_person | conditional | |
| sponsor_phone | conditional | |
| sponsor_money_help | conditional | yes/no and amount |
| sponsor_helps_rent | conditional | |
| sponsor_helps_clothes | conditional | |
| sponsor_helps_food | conditional | |
| sponsor_other_help | conditional | |

### Student Table

For each applying college/vocational student:

| Field | Required? | Notes |
|---|---:|---|
| person_name | yes | |
| school_or_training_name | yes | |
| enrollment_status | yes | half-time or more / less than half-time |
| number_of_units | no | |
| average_work_hours_per_week | yes | |
| eligible_for_work_study | no | Add for better screening |
| participates_in_work_study | no | |
| cares_for_child_under_12 | no | |
| receives_calworks | no | |
| employment_training_program | no | |

### Foster Child

| Field | Required? | Notes |
|---|---:|---|
| foster_child_in_home | yes | |
| foster_child_name | conditional | |
| dependency_order | conditional | |
| count_foster_child_in_calfresh_case | conditional | yes/no |
| foster_care_income_amount | conditional | If counted |

### Income Tables

For every unearned income source:

| Field | Required? |
|---|---:|
| person_getting_money | yes |
| source | yes |
| income_type | yes |
| amount | yes |
| frequency | yes |
| expected_to_continue | yes |
| if_not_continue_explanation | conditional |

For every job:

| Field | Required? |
|---|---:|
| person_working | yes |
| employer_name | yes |
| employer_address | yes |
| employer_phone | no |
| hourly_rate | no |
| average_hours_per_week | yes |
| pay_frequency | yes |
| total_gross_income_received_this_month | yes |
| expected_to_continue | yes |

For self-employment:

| Field | Required? |
|---|---:|
| person_self_employed | yes |
| business_start_date | no |
| business_type_and_name | yes |
| gross_monthly_income | yes |
| expense_method | yes |
| actual_expense_amount | conditional |

Job change/strike:

| Field | Required? |
|---|---:|
| job_loss_change_quit_reduced_hours_last_60_days | yes |
| who | conditional |
| date_of_change | conditional |
| date_of_last_pay | conditional |
| reason | conditional |
| anyone_on_strike | yes |
| strike_person | conditional |
| strike_date | conditional |
| strike_last_pay | conditional |
| strike_reason | conditional |

### Expense Tables

Child/adult care:

| Field | Required? |
|---|---:|
| pays_child_or_adult_care_for_work_school_training_job_search | yes |
| person_receiving_care | conditional |
| provider_name_address | conditional |
| amount_paid | conditional |
| frequency | conditional |
| anyone_helps_pay | conditional |
| helper_name | conditional |
| helper_amount | conditional |
| helper_frequency | conditional |

Child support:

| Field | Required? |
|---|---:|
| legally_obligated_child_support | yes |
| payer | conditional |
| child_names | conditional |
| amount_paid | conditional |
| frequency | conditional |

Housing/utilities:

| Field | Required? |
|---|---:|
| responsible_for_household_expenses | yes |
| rent_or_house_payment | conditional |
| property_tax_insurance_separate | conditional |
| heating_cooling_fuel_separate | conditional |
| telephone_cell_phone | conditional |
| homeless_shelter_expense | conditional |
| water_sewage_garbage | conditional |
| billed_frequency_each | conditional |
| outside_household_help | conditional |
| helper_name | conditional |
| helper_amount | conditional |
| helper_frequency | conditional |
| receives_or_expects_liheap | yes |

Medical expenses:

| Field | Required? |
|---|---:|
| elderly_or_disabled_member_with_out_of_pocket_medical | yes |
| person_name | conditional |
| expense_amount | conditional |
| frequency | conditional |
| expense_type | conditional |
| reimbursement_source | conditional |
| reimbursement_amount | conditional |

### Special Living/Food Sources

| Field | Required? |
|---|---:|
| gets_food_from_special_program | yes |
| food_program_type | conditional |
| who | conditional |
| where | conditional |
| lives_in_institution_or_facility | yes |
| facility_type | conditional |
| person_name | conditional |
| institution_name | conditional |
| expected_release_date | conditional |
| age60_disabled_unable_to_buy_prepare_separately | yes |
| who | conditional |

### Resources/Assets

| Field | Required? |
|---|---:|
| has_resources | yes |
| resource_type | conditional |
| owner_name | conditional |
| value | conditional |
| location_bank_company | conditional |
| joint_account | conditional |
| sold_traded_gave_away_transferred_resource_last_3_months | yes |
| transfer_who | conditional |
| transfer_details | conditional |

### Disqualification Questions

| Field | Required? |
|---|---:|
| duplicate_snap_fraud_conviction_after_1996_09_22 | yes |
| duplicate_snap_fraud_who | conditional |
| trafficking_500_or_more_after_1996_09_22 | yes |
| trafficking_who | conditional |
| traded_snap_for_drugs_after_1996_09_22 | yes |
| drugs_who | conditional |
| traded_snap_for_firearms_explosives_after_1996_09_22 | yes |
| firearms_who | conditional |
| fleeing_felony_prosecution_custody_jail | yes |
| fleeing_who | conditional |
| probation_or_parole_violation | yes |
| violation_who | conditional |

## WIC: Eligibility Rules

### Official Application Path

California WIC is run through local WIC offices/agencies. The statewide MyFamily WIC site provides eligibility screening and office search, and local agencies often provide phone, video, online, or in-person appointment/application request flows.

For the hackathon, the realistic "end-to-end" WIC flow is:

1. Screen for likely eligibility.
2. Find or choose a local WIC office from zip/county.
3. Draft a local WIC appointment/application request.
4. Generate the document checklist for the first appointment.
5. Stop for user review.

### WIC Eligibility Components

WIC has four major eligibility components:

1. Categorical eligibility.
2. California residency/local agency service area.
3. Income eligibility or adjunctive eligibility through another benefit.
4. Nutrition assessment/risk determination by WIC staff.

### Categorical Eligibility

A household may qualify if it includes at least one WIC-eligible person:

- Pregnant person.
- Breastfeeding/chestfeeding person with infant under 12 months.
- Person who just had a baby or had a recent pregnancy loss in the last 6 months.
- Infant.
- Child under age 5.
- Foster child under age 5.
- Parent, father, grandparent, foster parent, guardian, or caretaker applying for an eligible child.
- Person transferring WIC benefits from another state.

Implementation:

- WIC is much more person-specific than CalFresh.
- Collect one WIC participant profile for each pregnant/postpartum/breastfeeding person, infant, or child under 5.

### California Residency

- Applicant/participant must live in California to receive California WIC.
- The user should be routed to the local WIC office serving their location.
- SignUpWIC also asks current state and may route pre-applications based on location.

Collect:

- Address.
- City.
- County.
- Zip code.
- Preferred WIC office if known.
- Whether user plans to move to California or already lives in California.

### Income Eligibility

WIC uses gross income before taxes/deductions.

A family may be income-eligible if:

- Household gross income is at or below the WIC limit.
- OR the household/person receives Medi-Cal/Medicaid, CalFresh/SNAP, CalWORKs/TANF, or FDPIR.

Other rules:

- WIC income limit is 185% of the Federal Poverty Level.
- Foster children are counted as a family of one.
- A pregnant applicant may count unborn embryo/fetus(es) in household size if needed to meet income eligibility, but they should not be automatically counted without offering the option.
- WIC staff make the official eligibility determination.

### WIC Income Limits Effective 2026-05-01 To 2027-06-30

| Household Size | Annual | Monthly | Twice-Monthly | Bi-Weekly | Weekly |
|---:|---:|---:|---:|---:|---:|
| 1 | $29,526 | $2,461 | $1,231 | $1,136 | $568 |
| 2 | $40,034 | $3,337 | $1,669 | $1,540 | $770 |
| 3 | $50,542 | $4,212 | $2,106 | $1,944 | $972 |
| 4 | $61,050 | $5,088 | $2,544 | $2,349 | $1,175 |
| 5 | $71,558 | $5,964 | $2,982 | $2,753 | $1,377 |
| 6 | $82,066 | $6,839 | $3,420 | $3,157 | $1,579 |
| 7 | $92,574 | $7,715 | $3,858 | $3,561 | $1,781 |
| 8 | $103,082 | $8,591 | $4,296 | $3,965 | $1,983 |
| 9 | $113,590 | $9,467 | $4,743 | $4,370 | $2,186 |
| Each additional member | +$10,508 | +$876 | +$438 | +$405 | +$203 |

### WIC Income To Count

USDA WIC guidance lists income before deductions/taxes including:

- Wages and tips.
- Social Security.
- Child support and alimony.
- Unemployment benefits.
- Workers compensation.
- Retirement payments.
- Disability benefits.
- Other household cash income.

Do not include:

- Loans.
- AmeriCorps.
- Certain military income.
- Non-cash assistance.

Military income exclusions listed by USDA include:

- Basic Allowance for Housing.
- Combat pay.
- Family Subsistence Supplemental Allowance.
- Filipino Veterans Equity Compensation Fund.
- Outside Continental U.S. Cost of Living Allowance.
- Overseas Housing Allowance.
- Other location-specific military exclusions may apply.

### WIC Nutrition Assessment

All applicants must receive a health/nutrition assessment by WIC staff before enrollment. This is a key difference from CalFresh.

Collect for prefill, but do not claim final WIC approval:

- Participant category.
- Pregnancy/postpartum/breastfeeding status.
- Expected due date or pregnancy end date.
- Infant/child age.
- Height/weight if known.
- Health care provider name/contact if known.
- Medical referral form if available.
- Formula needs if infant.
- Breastfeeding/chestfeeding needs.
- Allergies/dietary concerns if known.
- Immunization record for infants/children if available.

### WIC Documents To Collect

California WIC/MyFamily and PHFE WIC list these first appointment documents:

- Identification for applicant and any children under 5.
- Proof of California address/residency.
- Proof of household income.
- Proof of pregnancy if applicable.
- Medical forms from health care provider if applicable.
- Active Medi-Cal card can be used as proof of income in some cases.
- WIC staff may ask the infant/child enrolling to be present.

Examples of income proof:

- Paystub or statement from last 30 days.
- Disability pay.
- Unemployment benefits.
- Social Security benefits.
- Tax return if self-employed.
- Letter from employer.
- Active Medi-Cal card.
- Proof of CalFresh/CalWORKs where accepted.

Examples of residency proof:

- Active Medi-Cal number.
- Mail.
- Bill.
- Driver's license or ID.
- Bank statement.
- Car registration/insurance.
- Rent document.
- Utility bill.
- Paycheck with address.

Examples of identification:

- Active Medi-Cal number.
- Health insurance card.
- Birth certificate.
- Newborn crib card.
- Driver's license or ID.
- Car registration.
- Medical record.
- Immunization card.
- Foster child letter/placement.

Examples of pregnancy proof:

- Positive pregnancy note from doctor.
- Ultrasound picture.
- Prenatal vitamin prescription.
- Medical referral form.

If documents are missing:

- PHFE WIC says users should tell the WIC counselor; after enrollment, users may have 30 days to provide requested documents, and a sworn statement may be accepted as a last resort.

### Immigration / Public Charge Note

SignUpWIC says immigrants can get WIC and signing up will not affect immigration status. Do not ask for citizenship/immigration status for WIC eligibility unless a specific local agency form asks for it.

Implementation:

- Do not require SSN for WIC.
- Do not require citizenship status for WIC.
- Include optional preferred language.
- Include a privacy/trust note.

## WIC: Agent Intake Schema

### WIC Appointment/Application Request Fields

These fields are enough to fill many local WIC "apply/request appointment" forms, including WIC for You style forms.

| Field | Required? | Notes |
|---|---:|---|
| lives_in_california | yes | yes/no |
| county | yes | Needed for local agency routing |
| lives_in_service_area | conditional | Some local forms ask county-specific |
| action_requested | yes | apply for WIC, change appointment, forgot appointment, other |
| first_name | yes | |
| last_name | yes | |
| phone_number | yes | |
| text_permission | yes | yes/no |
| address_line_1 | no but useful | Some local forms ask |
| city | no but useful | |
| state | no but useful | CA |
| zip | no but useful | |
| best_contact_method | yes | call/text |
| best_contact_time | yes | morning/afternoon/etc. |
| preferred_language | no | |
| email | no | |
| additional_comments | no | |
| local_wic_office_preference | no | |

### WIC Household Screen

| Field | Required? | Notes |
|---|---:|---|
| household_size | yes | Everyone sharing income/expenses |
| pregnant_person_count | conditional | For household size option |
| expected_birth_count | conditional | Count unborn only if needed/offered |
| foster_child_count | conditional | Each foster child may be family of one |
| gross_income_amount | conditional | Not needed if adjunctively eligible |
| gross_income_frequency | conditional | annual/monthly/twice-monthly/biweekly/weekly |
| income_sources | conditional | wages, disability, unemployment, Social Security, etc. |
| receives_medi_cal | yes | Adjunctive income eligibility |
| receives_calfresh | yes | Adjunctive income eligibility |
| receives_calworks | yes | Adjunctive income eligibility |
| receives_fdpir | yes | Adjunctive income eligibility |
| no_income | no | WIC counselor can handle |

### WIC Participant Table

Create one participant row for each person who may get WIC benefits.

| Field | Required? | Notes |
|---|---:|---|
| participant_first_name | yes | |
| participant_last_name | yes | |
| date_of_birth | yes for child/infant | |
| relationship_to_applicant | yes | self, child, foster child, grandchild, etc. |
| category | yes | pregnant, breastfeeding, postpartum, infant, child under 5 |
| pregnant | conditional | |
| expected_due_date | conditional | |
| recent_pregnancy_end_date | conditional | Birth/loss within last 6 months |
| breastfeeding_or_chestfeeding | conditional | |
| infant_under_12_months | conditional | |
| child_under_5 | conditional | |
| foster_child | conditional | |
| transferring_wic_from_another_state | no | |
| current_wic_state | conditional | |
| health_insurance_or_medi_cal_number | no | Useful ID/proof |
| immunization_record_available | no | |
| medical_provider_name | no | |
| medical_provider_phone | no | |

### WIC Document Checklist Fields

For each document type, collect status and file/reference.

| Document Field | Required? |
|---|---:|
| applicant_id_document | yes for appointment |
| child_id_document_each_child | yes for enrolling children |
| proof_of_address_document | yes |
| proof_of_income_document | conditional |
| medi_cal_card_or_number | conditional |
| calfresh_or_calworks_proof | conditional |
| proof_of_pregnancy | conditional |
| medical_referral_form | conditional |
| infant_child_immunization_record | helpful |
| foster_child_placement_letter | conditional |
| no_document_explanation | conditional |

### WIC Nutrition/Health Pre-Assessment Fields

These are not usually enough for final enrollment, but they help an agent prepare the family.

| Field | Required? | Notes |
|---|---:|---|
| participant_height | no | WIC may measure |
| participant_weight | no | WIC may measure |
| pregnancy_risk_notes | no | |
| breastfeeding_support_needed | no | |
| formula_needed | no | |
| current_formula_brand_type | no | If infant |
| food_allergies | no | |
| special_dietary_needs | no | |
| nutrition_concerns | no | |
| substance_use_resources_needed | no | Sensitive/optional |
| referrals_needed | no | health care, dental, housing, etc. |

## Shared Intake Fields For Both Programs

Use this as the first app screen.

| Field | Why |
|---|---|
| Applicant legal name | CalFresh + WIC forms |
| Date of birth | Household, WIC categories, CalFresh age/work rules |
| Email | Profile/account/contact |
| Phone | County/WIC contact |
| SMS permission | Contact preference |
| Address/city/zip/county | Residency, local office routing, shelter costs |
| Homelessness status | CalFresh address and expedited/support rules |
| Preferred language | Interpreter/UI |
| Household members | Both programs |
| Buy/prepare food together | CalFresh household |
| Pregnancy/postpartum/breastfeeding/children under 5 | WIC |
| Children under 14 | CalFresh work rule exemption |
| Gross income and frequency | Both programs |
| Current benefits | WIC adjunctive eligibility, CalFresh context |
| Disability/age 60+ | CalFresh deductions/work/utility/resource pathways |
| Rent/mortgage/utilities | CalFresh deductions/expedited |
| Child/dependent care | CalFresh deduction |
| Child support paid | CalFresh deduction |
| Medical expenses for 60+/disabled | CalFresh deduction |
| Documents uploaded/available | Both programs |

## Recommended Product Behavior

### Eligibility Receipt Format

For every result, show:

- Program.
- Status: likely eligible, may qualify, likely not eligible, needs review.
- User facts used.
- Rule matched.
- Source link.
- Missing information.
- Required documents.
- Next action.

### CalFresh Demo Flow

1. Intake household.
2. Run 200% CA gross income screen and WIC adjunctive cross-check.
3. Run expedited screen.
4. Run deduction/document checklist.
5. Generate CalFresh application packet sections from CF 285.
6. Open mock BenefitsCal portal.
7. Agent fills fields.
8. Stop at review screen with "User must submit."

### WIC Demo Flow

1. Reuse shared intake.
2. Identify WIC-eligible participants.
3. Check adjunctive eligibility or WIC gross income table.
4. Generate WIC appointment/application request.
5. Generate first-appointment document checklist.
6. Open mock/local WIC request form.
7. Agent fills fields.
8. Stop at review screen with "WIC office will verify eligibility."

## Implementation Notes For Current Repo

Current backend gaps:

- `backend/programs.py` uses rough annual FPL math and should be replaced with the exact 2025-10-01 to 2026-09-30 CalFresh monthly table above.
- CalFresh current estimate "Up to $291 / month" is stale; 2025-2026 max for 1 person is $298.
- WIC is not currently in `PROGRAMS`; add it.
- Eligibility should return citations/source labels per rule.
- Use "review-only draft fill," not "submitted."

Suggested backend rule shape:

```json
{
  "program": "calfresh",
  "status": "likely_eligible",
  "facts_used": [
    {"field": "household_size", "value": 3},
    {"field": "gross_monthly_income", "value": 2400}
  ],
  "rules_matched": [
    {
      "rule_id": "calfresh_ca_mce_200_fpl_2025_2026",
      "source": "Santa Clara County CalFresh Program Monthly Allotment and Income Eligibility Standards Charts",
      "explanation": "For household size 3, 200% gross monthly limit is $4,442."
    }
  ],
  "missing_info": [],
  "documents_needed": ["identity", "income_proof", "residency"]
}
```

## Source URLs

- CalFresh CF 285 PDF: https://cdss.ca.gov/Portals/9/Additional-Resources/Forms-and-Brochures/2020/A-D/CF285.pdf?ver=2023-03-08-155331-893
- CalFresh SAWS 2 PLUS PDF: https://www.cdss.ca.gov/cdssweb/entres/forms/English/SAWS2_PLUS.pdf
- CDSS H.R.1 CalFresh FAQ: https://www.cdss.ca.gov/benefits-services/food-nutrition-services/calfresh/frequently-asked-questions
- USDA/FNS SNAP eligibility: https://www.fns.usda.gov/snap/recipient/eligibility
- Santa Clara County CalFresh 2025-2026 chart: https://stgenssa.sccgov.org/debs/program_handbooks/charts/assets/2CalFresh/CFMonthAllIncomeElig.htm
- SFHSA CalFresh eligibility: https://www.sfhsa.org/services/food/calfresh/applying-calfresh/checking-your-eligibility
- GetCalFresh: https://www.getcalfresh.org/en/
- California WIC How Can I Get WIC: https://www.myfamily.wic.ca.gov/Home/HowCanIGetWIC
- California WIC Am I Eligible: https://www.myfamily.wic.ca.gov/Home/AmIEligible
- USDA/FNS WIC eligibility: https://www.fns.usda.gov/wic/eligibility
- PHFE WIC first appointment/documents: https://www.phfewic.org/en/first-wic-appointment/
- PHFE WIC apply: https://www.phfewic.org/en/how-wic-works/apply-for-wic/
- SignUpWIC: https://signupwic.com/
- WIC for You local appointment form example: https://wicforyou.org/apply-today/
