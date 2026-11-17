export const formationRows = [
  {
    id: 'attack',
    className: 'pitch-row-attack',
    slots: [{ id: 'forward', name: 'Delantero', position: 'Delantero' }],
  },
  {
    id: 'midfield',
    className: 'pitch-row-midfield',
    slots: [1, 2, 3].map((number) => ({
      id: `midfielder-${number}`,
      name: `Medio ${number}`,
      position: 'Centrocampista',
    })),
  },
  {
    id: 'defence',
    className: 'pitch-row-defence',
    slots: [1, 2].map((number) => ({
      id: `defender-${number}`,
      name: `Defensa ${number}`,
      position: 'Defensa',
    })),
  },
  {
    id: 'goalkeeper',
    className: 'pitch-row-goalkeeper',
    slots: [{ id: 'goalkeeper', name: 'Portero', position: 'Portero' }],
  },
]

export const positionHeadings = {
  Portero: 'Porteros',
  Defensa: 'Defensas',
  Centrocampista: 'Centrocampistas',
  Delantero: 'Delanteros',
}

export default function FootballPitch({ players, activeSlotId, onSelectSlot }) {
  return (
    <section className="formation-section" aria-label="Formación de fútbol 7">
      <div className="formation-heading">
        <div>
          <p className="eyebrow">CAMPO LOCAL <span className="eyebrow-dot" /></p>
          <h2>Formación · fútbol 7</h2>
        </div>
        <span className="formation-caption">1 · 2 · 3 · 1</span>
      </div>

      <div className="football-pitch" role="group" aria-label="Selecciona un puesto para ver sus jugadores">
        <span className="pitch-marking pitch-marking-top" aria-hidden="true" />
        <span className="pitch-marking pitch-marking-bottom" aria-hidden="true" />
        <span className="pitch-center-line" aria-hidden="true" />
        {formationRows.map((row) => (
          <div className={`pitch-row ${row.className}`} key={row.id}>
            {row.slots.map((slot) => {
              const count = players.filter((player) => player.posicion === slot.position).length
              const isActive = activeSlotId === slot.id

              return (
                <button
                  className={`position-slot ${isActive ? 'position-slot-active' : ''}`}
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(isActive ? null : slot.id)}
                  aria-expanded={isActive}
                  aria-controls={isActive ? 'position-player-dropdown' : undefined}
                  aria-label={`${slot.name}: mostrar ${positionHeadings[slot.position].toLowerCase()}, ${count} ${count === 1 ? 'jugador' : 'jugadores'}`}
                >
                  <span className="slot-name">{slot.name}</span>
                  <span className="slot-count">{count} {count === 1 ? 'jugador' : 'jugadores'}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}