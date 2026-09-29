// app.js — el oráculo elige su número secreto:
const tablero = document.getElementById("tablero");
const puntuacion = document.getElementById("puntuacion");
const menuFinal = document.getElementById("menuFinal");
const resumenPartida = document.getElementById("resumenPartida");
const categoriaPartida = document.getElementById("categoriaPartida");
const tituloFinal = document.getElementById("tituloFinal");
const botonReiniciar = document.getElementById("botonReiniciar");

let serpiente = [21, 22, 23];
let manzanasComidas = 0;
let iniciado = false;
let intervalo;
let direccion;
let manzana;

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
        }
        if (i === manzana) {
            casilla.classList.add("manzana");
        }
        tablero.appendChild(casilla);
    }
}

document.addEventListener("keydown", function(event) {

    if(event.key === "w"){

        if(direccion != "abajo"){

            direccion = "arriba";
        }
    }
    else if(event.key === "s"){

        if(direccion != "arriba"){
            
            direccion = "abajo";
        }
    }
    else if(event.key === "d"){

        if(direccion != "izquierda"){
            
            direccion = "derecha";
        }
    }
    else if(event.key === "a"){

        if(direccion != "derecha"){
            
            direccion = "izquierda";
        }
    }
    if (!iniciado) {
        iniciado = true;
        intervalo = setInterval(moverSerpiente, 150);
    }
});

function moverSerpiente() {

    if (!direccion) return;

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

function comprobarLimite(cabeza){

    if(direccion == "derecha"){

        if(cabeza == 9 || cabeza == 19|| cabeza == 29|| cabeza == 39 || cabeza == 49|| cabeza == 59 || cabeza == 69
            || cabeza == 79 || cabeza == 89 || cabeza == 99){

                perder()
            }
    }
    if(direccion == "izquierda"){

        if(cabeza == 0 || cabeza == 10|| cabeza == 20|| cabeza == 30 || cabeza == 40|| cabeza == 50 || cabeza == 60
            || cabeza == 70 || cabeza == 80 || cabeza == 90){

                perder()
            }
    }
    if(direccion == "arriba"){

        if(cabeza == 1 || cabeza == 2|| cabeza == 3|| cabeza == 4 || cabeza == 5|| cabeza == 6 || cabeza == 7
            || cabeza == 8 || cabeza == 9 || cabeza == 0){

                perder()
            }
    }
    if(direccion == "abajo"){
        
        if(cabeza == 91 || cabeza == 92|| cabeza == 93|| cabeza == 94 || cabeza == 95|| cabeza == 96 || cabeza == 97
            || cabeza == 98 || cabeza == 99 || cabeza == 90){

                perder()
            }
    }
}

function perder(){

    for (let posicion of serpiente) {
        let casilla = tablero.children[posicion];

        casilla.classList.remove("serpiente");
        casilla.classList.add("serpienteMuerta");
    }
    clearInterval(intervalo);
    resumenPartida.textContent = `Comiste ${manzanasComidas} manzanas y tu serpiente llegó a ${serpiente.length} casillas.`;
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
    direccion = undefined;
    iniciado = false;
    crearManzana();
    dibujarTablero();
    menuFinal.hidden = true;
});

crearManzana();
dibujarTablero();
