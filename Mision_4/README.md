# Los Chavales FC

Aplicación web para gestionar las inscripciones y consultar la plantilla de jugadores de Los Chavales FC. La interfaz usa React, el formulario valida con Zod y React Hook Form, y la comunicación se realiza por HTTP con una API local Express que guarda los registros en JSON.

## Funcionalidades

- Inscripción de jugadores con nombre, apellido, DNI, dorsal, fecha de nacimiento y posición.
- Validación de los campos en el cliente y en el servidor mediante el esquema Zod compartido.
- Comprobación de DNI español y asignación de dorsales únicos en el backend.
- Listado de plantilla con DNI parcialmente oculto, dorsales destacados y posición identificada por etiqueta.
- Estados de carga, error con reintento y lista vacía.
- Persistencia local en `server/data/players.json`.
- Validación Zod de las respuestas JSON del API antes de usar los datos.

## Tecnologías

- React 19 y JavaScript con JSX.
- Vite y `@vitejs/plugin-react`.
- React Hook Form y `@hookform/resolvers`.
- Zod 4.
- TanStack Query v5.
- Node.js y Express 5.
- `fetch` nativo para las peticiones HTTP.

## Requisitos previos

- Node.js 20.19+ o 22.12+ recomendado.
- npm.

## Instalación y ejecución

Instala las dependencias una vez:

```bash
npm install
```

Inicia el backend en una terminal:

```bash
npm run dev:server
```

Inicia Vite en otra terminal:

```bash
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). Vite reenvía `/api` a Express en `http://127.0.0.1:3001`.

El backend expone `GET /api/players` y `POST /api/players`. El archivo `server/data/players.json` se crea automáticamente si no existe. Para cambiar el puerto del API se puede definir la variable `PORT` antes de ejecutar `npm run dev:server`.

Compilación de producción del frontend:

```bash
npm run build
```

## Estructura del proyecto

```text
server/
  data/players.json          Persistencia local
  server.js                  API Express, validación y control de dorsales
src/
  components/
    PlayerCard.jsx           Tarjeta reutilizable de jugador
    Sidebar.jsx               Marca y navegación
  hooks/
    queryKeys.js              Claves centralizadas de TanStack Query
    useCreatePlayer.js        Mutation de alta e invalidación
    usePlayers.js             Consulta de plantilla
  pages/
    RegistrationPage.jsx     Formulario de inscripción
    RosterPage.jsx           Estados y listado de plantilla
  schemas/
    playerSchema.js           Validación de entrada del jugador
    playerResponseSchema.js   Validación de respuestas de jugador y API
  services/
    playerService.js          Peticiones HTTP y validación de respuestas
    queryClient.js             Configuración central de TanStack Query
  styles/
    global.css                Identidad visual y diseño responsive
  App.jsx
  main.jsx
```

## Formulario y React Hook Form

`RegistrationPage` usa `useForm`, `register`, `handleSubmit` y los errores de `formState`. El formulario es no controlado. `zodResolver(playerSchema)` conecta la validación sin replicar reglas en los componentes. Zod transforma el dorsal capturado como texto al número que recibe el envío. La mutation muestra el estado pendiente, presenta el error del API o confirma el alta y limpia los campos al terminar correctamente.

## Validación con Zod

`src/schemas/playerSchema.js` es el esquema compartido de entrada. Valida nombres, DNI, dorsal entero entre 1 y 99, fecha no futura y posición permitida. Express vuelve a validar esos datos; normaliza el dorsal numérico recibido a texto para pasarlo por el mismo esquema y solo persiste el resultado parseado.

`src/schemas/playerResponseSchema.js` valida, además, el identificador UUID, los campos del jugador, el dorsal numérico, la fecha de alta y la estructura de las respuestas GET y POST. `playerService.js` llama a `safeParse()`. Si la estructura no coincide, lanza un error controlado antes de devolver los datos; TanStack Query expone ese error a la interfaz.

## TanStack Query e invalidación

`usePlayers` obtiene la lista con `useQuery` y la clave central `queryKeys.players` (`['players']`). `useCreatePlayer` envía los datos con `useMutation`. Tras una respuesta de alta válida, invalida `['players']`: si la consulta está activa se vuelve a pedir al servidor; si no, queda marcada como obsoleta y se actualiza al abrir la plantilla.

## Demostración de respuesta corrupta

La demostración no altera el archivo de jugadores y está desactivada por defecto. La ruta especial del backend solo responde con datos inválidos cuando el servidor no está en producción y se activa expresamente `ENABLE_CORRUPT_RESPONSE_DEMO=1`. El payload de demostración contiene un ID numérico, un dorsal de texto y una posición desconocida; `playersResponseSchema.safeParse()` lo rechaza y la página de plantilla muestra el estado de error.

1. Detén el backend normal.
2. En PowerShell, inicia el backend con la opción habilitada:

   ```powershell
   $env:ENABLE_CORRUPT_RESPONSE_DEMO = '1'
   npm run dev:server
   ```

   En Bash:

   ```bash
   ENABLE_CORRUPT_RESPONSE_DEMO=1 npm run dev:server
   ```

3. Mantén Vite ejecutándose y abre `http://localhost:5173/?demo=corrupt`.
4. Selecciona **Plantilla**. El API responde HTTP 200 con el payload sintético y el cliente lo rechaza mediante Zod.
5. Para volver al funcionamiento normal, detén el backend y reinícialo sin la variable de entorno. Abre la aplicación sin `?demo=corrupt`.

## Declaración de uso de herramientas de inteligencia artificial

> Completar por el/la estudiante con información veraz antes de la entrega.

- Herramientas de IA utilizadas: **[completar o indicar “ninguna”]**
- Tareas en las que se utilizaron: **[describir únicamente las tareas realizadas]**
- Revisión y cambios realizados personalmente: **[completar]**

## Comprobaciones realizadas en la revisión

- `npm ls --depth=0`: confirmó React y React DOM 19, TanStack Query 5, React Hook Form, Zod, resolvers, Vite y Express instalados.
- `node --check` en servidor, servicio HTTP y esquema de respuesta: sin errores de sintaxis.
- `npm run build`: compilación correcta. Rollup muestra avisos no bloqueantes por comentarios `@__PURE__` de Zod que elimina del bundle.
- Peticiones HTTP al API: alta correcta y posterior listado; datos de entrada inválidos devuelven 400; dorsal duplicado devuelve 409, incluidas dos altas simultáneas.
- Persistencia: el jugador de prueba siguió disponible después de reiniciar Express.
- TanStack Query: una consulta observada volvió a pedir el listado al invalidar `['players']` tras el alta.
- Respuesta corrupta: `safeParse()` rechazó identificador, dorsal y posición incorrectos; el error quedó en estado de error de TanStack Query. Con el modo demo desactivado se validó la respuesta normal.
- Vite y proxy: la página y `/api/players` respondieron HTTP 200.

## Revisión visual pendiente

Se revisaron los estados y los breakpoints responsive en los componentes y estilos. No se ejecutó una sesión de navegador automatizada ni se inspeccionó la consola visual del navegador; por tanto, la apariencia real en dispositivos móviles y escritorio no se declara verificada visualmente.