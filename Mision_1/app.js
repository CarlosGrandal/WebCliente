// app.js — el oráculo elige su número secreto:
const tablero = document.getElementById("tablero");

let serpiente = [21, 22, 23];

function dibujarTablero() {
    tablero.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const casilla = document.createElement("div");

        casilla.classList.add("casilla");

        if (serpiente.includes(i)) {
            casilla.classList.add("serpiente");
        }

        tablero.appendChild(casilla);
    }
}

function moverSerpiente() {
    serpiente.shift();

    let cabeza = serpiente[serpiente.length - 1];

    serpiente.push(cabeza + 1);

    dibujarTablero();
}

dibujarTablero();

setInterval(moverSerpiente, 500);
