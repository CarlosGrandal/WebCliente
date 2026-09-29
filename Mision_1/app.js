// Lógica del juego Snake.
const tablero = document.getElementById("tablero");
const puntuacion = document.getElementById("puntuacion");
const menuFinal = document.getElementById("menuFinal");
const menuInicio = document.getElementById("menuInicio");
const resumenPartida = document.getElementById("resumenPartida");
const categoriaPartida = document.getElementById("categoriaPartida");
const tituloFinal = document.getElementById("tituloFinal");
const botonReiniciar = document.getElementById("botonReiniciar");

let serpiente = [21, 22, 23];
let manzanasComidas = 0;
let iniciado = false;
let intervalo;
let direccion = "derecha";
let direccionPendiente;
let manzana;
let modoAlternativo = false;

function crearManzana() {
    const libres = Array.from({ length: 100 }, (_, i) => i)
        .filter(posicion => !serpiente.includes(posicion));
    manzana = libres.length ? libres[Math.floor(Math.random() * libres.length)] : undefined;
}

function dibujarTablero() {
    tablero.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const casilla = document.createElement("div");

        casilla.classList.add("casilla");

        if (serpiente.includes(i)) {
            casilla.classList.add("serpiente");
            if (i === serpiente[serpiente.length - 1]) {
                casilla.classList.add("cabeza", `cabeza-${direccion || "derecha"}`);
            }
        }
        if (i === manzana) {
            casilla.classList.add("manzana");
        }
        tablero.appendChild(casilla);
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "n" && !event.repeat) {
        cambiarModo(!modoAlternativo);
        return;
    }

    if (!iniciado) return;

    let nuevaDireccion;

    if (event.key === "w") nuevaDireccion = "arriba";
    else if (event.key === "s") nuevaDireccion = "abajo";
    else if (event.key === "d") nuevaDireccion = "derecha";
    else if (event.key === "a") nuevaDireccion = "izquierda";

    if (nuevaDireccion && !direccionPendiente) {
        const esMarchaAtras =
            (nuevaDireccion === "arriba" && direccion === "abajo") ||
            (nuevaDireccion === "abajo" && direccion === "arriba") ||
            (nuevaDireccion === "derecha" && direccion === "izquierda") ||
            (nuevaDireccion === "izquierda" && direccion === "derecha");

        if (!esMarchaAtras) direccionPendiente = nuevaDireccion;
    }

});

function cambiarModo(alternativo) {
    modoAlternativo = alternativo;
    document.body.classList.toggle("modo-alternativo", modoAlternativo);
}

function empezarPartida(alternativo) {
    cambiarModo(alternativo);
    menuInicio.hidden = true;
    iniciado = true;
    intervalo = setInterval(moverSerpiente, 250);
}

document.getElementById("botonJugarRojo").addEventListener("click", () => empezarPartida(true));
document.getElementById("botonJugarVerde").addEventListener("click", () => empezarPartida(false));

function moverSerpiente() {

    if (direccionPendiente) {
        direccion = direccionPendiente;
        direccionPendiente = undefined;
    }

    let cabeza = serpiente[serpiente.length - 1];

    if(direccion == "derecha"){
        if (cabeza % 10 === 9) return perder();
        cabeza = cabeza + 1;
    }else if(direccion == "izquierda"){
        if (cabeza % 10 === 0) return perder();
        cabeza = cabeza - 1;
    }else if(direccion == "arriba"){
        cabeza = cabeza - 10;
    }else if(direccion == "abajo"){
        cabeza = cabeza + 10;
    }

    if (cabeza < 0 || cabeza >= 100) return perder();

    // La cola avanza en este mismo turno, así que no cuenta como choque.
    const cuerpo = serpiente.slice(1);
    if (cuerpo.includes(cabeza)) return perder();

    const comioManzana = cabeza === manzana;
    serpiente.push(cabeza);
    if (comioManzana) {
        manzanasComidas++;
        puntuacion.textContent = manzanasComidas;
        crearManzana();
    } else {
        serpiente.shift();
    }
    dibujarTablero();
}

function perder(){

    for (let posicion of serpiente) {
        let casilla = tablero.children[posicion];

        casilla.classList.remove("serpiente");
        casilla.classList.add("serpienteMuerta");
    }
    clearInterval(intervalo);
    resumenPartida.textContent = `Comiste ${manzanasComidas} 
                                manzanas y tu serpiente llegó a ${serpiente.length} casillas.`;
    let categoria = "Novato";
    if (manzanasComidas >= 15 && manzanasComidas <= 30) {
        categoria = "Pro";
    } else if (manzanasComidas > 30) {
        categoria = "Hacker";
    }
    categoriaPartida.textContent = `Nivel: ${categoria}`;
    tituloFinal.textContent = manzanasComidas === 0 ? "Baneado por malo" : "¡Has perdido!";
    botonReiniciar.hidden = manzanasComidas === 0;
    menuFinal.hidden = false;

}

botonReiniciar.addEventListener("click", function() {
    clearInterval(intervalo);
    serpiente = [21, 22, 23];
    manzanasComidas = 0;
    puntuacion.textContent = manzanasComidas;
    direccion = "derecha";
    direccionPendiente = undefined;
    iniciado = false;
    crearManzana();
    dibujarTablero();
    menuFinal.hidden = true;
});

crearManzana();
dibujarTablero();
