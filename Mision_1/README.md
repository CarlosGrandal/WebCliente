# Serpiente

## Cómo probarlo

Entra en: https://carlosgrandal.github.io/WebCliente/Mision_1/ y simplemente dale a jugar cuando estés listo. El juego es un snake clasico del Nokia, controlas a la serpiente con WASD, tu objetivo es comer el maximo posible de manzanas sin morir. Te mueres cuando te chocas con alguno de los bordes del tablero o si te chocas contigo mismo.


## Uso de IA

Para este proyecto me he apoytado en chatGPT y no en GeminiCLI pese a tenerlo bien conectado
a vsCode por dos razones: La primera es que me parece mucho mas comodo tener codex como
extension en vsCode que usar Gemini desde la terminal, codex puede seguir modificando el archivo y todo asi que no le veia ninguna ventaja a GeminiCLI. Aparte pese a que la universidad nos de el pro de Gemini gratis no lo he podido conectar y si que tengo el de chatGPT asi que gemini me va mucho mas lento que chatgpt, por lo menos cuando lo probé en clase. Este proyecto se podria dividir en dos mitades, una donde programaba yo y me apoyaba en chatGPT en su version de la pagina web porque me acuerdo mas bi
en poco de como programar en js y css. Conseguí dividir el tablero y crearlo, y tener una serpiente que yo podía controlar con WASD tambien tenia una logica (bastante mala) de como debia actuar la serpiente cuando se encontraba con los limites del tablero. Despues de como 1 hora intentando solucionar la interaccion entre la serpiente y el tablero decidí hacerlo con codex en vsCode. Le he pedido que recopilara todos los prompts que le he pasado para poder hacer el proyecto y son los de mas abajo. Estos no incluyen mi conversacion con la web porque aparte de ser muy larga no es tan util como la de codex porque solo le hago preguntas sobre porque no me funcionan cosas o como funcionan cosas en javascript. Con respecto al HTML y al css antes de que codex interviniera era bastane simple: Una imagen de fondo, la division del tablero, y cambios de color para la serpiente y la serpiente muerta.
Prompts de esta conversación

1. arregla mi codigo, la serpiente no se muere cuando toca los bordes o a si misma, cambia lo minimo posible

2. ahora quiero hacer que aparezca una manzana en una de las casillas libres, si la cabeza pasa por encima, la serpiente crece una casilla y aparece otra manzana.

3. 
   ```js
   const libres = Array.from({ length: 100 }, (\_, i) => i)
       .filter(posicion => !serpiente.includes(posicion));
   manzana = libres.length ? libres[Math.floor(Math.random() \* libres.length)] : undefined;
   ```

   que hace todo esto?

4. ahora quiero que cada manzana que comas añada uno a un contador que esté en la zona de arriba a la izquierda de la pantalla

5. me parece muy cutre, intenta que se parezca al tipico marcador de deportes, el negro con numeros amarillos

6. ahora quiero que cuando pierdas te salga un menú diciendo que has perdido y un resumencillo de la partida

7. es un poco cutre. Hazlo un poco transparente, menos cutre y el boton que tenga la tipica flecha no lo de "Volver a jugar"

8. hazlo mas grande y haz un intervalo. Si has conseguido menos de 15 manzanas, nobato, si tienes entre 15 y 30 pro, y si tienes mas de 30 hacker

9. ahora haz que si no has conseguido ninguna manzana en vez de Has perdido ponga Baneado por malo y no te deje reinicar

10. Me parece un poco cutre todavia el juego, no se si es la imagen de fondo que es un poco mierda, la serpiente y la manzana siendo tan simples o el contador que sigue siendo algo caca.

11. cuando muevo muy rapido arriba y por ejemplo derecha, si lo hago antes de que el intervalo llame a que se mueva la serpiente se muere, pero si llamo a moverSerpioente despues de cada tecla se mueve demasiado rapido, sin tocar nada, como se podria solucionar?

12. vamos a hacer un menu antes de empezar a jugar. Vamos a hacerlo exactamente igual que lo que sale cuando pierdes. Titulo "Bienvenido a Serpiente (logo de tm)", con dos botones,  uno verde clarito/transparente que diga Jugar y a la izquierda uno rojo igual de clarito/transparente que va a decir Jugar

