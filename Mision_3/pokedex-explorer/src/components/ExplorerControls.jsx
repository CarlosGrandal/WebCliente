export default function ExplorerControls({
  search,
  onSearchChange,
  searchRef,
  type,
  types,
  onTypeChange,
  sort,
  onSortChange,
}) {
  return (
    <div className="control-panel">
      <div className="toolbar">
        <label className="search-field" htmlFor="pokemon-search">
          <span className="control-icon" aria-hidden="true">⌕</span>
          <span className="visually-hidden">Buscar Pokémon por nombre</span>
          <input
            ref={searchRef}
            id="pokemon-search"
            type="search"
            placeholder="Busca un Pokémon…"
            autoComplete="off"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <kbd aria-hidden="true">⌘ K</kbd>
        </label>
        <label className="select-field" htmlFor="type-filter">
          <span className="select-label">TIPO</span>
          <select id="type-filter" value={type} onChange={(event) => onTypeChange(event.target.value)}>
            <option value="">Todos los tipos</option>
            {types.map((availableType) => <option value={availableType} key={availableType}>{availableType}</option>)}
          </select>
        </label>
        <label className="select-field sort-field" htmlFor="sort-order">
          <span className="select-label">ORDENAR</span>
          <select id="sort-order" value={sort} onChange={(event) => onSortChange(event.target.value)}>
            <option value="id">Número Pokédex</option>
            <option value="name">Nombre A–Z</option>
          </select>
        </label>
      </div>
      <p className="scope-note"><span aria-hidden="true">ⓘ</span> La búsqueda, el filtro y el orden se aplican a los Pokémon cargados hasta ahora.</p>
    </div>
  );
}
