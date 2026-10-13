# PokéDex Explorer

Aplicación web académica para explorar Pokémon mediante la API pública [PokéAPI](https://pokeapi.co/api/v2/). El proyecto utiliza Vite, JavaScript moderno con módulos ES, HTML y CSS, sin frameworks de interfaz.

## Requisitos

- Node.js 20.19+ o 22.12+
- npm

## Desarrollo

```bash
npm install
npm run dev
```

Vite mostrará la dirección local en la que se sirve la aplicación.

## Compilación y vista previa

```bash
npm run build
npm run preview
```

## Organización

- `src/api/`: acceso a servicios externos, incluida PokéAPI.
- `src/logic/`: reglas y transformaciones de datos.
- `src/ui/`: representación de la interfaz.
- `src/styles/`: estilos de la aplicación.
- `src/main.js`: punto de entrada y composición de módulos.
- `public/`: recursos estáticos servidos sin transformación.

La pantalla actual es una estructura inicial. La búsqueda, filtros, estadísticas y carga de datos quedan preparados para desarrollarse en las siguientes fases.
