# PokéDex Explorer

PokéDex Explorer es una guía web para descubrir Pokémon. Presenta tarjetas con ilustración, número de Pokédex, tipos, medidas y estadísticas base. Está construida con React 19 y conserva la API, la caché y el diseño del proyecto anterior.

## Funcionalidades

- Carga paginada de Pokémon desde PokéAPI, con acción para cargar más y reintentar si falla una página.
- Búsqueda por nombre o número, filtro por tipo y orden por número de Pokédex o nombre.
- Indicadores del total cargado, resultados visibles y media de estadísticas base.
- Favoritos: se pueden marcar desde cada tarjeta, filtrar en la colección y conservar entre sesiones.
- Sincronización de favoritos entre pestañas del mismo navegador.
- Diseño adaptable, controles accesibles, estados vacíos y marcadores cuando faltan datos o imágenes.

La búsqueda, los filtros y las estadísticas se aplican a los Pokémon cargados en la sesión; no consultan todo el catálogo. Los favoritos guardan identificadores localmente y el filtro muestra los que pertenecen a las páginas ya cargadas.

## Tecnologías

- React 19 y React DOM 19 para la interfaz y el estado.
- Vite 6 y `@vitejs/plugin-react` para desarrollo, JSX y compilación.
- JavaScript con módulos ES y CSS adaptable.
- PokéAPI como fuente de datos pública.
- `node:test` para las pruebas automatizadas, sin dependencias de testing adicionales.

## Instalación y ejecución

Se requiere Node.js 20.19+ o 22.12+ y npm.

```bash
npm install
npm run dev
```

Abre en el navegador la dirección local que muestra Vite. No abras `index.html` directamente como archivo: React necesita que Vite sirva los módulos.

Para comprobar las pruebas y generar una compilación de producción:

```bash
npm test
npm run build
npm run preview
```

## Organización de archivos

```text
index.html
vite.config.js
package.json
package-lock.json
src/
  main.jsx                    Punto de entrada de React y estilos
  App.jsx                     Estado compartido, datos y efectos de la aplicación
  api/
    pokemonApi.js             Peticiones, validación y solicitudes compartidas
    pokemonCache.js           Caché de API en localStorage, TTL e invalidación
  logic/
    pokemonLogic.js           Normalización, filtros, orden y estadísticas
  hooks/
    useLocalStorage.js         Estado persistente y sincronizado entre pestañas
  components/
    Explorer.jsx              Composición de la sección principal
    ExplorerControls.jsx      Búsqueda, filtros y orden
    PokemonSummary.jsx         Indicadores calculados
    PokemonResults.jsx         Estado de carga y resultados
    PokemonCard.jsx            Tarjeta y acción de favoritos
    LoadControls.jsx           Carga incremental y reintento
    HeroSection.jsx            Presentación
    SiteHeader.jsx             Cabecera
    SiteFooter.jsx             Pie de página
  styles/
    main.css                  Estilos responsive
test/
  pokemonApi.test.js
  pokemonLogic.test.js
public/
  Recursos estáticos
```

## Decisiones técnicas

- `App` mantiene el estado compartido de búsqueda, tipo, orden, páginas y favoritos. Los componentes reciben valores y acciones por props; los conteos, tipos, medias y resultados filtrados se calculan a partir de ese estado, sin guardarlos otra vez.
- `useEffect` se reserva para sincronización externa: iniciar la carga de datos, registrar el atajo de teclado, persistir favoritos y escuchar cambios de `localStorage`. Los listeners se eliminan al desmontar. La carga inicial tiene una función estable y evita actualizar estado si el componente ya se desmontó.
- `useLocalStorage` lee el valor inicial de forma diferida, guarda los cambios y escucha el evento `storage` para reflejar modificaciones de otra pestaña. Si el almacenamiento no está disponible, la interfaz sigue funcionando durante la sesión.
- `pokemonApi.js` y `pokemonCache.js` no dependen de React. Las peticiones idénticas comparten una promesa y las respuestas válidas se guardan por 24 horas.
- Cada página se añade cuando han terminado todas sus peticiones de detalle. Así se evita presentar una página incompleta como si estuviera completa; en caso de error, se puede reintentar sin duplicar tarjetas.
- Las listas usan claves basadas en identificador o nombre normalizado del Pokémon; los tipos y estadísticas usan claves únicas dentro de sus listas.

## Uso de IA

**Herramienta utilizada:** Codex en ChatGPT como asistente de programación. No se utilizó otra herramienta de IA en los cambios documentados aquí.

**Partes desarrolladas con apoyo de IA:** adaptación a React 19 y Vite, componentes JSX, flujo de estado y efectos, favoritos y el hook de `localStorage`, además de esta documentación. La aplicación anterior ya existía en el repositorio antes de estas fases.

**Extractos textuales de prompts reales de esta conversación:**

> “Mantener el diseño y las funcionalidades originales. No elimines funcionalidades existentes ni reconstruyas la aplicación sin necesidad.”

> “No utilices useEffect para calcular valores que puedan derivarse directamente del estado.”

**Comprobación del código:** se ejecutaron `npm test` (10 pruebas aprobadas), `npm run build` y comprobaciones HTTP de las rutas servidas por Vite. La compilación transforma correctamente los componentes JSX.

**Partes manuales y procedencia:** los módulos de API, caché, lógica, estilos y pruebas de la misión anterior estaban en el proyecto antes de estas fases y se conservaron. El historial disponible no identifica quién escribió manualmente esa base; por tanto, no se le atribuye autoría manual a ninguna persona. En las fases documentadas aquí no puedo confirmar una contribución nueva independiente de Codex: los cambios de React indicados arriba se implementaron con su asistencia.

## Autopsia

### 1. Cargar cada página como una unidad

La aplicación solicita los detalles de una página en paralelo con `Promise.all` y solo incorpora la página cuando todas las solicitudes terminan correctamente. Se eligió para evitar resultados parciales y hacer que el botón de reintento opere sobre una página completa. La alternativa descartada era añadir tarjetas a medida que terminara cada petición; habría requerido gestionar fallos parciales, reintentos individuales y posibles duplicados.

### 2. Guardar favoritos en el navegador

Los favoritos se guardan en `localStorage` mediante un hook propio y se sincronizan con el evento `storage`. Se eligió porque ofrece persistencia entre sesiones sin requerir cuentas ni un servidor adicional. La alternativa de mantenerlos solo en estado React los perdería al recargar; una API remota necesitaría backend y gestión de usuarios, que el proyecto no tiene. Para esta aplicación pequeña, un hook evita añadir una biblioteca de estado global.

## Repositorio y comprobaciones

`.gitignore` excluye `node_modules/`, `dist/` y `build/`, además de cachés, archivos de entorno y logs de npm. Esas carpetas no están versionadas. El historial conserva los commits anteriores y contiene más de cinco commits de desarrollo.

Para repetir las comprobaciones:

```bash
npm test
npm run build
```
