import PlayerCard from '../components/PlayerCard.jsx'
import { usePlayers } from '../hooks/usePlayers.js'

export default function RosterPage() {
  const { data: players = [], isPending, isError, error, refetch, isFetching } = usePlayers()

  return (
    <div className="page-wrap roster-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">TEMPORADA 2026 / 27 <span className="eyebrow-dot" /></p>
          <h1>La plantilla</h1>
          <p className="page-intro">El equipo se construye con cada nuevo jugador.</p>
        </div>
        {!isPending && !isError && players.length > 0 && (
          <div className="season-badge">{players.length} {players.length === 1 ? 'JUGADOR' : 'JUGADORES'}</div>
        )}
      </header>

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

      {!isPending && !isError && players.length === 0 && (
        <section className="roster-state roster-empty">
          <div className="roster-ball" aria-hidden="true">⚽</div>
          <p className="eyebrow">NUEVO CURSO, NUEVO EQUIPO</p>
          <h2>Estamos preparando el once.</h2>
          <p>Cuando se inscriban los primeros jugadores, aparecerán aquí.</p>
        </section>
      )}

      {!isPending && !isError && players.length > 0 && (
        <section className="player-grid" aria-label="Jugadores inscritos">
          {players.map((player) => <PlayerCard key={player.id} player={player} />)}
        </section>
      )}
    </div>
  )
}