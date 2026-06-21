import { useState } from 'react'
import BasicInfoForm from './screens/BasicInfoForm.jsx'
import Dashboard from './screens/Dashboard.jsx'
import ProgramDetail from './screens/ProgramDetail.jsx'
import AgentView from './screens/AgentView.jsx'
import { LoadingScreen, ErrorScreen } from './screens/StatusScreens.jsx'
import DocumentsSection from './screens/DocumentsSection.jsx'
import { fetchEligibility, saveProfile, fetchExplanations } from './api.js'

// The whole app is a simple "wizard". `screen` decides which page shows,
// and `userInfo` is the shared data we collect and carry between screens.
const emptyUserInfo = {
  name: '',
  email: '',
  income: '',
  maritalStatus: '',
  age: '',
  householdSize: '',
  state: 'CA',
  citizenship: '',
  education: '',
  filedTaxes: '',
  currentBenefits: [],
}

export default function App() {
  const [screen, setScreen] = useState('form')
  const [userInfo, setUserInfo] = useState(emptyUserInfo)
  const [programs, setPrograms] = useState([])
  const [selectedProgramId, setSelectedProgramId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState('') // Claude's friendly overall summary
  const [explaining, setExplaining] = useState(false) // loading personalized text

  // On submit, ask the backend which programs the user qualifies for.
  async function handleFormSubmit(info) {
    setUserInfo(info)
    setLoading(true)
    setError(null)
    setSummary('')
    try {
      await saveProfile(info) // persist the profile (keyed by email)
      const result = await fetchEligibility(info)
      setPrograms(result)
      setScreen('dashboard')
      loadExplanations(info) // enhance with Claude guidance in the background
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch Claude's personalized guidance and merge it into the programs.
  // This is an enhancement — if it fails (e.g. no API key), the dashboard
  // still shows the rule-based reasons.
  async function loadExplanations(info) {
    setExplaining(true)
    try {
      const { summary: text, explanations } = await fetchExplanations(info)
      setSummary(text || '')
      setPrograms((prev) =>
        prev.map((p) => ({
          ...p,
          personalized: explanations[p.id] || p.personalized,
        })),
      )
    } catch {
      // Ignore — personalized guidance is optional.
    } finally {
      setExplaining(false)
    }
  }

  function handleSelectProgram(programId) {
    setSelectedProgramId(programId)
    setScreen('program')
  }

  function handleStartAgent(programId) {
    setSelectedProgramId(programId)
    setScreen('agent')
  }

  const selectedProgram =
    programs.find((p) => p.id === selectedProgramId) || null

  if (loading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={error} onRetry={() => setError(null)} />
  }

  if (screen === 'dashboard') {
    return (
      <Dashboard
        userInfo={userInfo}
        programs={programs}
        summary={summary}
        explaining={explaining}
        onSelectProgram={handleSelectProgram}
        onEditProfile={() => setScreen('profile')}
      />
    )
  }

  // The profile page reuses the form, pre-filled with the saved info.
  // Saving runs the same path as the intake form (persist + re-check eligibility).
  if (screen === 'profile') {
    return (
      <BasicInfoForm
        initialValues={userInfo}
        onSubmit={handleFormSubmit}
        title="Your information"
        subtitle="Update your details anytime. We'll save your changes and refresh the programs you qualify for."
        submitLabel="Save changes"
        onBack={() => setScreen('dashboard')}
      >
        <DocumentsSection email={userInfo.email} />
      </BasicInfoForm>
    )
  }

  if (screen === 'program') {
    return (
      <ProgramDetail
        program={selectedProgram}
        onStartAgent={handleStartAgent}
        onBack={() => setScreen('dashboard')}
      />
    )
  }

  if (screen === 'agent') {
    return (
      <AgentView
        program={selectedProgram}
        userInfo={userInfo}
        onBack={() => setScreen('dashboard')}
      />
    )
  }

  return <BasicInfoForm initialValues={userInfo} onSubmit={handleFormSubmit} />
}
