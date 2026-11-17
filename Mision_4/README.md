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

## Uso de IA

> Completar por el/la estudiante con información veraz antes de la entrega.

- Herramientas de IA utilizadas: **[completar o indicar “ninguna”]**
- Tareas en las que se utilizaron: **[describir únicamente las tareas realizadas]**
- Revisión y cambios realizados personalmente: **[completar]**

### Prompts del proyecto

A continuación se recopilan, en orden cronológico, las instrucciones y los cambios iterativos solicitados para este proyecto. Los mensajes de diseño y seguimiento se transcriben tal como se enviaron; el escudo se adjuntó como imagen en la conversación.

<details>
<summary>1. Preparar la estructura inicial</summary>

```text
Quiero que prepares la estructura inicial de una aplicación web llamada **Los Chavales FC**, destinada a gestionar las inscripciones de jugadores de un equipo de fútbol.

Antes de modificar nada, analiza el proyecto actual, identifica las tecnologías instaladas y comprueba su estado. No sobrescribas archivos existentes sin comprobarlos previamente.

### 1. Tecnologías obligatorias

La aplicación debe utilizar:

- React 19.
- Vite.
- JavaScript (JSX), no TypeScript.
- React Hook Form.
- Zod.
- @hookform/resolvers.
- TanStack Query v5.
- Una solución para realizar peticiones HTTP, preferiblemente fetch nativo.

No instales bibliotecas innecesarias.

### 2. Estructura del proyecto

Organiza el código de forma clara y escalable. Utiliza esta estructura como referencia:

src/

- components/
- pages/
- schemas/
- services/
- hooks/
- styles/
- App.jsx
- main.jsx

Puedes crear subcarpetas cuando estén justificadas.

### 3. Configuración de TanStack Query

Configura correctamente QueryClient y QueryClientProvider en el punto de entrada de la aplicación.

Prepara una configuración centralizada de TanStack Query, sin implementar todavía las consultas.

### 4. Diseño

La aplicación tendrá una identidad visual propia:

- Nombre: Los Chavales FC.
- Temática: equipo de fútbol.
- Colores principales: verde oscuro, blanco y detalles dorados.
- Diseño moderno, limpio y responsive.
- Interfaz en español.

Prepara una estructura visual inicial con navegación entre dos apartados:

- Inscripción.
- Plantilla.

### 5. Requisitos

- Mantén el código limpio y organizado.
- Utiliza componentes reutilizables.
- Evita duplicar lógica.
- No introduzcas funcionalidades que no se hayan solicitado.
- Comprueba que el proyecto arranca correctamente.

Al finalizar, explícame qué archivos has creado o modificado, qué dependencias has instalado y cómo ejecutar el proyecto.

**IMPORTANTE: NO REALICES NINGÚN COMMIT. No ejecutes git commit ni modifiques el historial de Git.**
```

</details>

<details>
<summary>2. Esquema de validación Zod</summary>

```text
Ahora quiero implementar el sistema de validación de datos de la aplicación Los Chavales FC utilizando exclusivamente Zod como fuente de verdad de las reglas de validación.

Analiza primero la estructura existente y trabaja sobre ella sin rehacer lo que ya funciona.

### 1. Campos del formulario

El futuro formulario de inscripción tendrá estos seis campos:

1. Nombre.
2. Apellido.
3. DNI.
4. Dorsal.
5. Fecha de nacimiento.
6. Posición.

### 2. Crear el esquema Zod

Crea un archivo playerSchema.js dentro de la carpeta schemas.

Define un esquema que contemple estas reglas:

- Nombre: obligatorio, entre 2 y 40 caracteres.
- Apellido: obligatorio, entre 2 y 60 caracteres.
- DNI: obligatorio, formato español de 8 números y una letra. Comprueba también que la letra corresponda al número mediante el algoritmo oficial de validación del DNI.
- Dorsal: obligatorio, número entero entre 1 y 99.
- Fecha de nacimiento: obligatoria, fecha válida y no futura.
- Posición: obligatoria y limitada a estas opciones: Portero, Defensa, Centrocampista y Delantero.

### 3. Mensajes de validación

Todos los errores deben tener mensajes personalizados en español.

Evita mensajes técnicos o genéricos.

Ejemplos:

- "El nombre es obligatorio".
- "El DNI introducido no es válido".
- "El dorsal debe estar entre 1 y 99".
- "Selecciona una posición".

### 4. Refinamientos

Utiliza las funcionalidades de refinamiento de Zod cuando sea necesario.

No dupliques las reglas de validación fuera del esquema.

Prepara también la inferencia o transformación de los datos necesaria para que el dorsal se gestione como número entero y no como texto.

### 5. Requisitos

- Zod debe ser la única fuente de verdad de la validación del formulario.
- No implementes validaciones manuales adicionales en los componentes React.
- Exporta el esquema para poder conectarlo posteriormente con React Hook Form mediante zodResolver.
- Mantén el código reutilizable y organizado.

Al terminar, explica todas las reglas implementadas y muestra cómo se utilizará este esquema desde React Hook Form.

**NO REALICES COMMITS NI MODIFIQUES EL HISTORIAL DE GIT.**
```

