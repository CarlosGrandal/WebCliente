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
        <header className="club-masthead">
          <img className="masthead-crest" src="/images/los-chavales-crest.png" alt="" />
          <span className="masthead-name">LOS CHAVALES <b>FC</b><small>CLUB DE FÚTBOL · MADRID</small></span>
          <span className="masthead-season">TEMPORADA <b>26 / 27</b></span>
        </header>
        {activePage === 'inscripcion' ? <RegistrationPage /> : <RosterPage />}
      </main>
    </div>
  )
}