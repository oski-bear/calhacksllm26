import { useState } from 'react'
import BasicInfoForm from './screens/BasicInfoForm.jsx'
import Dashboard from './screens/Dashboard.jsx'
import ProgramDetail from './screens/ProgramDetail.jsx'
import AgentView from './screens/AgentView.jsx'
import { LoadingScreen, ErrorScreen } from './screens/StatusScreens.jsx'
import { fetchEligibility, saveProfile } from './api.js'

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

  // On submit, ask the backend which programs the user qualifies for.
  async function handleFormSubmit(info) {
    setUserInfo(info)
    setLoading(true)
    setError(null)
    try {
      await saveProfile(info) // persist the profile (keyed by email)
      const result = await fetchEligibility(info)
      setPrograms(result)
      setScreen('dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
      />
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