</details>

<details>
<summary>3. Formulario con React Hook Form</summary>

```text
Quiero que implementes el formulario de inscripción de jugadores de Los Chavales FC utilizando React Hook Form y el esquema Zod creado anteriormente.

Antes de empezar, analiza los componentes y archivos existentes. Reutiliza el esquema playerSchema.js. No dupliques las reglas de validación.

### 1. React Hook Form

Implementa el formulario utilizando:

- useForm.
- register.
- handleSubmit.
- formState.errors.
- formState.isSubmitting.

Conecta Zod mediante zodResolver y utiliza el esquema existente como única fuente de verdad de la validación.

El formulario debe ser no controlado siempre que sea posible. No utilices useState para gestionar individualmente los valores de los campos.

### 2. Campos

Implementa estos campos:

- Nombre: input de texto.
- Apellido: input de texto.
- DNI: input de texto.
- Dorsal: input numérico.
- Fecha de nacimiento: selector de fecha.
- Posición: selector con Portero, Defensa, Centrocampista y Delantero.

### 3. Experiencia de usuario

Implementa:

- Mensajes de error debajo de cada campo.
- Indicadores visuales de campos incorrectos.
- Etiquetas asociadas correctamente a sus inputs.
- Mensajes de error accesibles.
- Diseño responsive.
- Botón de inscripción.
- Estado visual de envío.
- Prevención de envíos duplicados.

El diseño debe seguir la identidad visual de Los Chavales FC: verde oscuro, blanco y detalles dorados.

### 4. Envío

Prepara una función de envío que reciba los datos validados por React Hook Form.

Todavía no implementes la comunicación definitiva con el servidor. Deja el formulario preparado para conectar posteriormente el envío con una mutation de TanStack Query.

Puedes utilizar una respuesta simulada temporalmente, pero deja claramente identificada esa parte para sustituirla en el siguiente paso.

### 5. Comprobaciones

Comprueba que:

- Los campos obligatorios no se pueden dejar vacíos.
- Los mensajes de Zod aparecen correctamente.
- El DNI se valida correctamente.
- El dorsal solo admite valores permitidos.
- La fecha no puede ser futura.
- Los datos correctos llegan a la función de envío.

No introduzcas validaciones adicionales fuera de Zod.

**NO REALICES COMMITS NI MODIFIQUES EL HISTORIAL DE GIT.**
```

</details>

<details>
<summary>4. API, TanStack Query y plantilla</summary>

