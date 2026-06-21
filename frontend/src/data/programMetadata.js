export const PROGRAM_METADATA = {
  calfresh: {
    logoText: 'CalFresh',
    logoSubtext: 'SNAP',
    logoSrc: '/program-logos/calfresh-food.svg',
    logoAlt: 'CalFresh Food logo',
    logoPadding: 0.25,
    brandColor: '#2f80d1',
    brandBg: '#e8f2fc',
    applyUrl: 'https://benefitscal.com/Public/login?lang=en',
    applyLabel: 'Apply on BenefitsCal',
    rulesUrl: 'https://www.cdss.ca.gov/cdssweb/entres/forms/English/SAWS2_PLUS.pdf',
    rulesLabel: 'Eligibility + proof PDF',
    infoTitle: 'CalFresh at a glance',
    info: 'California food benefits on an EBT card. County workers make the final decision after reviewing household, income, identity, residency, expenses, and interview details.',
  },
  wic: {
    logoText: 'WIC',
    logoSubtext: 'CA',
    logoSrc: '/program-logos/california-wic-trimmed.png',
    logoAlt: 'California WIC logo',
    logoPadding: 0.3,
    brandColor: '#8f399b',
    brandBg: '#f5e9f7',
    applyUrl: 'https://www.myfamily.wic.ca.gov/Home/HowCanIGetWIC',
    applyLabel: 'How to get WIC',
    rulesUrl: 'https://www.cdph.ca.gov/Programs/CFH/DWICSN/CDPH%20Document%20Library/LocalAgencies/WPPM/980-1060WICIncomeGuidelinesTable.pdf',
    rulesLabel: 'Income rules PDF',
    infoTitle: 'WIC at a glance',
    info: 'Nutrition benefits and support for pregnant people, postpartum parents, infants, and children under 5. Local WIC staff confirm eligibility at the appointment.',
  },
}

export function programMeta(programId) {
  return PROGRAM_METADATA[programId] || null
}
