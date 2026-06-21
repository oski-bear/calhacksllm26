import { demoProfile } from '../frontend/src/data/demoProfile.js'

const first = demoProfile()
const second = demoProfile()

if (first.email === second.email) {
  throw new Error(`Demo profile emails collided: ${first.email}`)
}

if (!first.demoMode || !second.demoMode) {
  throw new Error('Demo profiles must keep demoMode enabled.')
}

if (!first.email.startsWith('oski.demo+') || !first.email.endsWith('@example.com')) {
  throw new Error(`Unexpected demo email format: ${first.email}`)
}

console.log('Demo profile verification passed')