```text
Quiero implementar la comunicación con el servidor de la aplicación Los Chavales FC utilizando TanStack Query v5.

Analiza el proyecto y el código existente antes de realizar cambios. Mantén la arquitectura y reutiliza los componentes y esquemas creados.

### 1. API

Necesito que la aplicación permita:

- Registrar jugadores mediante POST.
- Obtener todos los jugadores mediante GET.

Primero comprueba si ya existe una API o backend configurado.

Si no existe, implementa una solución de backend sencilla y persistente, preferiblemente con Node.js y Express, almacenando los jugadores en un archivo JSON local.

No utilices localStorage como sustituto del servidor: la práctica debe demostrar peticiones HTTP reales.

Centraliza las peticiones en services/playerService.js.

### 2. Registro con useMutation

Implementa un hook personalizado useCreatePlayer que utilice useMutation de TanStack Query v5.

Debe:

- Enviar los datos del formulario al servidor.
- Gestionar correctamente los errores HTTP.
- Gestionar la respuesta del servidor.
- Mostrar feedback de éxito.
- Mostrar feedback de error.
- Evitar envíos duplicados.
- Invalidar la consulta de jugadores después de registrar correctamente un jugador.

Utiliza una clave de consulta centralizada y coherente, por ejemplo ['players'].

### 3. Listado con useQuery

Implementa un hook personalizado usePlayers que utilice useQuery.

Debe:

- Obtener todos los jugadores del servidor.
- Gestionar el estado isPending.
- Gestionar el estado isError.
- Gestionar el estado de éxito.
- Utilizar una queryKey bien diseñada.
- Permitir actualizar los datos después de una inscripción.

### 4. Página de plantilla

Implementa la página de listado de jugadores.

Debe mostrar:

- Nombre y apellido.
- DNI parcialmente oculto.
- Dorsal.
- Fecha de nacimiento.
- Posición.

Añade un diseño visual cuidado, con los dorsales destacados y las posiciones identificadas mediante etiquetas.

Incluye:

- Indicador de carga.
- Mensaje de error.
- Botón para reintentar la consulta.
- Mensaje cuando todavía no hay jugadores.

### 5. Conectar formulario y API

Sustituye la función simulada del formulario por la mutation de TanStack Query.

Cuando el registro se complete:

- Muestra un mensaje de éxito.
- Limpia el formulario.
- Actualiza automáticamente el listado mediante invalidación de caché.

### 6. Dorsales duplicados

Implementa una comprobación de dorsales duplicados en el servidor.

No permitas que dos jugadores tengan el mismo dorsal.

Esta comprobación debe realizarse en el backend, no solamente en React.

### 7. Requisitos técnicos

- Utiliza TanStack Query v5.
- No utilices APIs antiguas de React Query.
- Centraliza las queryKeys.
- Separa servicios, hooks y componentes.
- No dupliques las peticiones HTTP.
- Gestiona correctamente los códigos de error HTTP.
- No confíes en los datos recibidos del cliente.

### 8. Comprobaciones

Prueba el registro de un jugador, la consulta del listado y la detección de dorsales duplicados.

Comprueba también que la invalidación de la query actualiza el listado después de una inscripción.

**NO REALICES COMMITS NI MODIFIQUES EL HISTORIAL DE GIT.**
```

</details>

<details>
<summary>5. Revisión final, respuestas corruptas y README</summary>

```text
Quiero realizar la revisión final y completar la aplicación Los Chavales FC para preparar su entrega académica.

Analiza todo el proyecto antes de modificarlo. No rehagas funcionalidades que ya estén correctamente implementadas.

### 1. BONUS: validar respuestas del API con Zod

Esta funcionalidad es especialmente importante.

Quiero que las respuestas recibidas del servidor también se validen mediante esquemas Zod.

Crea los esquemas necesarios para validar la estructura de los jugadores recibidos.

Utiliza safeParse() para comprobar las respuestas.

Si una respuesta contiene datos corruptos:

- Detecta el error.
- No utilices los datos inválidos.
- Devuelve un error controlado.
- Permite que TanStack Query gestione el error.

### 2. Demostración de datos corruptos

Necesito demostrar que la validación de respuestas funciona.

Implementa un mecanismo de prueba que permita simular una respuesta corrupta del API.

Por ejemplo:

- Un jugador con un identificador de tipo incorrecto.
- Un dorsal que sea texto en lugar de número.
- Una posición que no pertenezca a las opciones permitidas.

Al recibir estos datos, Zod debe detectarlos mediante safeParse() y la aplicación debe mostrar un error controlado.

La demostración debe estar claramente documentada y no debe comprometer el funcionamiento normal de la aplicación.

### 3. Experiencia de usuario

Revisa toda la interfaz.

Comprueba que:

- Los estados de carga están bien representados.
- Los errores son comprensibles.
- Los mensajes de éxito aparecen correctamente.
- Los formularios tienen etiquetas accesibles.
- Los campos muestran correctamente sus errores.
- Los botones indican cuándo están procesando una operación.
- La aplicación funciona en móvil y escritorio.

### 4. Originalidad

Mejora los detalles visuales de Los Chavales FC:

- Identidad visual futbolística.
- Cabecera con el nombre del equipo.
- Dorsales destacados.
- Etiquetas para las posiciones.
- Contador de jugadores inscritos.
- Estados vacíos bien diseñados.

No añadas funcionalidades innecesarias que compliquen el proyecto.

### 5. README

Crea un README.md completo que explique:

- Descripción de Los Chavales FC.
- Funcionalidades.
- Tecnologías utilizadas.
- Instalación de dependencias.
- Cómo ejecutar frontend y backend.
- Estructura del proyecto.
- Funcionamiento de React Hook Form.
- Funcionamiento de Zod.
- Funcionamiento de TanStack Query.
- Invalidación de consultas.
- Validación de respuestas del API.
- Cómo reproducir la demostración de datos corruptos.

### 6. Declaración de uso de IA

Incluye una sección en el README que permita declarar el uso de herramientas de inteligencia artificial.

No inventes qué herramientas se han utilizado ni qué tareas se han realizado. Deja una declaración editable para que pueda completarla honestamente.

### 7. Revisión técnica final

Comprueba:

- Que todas las dependencias están correctamente declaradas.
- Que se utiliza React 19.
- Que se utiliza TanStack Query v5.
- Que no hay dependencias innecesarias.
- Que no existen errores de compilación.
- Que no hay errores de consola evitables.
- Que el proyecto arranca correctamente.
- Que el backend funciona.
- Que el registro y el listado funcionan.
- Que la invalidación funciona.
- Que Zod detecta respuestas corruptas.
- Que la estructura de carpetas es coherente.

Ejecuta las comprobaciones disponibles y corrige los problemas que encuentres.

Al terminar, genera un informe indicando qué requisitos de la rúbrica están cumplidos, cuáles están parcialmente cumplidos y cuáles faltan.

No afirmes que una funcionalidad está probada si no has ejecutado realmente su comprobación.

**NO REALICES COMMITS NI MODIFIQUES EL HISTORIAL DE GIT.**
```

