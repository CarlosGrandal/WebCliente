const positionStyles = {
  Portero: 'position-goalkeeper',
  Defensa: 'position-defender',
  Centrocampista: 'position-midfielder',
  Delantero: 'position-forward',
}

function formatBirthDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(year, month - 1, day))
}

function maskDni(dni) {
  return `${dni.slice(0, 2)}••••${dni.slice(-2)}`
}

export default function PlayerCard({ player }) {
  return (
    <article className="player-card">
      <div className="player-card-top">
        <span className="player-number" aria-label={`Dorsal ${player.dorsal}`}>{String(player.dorsal).padStart(2, '0')}</span>
        <span className={`position-tag ${positionStyles[player.posicion]}`}>{player.posicion}</span>
      </div>
      <h2>{player.nombre} {player.apellido}</h2>
      <dl className="player-details">
        <div><dt>DNI</dt><dd aria-label="DNI parcialmente oculto">{maskDni(player.dni)}</dd></div>
        <div><dt>Fecha de nacimiento</dt><dd>{formatBirthDate(player.fechaNacimiento)}</dd></div>
      </dl>
    </article>
  )
}