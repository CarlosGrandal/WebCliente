# PokéDex Explorer

PokéDex Explorer es una guía web para descubrir Pokémon mediante tarjetas con ilustración, número de Pokédex, tipos, medidas y estadísticas base. Permite buscar por nombre o número, filtrar por tipo, ordenar por número o nombre y ampliar la colección con carga incremental. Los indicadores resumen los Pokémon descargados en esta sesión; búsqueda y filtros no consultan todo el catálogo.

## Tecnologías

- **HTML y CSS**: estructura semántica, controles accesibles y diseño adaptable a móvil y escritorio.
- **JavaScript moderno con módulos ES**: mantiene separadas las peticiones, reglas de datos, caché, renderizado y coordinación de eventos, sin añadir un framework de interfaz.
- **Vite**: servidor local de desarrollo y compilador para producción.
- **PokéAPI**: API pública que proporciona listados y detalles de Pokémon.
- **Node.js `node:test`**: pruebas integradas, sin dependencias de testing adicionales.

## Requisitos e instalación

Se requiere Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Vite imprime la URL local del servidor. Para generar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

Ejecuta las pruebas automatizadas con:

```bash
npm test
```

## Estructura del proyecto

```text
index.html
src/
  api/
    pokemonApi.js       Peticiones HTTP, validación y solicitudes compartidas
    pokemonCache.js     Caché localStorage, TTL e invalidación
  logic/
    pokemonLogic.js     Normalización, filtros, orden y estadísticas
  ui/
    render.js           Creación y actualización segura del DOM
  styles/
    main.css            Estilos responsive y estados visuales
  main.js               Estado de la aplicación, eventos y coordinación
test/
  pokemonApi.test.js    Caché, API y casos de error
  pokemonLogic.test.js  Transformaciones, filtros y agregados
public/                 Recursos estáticos servidos por Vite
```

## API y flujo de datos

La aplicación usa la API pública `https://pokeapi.co/api/v2/` sin clave:

- `GET /pokemon?limit=12&offset=0` obtiene una página de referencias.
- `GET /pokemon/{id-o-nombre}/` obtiene los detalles usados en las tarjetas.

`pokemonApi.js` usa `fetch` con `async/await`, comprueba `response.ok` y valida el JSON y los campos requeridos. `main.js` coordina las peticiones de detalle, comunica carga y errores a la interfaz y permite reintentar. Una página se incorpora solo cuando todas sus peticiones de detalle han terminado correctamente; así se evita presentar resultados parciales como una página completa. La carga incremental conserva las tarjetas anteriores y evita duplicados.

`pokemonLogic.js` transforma los detalles con `map`, filtra por nombre, número y tipo con `filter`, y calcula con `reduce` la media del total de estadísticas base disponibles por Pokémon. Estos filtros y estadísticas abarcan únicamente los Pokémon cargados.

Los errores de red, HTTP, JSON inválido y respuestas incompletas se propagan desde la API hasta el coordinador, que muestra un mensaje y una acción de reintento. Si faltan campos opcionales como imagen, tipo o estadística, la tarjeta muestra un marcador de ausencia en vez de fallar.

## Caché

Se guardan las páginas del listado, con claves por `limit` y `offset`, y los detalles solicitados, con una clave por identificador normalizado. El TTL predeterminado es de **24 horas**, configurable mediante `POKEMON_CACHE_TTL_MS` en `src/api/pokemonCache.js`. Las solicitudes idénticas que coinciden comparten una promesa. Respuestas HTTP fallidas o datos inválidos no se guardan.

La caché se limita al almacenamiento del navegador actual; no ofrece sincronización entre dispositivos ni funcionamiento offline garantizado. Si `localStorage` está bloqueado, corrupto o lleno, la app omite la caché, intenta descartar entradas antiguas si hay una cuota agotada y continúa con la petición de red. Las instrucciones para probar e invalidar las entradas están en [README-cache.md](README-cache.md); `clearPokemonCache()` elimina solo las claves propias de la aplicación.

## Limitaciones conocidas

- La búsqueda y el filtro no son globales: solo examinan los Pokémon que ya se han cargado. Usa **Cargar más Pokémon** para ampliar ese conjunto.
- Se necesita conexión y disponibilidad de PokéAPI para obtener datos que no estén en caché. La caché caducada no sustituye una respuesta de red fallida.
- Si falla un detalle de la página, se ofrece reintentar la página; no se conserva una página parcial.
- Las ilustraciones se cargan desde las URL proporcionadas por PokéAPI y pueden no estar disponibles para todos los registros.

## Uso de herramientas de IA

Se ha utilizado **Codex** como herramienta de asistencia al desarrollo. El código generado debe revisarse, probarse y comprenderse por quien lo utilice; esta declaración no presupone ni atribuye políticas específicas de la universidad.