</details>

<details>
<summary>6. Inicio de los retoques estéticos</summary>

```text
PErfecto ahora vamos a hacer los retoques estéticos que yo quiera
```

</details>

<details>
<summary>7. Escudo, color y eslogan</summary>

```text
Este es nuestro escudo, he visto que usas LC o LCFC en un recuadrito como insignia. usa esta imagen en vez de eso. Tambien quiero que sustituyas el color verde con este #24396e. Cambia el eslogan de "El futbol nos une el equipo nos define" Por este otro "Perder, perder y perder"

[Se adjuntó la imagen del escudo.]
```

</details>

<details>
<details>
<summary>Aclaración posterior sobre el escudo</summary>

```text
Prefiero no adjuntarlo
```

</details>
<summary>8. Datos de ejemplo y ubicación del club</summary>

```text
Quiero que para el nombre en el formulario sea Carlos y el Apellido Grandal (El de ejemplo). No estamos en Madrid, estamos en Las Rozas y fue fundado en 2021
```

</details>

<details>
<summary>9. Plantilla en campo de fútbol 7 y entrenador</summary>

```text
Cuando se pueda ver la plantilla quiero que se vea en un campo de futbol, no en una lista como tal. Jugamos furbol 7 asi que la formacion será Portero, 2 defensas, 3 medios y 1 delantero. En vez de poner ahi la lista, haz que haya por ejemplo un circulo que diga delanteros, lo pulsas y aparezca un desplegable con todos los delanteros registrados. Aparte haz un espacio para un entrenador. NO hagas una opcion para inscribirse como entrenador, el hueco de entrenador va a estar siempre lleno por alguien que se llama David Julian
```

</details>

<details>
<summary>10. Cambios al banquillo y al estado vacío</summary>

```text
No me gusta como has hecho la parte del entrenador. Quiero que sea como un banquillo al lado del campo, donde suele estar. Quita los circulos esos con asteriscos y pon el escudo, si quieres que no tenga fondo está bien, lo que prefieras. Y no pongas mensajes cursis, si no hay jugadores inscritos di "no hay jugadores inscritos
```

</details>

<details>
<summary>11. Ubicación del desplegable</summary>

```text
Puedes hacer que el desplegable se abra a un lado, justo encima del banquillo?
```

</details>

<details>
<summary>12. Ajuste de posición del banquillo y el desplegable</summary>

```text
el desplegable me gusta, pero no habia porque poner el banquillo arriba y que despues se mueva a abajo, me gustaba donde estaba antes
```

```text
No me has entendido, hay espacio suficiente para las dos cosas, pone el banquillo mas abajo y haz que el desplegable se despliegue como antes
```

```text
el desplegable que no muestre el dni. Y el banquillo se mantiene estático da igual si hay o no deplegable
```

</details>

<details>
<summary>13. Regla para impedir una inscripción</summary>

```text
Vale se podria hacer una regla que si el nombre es Nacho Oya no te deja inscribirte?
```

</details>

<details>
<summary>14. Consultas para abrir y usar la aplicación</summary>

```text
porque no puedo ver la pagina?

hazlo tu

se me ha cerrado vite o porque no puedo ver la web?

No veo la web

Sigue siendo solo una pantalla en blanco

quiero que funcione en vs code solo funciona en el navegador

dejalo da igual
```

</details>

<details>
<summary>15. Documentar los prompts</summary>

```text
Quiero que hagas una seccion en el read me que se llame Uso de IA, mete ahi todos los prompts que te haya pasado para hacer este trabajo.
```

</details>

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