13. vamos a hacer un pequeño easter egg, lo de tener dos botones que hacen lo mismo era una broma pero, Y ANTES DE CAMBIAR NADA QUIERO QUE LO HABLEMOS, seria mucho complicar las cosas que si pulso el verde se quede todo como está pero si pulso el rojo la serpiente se vuelve roja, la manzana verde y la serpiente muerta verde?

14. Vale en vez de eso vamos a hacer otra cosa. El ejercicio me decia que tenia que hacer un modo "oscuro" y me lo has recordado diciendo eso. Ahora sigue sin cambiar nada que quiero seguir viendo ideas, que te parece que la serpiente roja con el resto verde sea el modo oscuro y se active con el boton rojo o pulsando la n?

15. no quiero que oscurezca el fondo o las casillas porque ya son oscuras y me gusta asi. Vamos a hacer una cosa. Encima del teclado pone escrito "SNAKE" vamos a hacer que en el modo normal la N sea verde y en el otro modo sea rojo. Asi cambia un poco el titulo soso, se puede ver mas facil el modo en el que estamos y encima es un guiño a como se activa

16. asegurate de que no haya ningún `console.log` de depuración ni código muerto.

17. aqui usas px, estas seguro de que si lo pongo en otra pantalla las proporciones se van a mantener?

18. que significa el z-index: 1, en .serpiente?

19. `cabeza-${direccion || "derecha"}`

    que significa esto

20. que hace esto:

    ```js
    const cuerpo = serpiente.slice(1);
    if (cuerpo.includes(cabeza)) return perder();
    ```

21. NO VUELVAS A CAMBIAR NADA DE CODIGO, LA PARTE DE CODIGO HA ACABADO.
    Te acuerdas de como estaba el proyecto antes de que te dijera que la serpiente no se moria al tocar los bordes? Si no te acuerdas no pasa nada

22. tambien se movia con wasd la serpiente

23. quiero que hagas un README en esta carpeta/este repositorio que yo no se bien como funciona eso del README, tambien quiero que recopiles TODOS los prompts de esta conversacion (solo los prompts da igual lo que tu dijeras).


## Autopsia

El juego tiene de base un cuadricula, html le da un espacio, css le da tamaño y division en 10 filas y columnas y despues javascript da un valor entre 0 y 99 que pasan a ser casillas.
Tanto la serpiente como la manzana despues ocupan casillas de dentro de este tablero. Esta division se hace nada mas cargar la pagina web. Se escoge un numero aleatorio entre el 0 y el 99 (excluyendo las casillas ocupadas por la serpiente) y en el sitio en el que salga se pone la manzana. A la serpiente se le da una posicion inicial y se le ha puesto por defecto que empiece moviendose hacia la derecha. La serpiente no es mas que una lista de numeros por asi decirlo, guarda en que casilla está cada parte del cuerpo y en que direccion se está mirando para saber hacia donde tiene que ir la cabeza (derecha es como sumar 1 a la posicion anterior pero ir hacia arriba es restar 10). Una vez empieza la partida se crea un intervalo para ir moviendo la serpiente hacia la direccion registrada. Una direccion se registra cuando pulsas W,A,S o D. La unica limitacion en el movimiento es que si estás yendo hacia la derecha no pudes ir a la izquierda, si vas hacia arriba no puedes ir hacia abajo y viceversa. Cuando te comes una manzana sumas 1 al marcador y cuando pierdes se te da una categoría segun lo bien que lo hayas hecho. El modo oscuro no cambia el color de fondo o del tablero ya que me gusta mucho los colores que tiene y creo que distraería mucho un cambio tan grande, asi que he decidido que el modo oscuro se representa cambiando de color a la serpiente, manzana y serpiente muerta. El titulo de "SNAKE" que hay encima del tablero tambien cambia de color segun el modo en el que estés, lo que cambia es la N porque asi hace un guiño a la tecla que tienes que pulsar para cambiar de modo.  
