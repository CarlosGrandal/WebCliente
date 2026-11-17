import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RegistrationPage from './pages/RegistrationPage.jsx'
import RosterPage from './pages/RosterPage.jsx'

export default function App() {
  const [activePage, setActivePage] = useState('inscripcion')

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="main-content">
        {activePage === 'inscripcion' ? <RegistrationPage /> : <RosterPage />}
      </main>
    </div>
  )
}
