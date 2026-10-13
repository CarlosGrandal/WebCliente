# PokéDex Explorer

Aplicación académica en JavaScript vanilla y Vite que consulta la API pública de [PokéAPI](https://pokeapi.co/api/v2/).

## Desarrollo

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

## Compilación y vista previa

```bash
npm run build
npm run preview
```

## Estructura

- `src/api/pokemonApi.js`: peticiones HTTP y validación de respuestas.
- `src/logic/pokemonLogic.js`: normalización, filtros y agregados puros.
- `src/ui/render.js`: renderizado del DOM.
- `src/main.js`: coordina carga, eventos y módulos.
- `src/styles/main.css`: estilos responsive.
