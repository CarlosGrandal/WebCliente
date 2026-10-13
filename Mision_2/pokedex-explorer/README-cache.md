# Caché de PokéDex Explorer

La aplicación guarda en `localStorage` las páginas de referencias de PokéAPI (clave con `limit` y `offset`) y los detalles de los Pokémon (clave con identificador normalizado). Solo se guardan respuestas JSON que hayan superado la validación del módulo API.

## Caducidad e invalidación

El TTL predeterminado es de 24 horas y se configura con `POKEMON_CACHE_TTL_MS` en `src/api/pokemonCache.js`. Las entradas caducadas se eliminan cuando se consultan. El prefijo de claves es `pokedex-explorer:cache:v1:`; cambiar la versión invalida las entradas antiguas. También se puede llamar a `clearPokemonCache()` desde la consola del navegador después de importar el módulo, o eliminar las claves que comienzan por ese prefijo en DevTools → Application → Local Storage.

## Probar la caché

1. Ejecuta `npm run dev` y carga la Pokédex con la pestaña Network abierta.
2. Recarga la página: las solicitudes repetidas se responden desde `localStorage` y no generan nuevas llamadas a PokéAPI mientras no caduquen.
3. Borra las claves con el prefijo anterior y recarga para forzar solicitudes nuevas.
4. Para comprobar el modo sin almacenamiento, deshabilita Local Storage o usa una ventana privada con almacenamiento bloqueado; la app seguirá solicitando datos a la red.

Si `localStorage` no está disponible, está corrupto o agota su cuota, la caché se omite o descarta entradas antiguas y la solicitud de red sigue su curso. Las solicitudes idénticas simultáneas comparten una única promesa.
