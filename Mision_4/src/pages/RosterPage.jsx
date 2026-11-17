import { useState } from 'react'
import FootballPitch, { formationRows } from '../components/FootballPitch.jsx'
import PositionPlayerDropdown from '../components/PositionPlayerDropdown.jsx'
import { usePlayers } from '../hooks/usePlayers.js'

export default function RosterPage() {
  const { data: players = [], isPending, isError, error, refetch, isFetching } = usePlayers()
  const [activeSlotId, setActiveSlotId] = useState(null)
  const activeSlot = formationRows.flatMap((row) => row.slots).find((slot) => slot.id === activeSlotId)

  return (
    <div className="page-wrap roster-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">TEMPORADA 2026 / 27 <span className="eyebrow-dot" /></p>
          <h1>La plantilla</h1>
          <p className="page-intro">Pulsa un puesto del campo para ver a los jugadores inscritos en esa posición.</p>
        </div>
        {!isPending && !isError && (
          <div className="season-badge">{players.length} {players.length === 1 ? 'JUGADOR' : 'JUGADORES'}</div>
        )}
      </header>

      <div className="roster-formation-layout">
        <div className="roster-field-column">
          {isPending && (
            <section className="roster-state" role="status" aria-live="polite">
              <span className="loading-spinner" aria-hidden="true" />
              <h2>Cargando plantilla…</h2>
              <p>Estamos consultando los datos del equipo.</p>
            </section>
          )}

          {isError && (
            <section className="roster-state roster-state-error" role="alert">
              <span className="roster-state-icon" aria-hidden="true">!</span>
              <h2>No se pudo cargar la plantilla</h2>
              <p>{error.message}</p>
              <button className="retry-button" type="button" onClick={() => refetch()} disabled={isFetching}>
                {isFetching ? 'Reintentando…' : 'Reintentar'}
              </button>
            </section>
          )}

          {!isPending && !isError && (
            <>
              {players.length === 0 && (
                <section className="roster-empty-banner" role="status">
                  <img src="/images/los-chavales-crest.png" alt="" />
                  <p>No hay jugadores inscritos</p>
                </section>
              )}
              <FootballPitch players={players} activeSlotId={activeSlotId} onSelectSlot={setActiveSlotId} />
            </>
          )}
        </div>

        <div className="roster-side-column">
          {!isPending && !isError && activeSlot && (
            <PositionPlayerDropdown activeSlot={activeSlot} players={players} onClose={() => setActiveSlotId(null)} />
          )}
          <aside className="coach-bench" aria-label="Banquillo del entrenador">
            <p className="bench-title">BANQUILLO</p>
            <div className="bench-shelter">
              <span className="bench-roof" aria-hidden="true" />
              <div className="bench-backrest" aria-hidden="true" />
              <div className="bench-seat">
                <img src="/images/los-chavales-crest.png" alt="" />
                <div><span>ENTRENADOR</span><strong>David Julian</strong></div>
              </div>
              <div className="bench-base" aria-hidden="true" />
            </div>
            <div className="bench-supports" aria-hidden="true"><span /><span /></div>
          </aside>
        </div>
      </div>
    </div>
  )
}