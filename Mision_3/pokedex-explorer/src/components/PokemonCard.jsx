import { useState } from 'react';

const statLabels = [
  ['hp', 'PS'],
  ['attack', 'Ataque'],
  ['defense', 'Defensa'],
  ['speed', 'Velocidad'],
];

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const firstType = pokemon.types[0];
  const [imageFailed, setImageFailed] = useState(false);
  const pokemonId = pokemon.id ?? pokemon.name;

  return (
    <article className="pokemon-card">
      <div className={`pokemon-picture${firstType ? ` tone-${firstType}` : ''}`}>
        <span className="card-orbit orbit-a" />
        <span className="card-orbit orbit-b" />
        <button
          className={`favorite-toggle${isFavorite ? ' is-favorite' : ''}`}
          type="button"
          aria-label={isFavorite ? `Quitar a ${pokemon.name} de favoritos` : `Añadir a ${pokemon.name} a favoritos`}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(pokemonId)}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        {pokemon.image && !imageFailed ? (
          <img
            src={pokemon.image}
            alt={pokemon.name ? `Ilustración de ${pokemon.name}` : 'Ilustración de Pokémon'}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <>
            <span className="image-placeholder">✳</span>
            <small className="image-placeholder-label">Imagen no disponible</small>
          </>
        )}
      </div>

      <div className="pokemon-identity">
        <span className="pokemon-number">
          {pokemon.id === null ? 'N.º —' : `N.º ${String(pokemon.id).padStart(3, '0')}`}
        </span>
        <h4 className="pokemon-name">{pokemon.name || 'Nombre no disponible'}</h4>
      </div>

      <div className="type-list">
        {pokemon.types.length > 0
          ? pokemon.types.map((type) => <span key={type} className={`type-badge type-${type}`}>{type}</span>)
          : <span className="type-badge type-unknown">Tipo no disponible</span>}
      </div>

      <p className="dimensions">
        ALTURA {pokemon.heightCm === null ? '—' : `${pokemon.heightCm} cm`}  ·  PESO {pokemon.weightKg === null ? '—' : `${pokemon.weightKg} kg`}
      </p>
      <dl className="card-stats">
        {statLabels.map(([key, label]) => (
          <div className="stat-item" key={key}>
            <dt>{label}</dt>
            <dd>{pokemon.stats[key] ?? '—'}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
