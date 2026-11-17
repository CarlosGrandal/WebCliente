import PlayerCard from './PlayerCard.jsx'
import { positionHeadings } from './FootballPitch.jsx'

export default function PositionPlayerDropdown({ activeSlot, players, onClose }) {
  const positionPlayers = players.filter((player) => player.posicion === activeSlot.position)

  return (
    <section className="position-player-dropdown" id="position-player-dropdown" aria-live="polite">
      <header className="position-dropdown-heading">
        <div>
          <p className="eyebrow">{activeSlot.name.toUpperCase()}</p>
          <h3>{positionHeadings[activeSlot.position]}</h3>
        </div>
        <button className="close-dropdown" type="button" onClick={onClose} aria-label="Cerrar jugadores de esta posición">×</button>
      </header>
      {positionPlayers.length > 0 ? (
        <div className="position-player-list">
          {positionPlayers.map((player) => <PlayerCard key={player.id} player={player} showDni={false} />)}
        </div>
      ) : (
        <p className="position-empty">No hay jugadores inscritos para esta posición</p>
      )}
    </section>
  )
}