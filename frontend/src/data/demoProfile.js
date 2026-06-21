export function demoProfile() {
  return {
    name: 'Oski Bear',
    email: 'oski@example.com',
    phone: '(510) 555-0148',
    address: '2120 Dwight Way',
    city: 'Berkeley',
    zipcode: '94704',
    county: 'Alameda',
    state: 'CA',
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
