export function demoProfile() {
  const suffix = demoEmailSuffix()
  return {
    name: 'Oski Bear',
    email: `oski.demo+${suffix}@example.com`,
    phone: '(510) 555-0148',
    address: '2120 Dwight Way',
    city: 'Berkeley',
    zipcode: '94704',
    county: 'Alameda',
    state: 'CA',
    demoMode: true,
    citizenship: 'U.S. Citizen',
    assets: '250',
    currentBenefits: ['Medi-Cal'],
    immediateNeeds: ['Food', 'Baby supplies'],
    members: [
      {
        id: 'demo-self',
        isPrimary: true,
        relationship: 'Self',
        birthMonth: 4,
        birthYear: '2001',
        incomeSources: [
          {
            id: 'demo-income',
            category: 'earned',
            type: 'Wages / salary',
            frequency: 'monthly',
            hoursPerWeek: '',
            amount: '2000',
          },
        ],
        healthInsurance: ['Medi-Cal (Medicaid)'],
        conditions: ['Pregnant'],
        student: null,
      },
      {
        id: 'demo-child',
        isPrimary: false,
        relationship: 'Child',
        birthMonth: 8,
        birthYear: '2024',
        incomeSources: [],
        healthInsurance: ['Medi-Cal (Medicaid)'],
        conditions: [],
        student: null,
      },
    ],
    expenses: [
      { id: 'demo-rent', type: 'Rent', amount: '1200', frequency: 'monthly' },
      {
        id: 'demo-utilities',
        type: 'Utilities (gas, electric, water)',
        amount: '180',
        frequency: 'monthly',
      },
    ],
  }
}

function demoEmailSuffix() {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '')
  const random =
    globalThis.crypto?.randomUUID?.().slice(0, 8) ||
    Math.random().toString(36).slice(2, 10)
  return `${timestamp}-${random}`
}
