// app.js — el oráculo elige su número secreto:
const secreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;

const inputNumero = document.querySelector("#numero");
const botonComprobar = document.querySelector("#comprobar");
const parrafoResultado = document.querySelector("#resultado");
const marcadorIntentos = document.querySelector("#intentos");

console.log("(psst... el secreto es", secreto, ")");

function comprobarNumero() {
    const textoIntroducido = inputNumero.value.trim();
    const numero = Number(textoIntroducido);

    // Una consulta no válida no consume ningún intento.
    if (textoIntroducido === "" || !Number.isInteger(numero) || numero < 1 || numero > 100) {
        parrafoResultado.textContent = "⚠️ Escribe un número entero entre 1 y 100.";
        parrafoResultado.className = "aviso";
        inputNumero.focus();
        return;
    }

    intentos += 1;
    marcadorIntentos.textContent = intentos;

    if (numero === secreto) {
        parrafoResultado.textContent = `🎉 ¡Correcto! El número secreto era ${secreto}.`;
        parrafoResultado.className = "acierto";
        botonComprobar.disabled = true;
        inputNumero.disabled = true;
        return;
    }

    parrafoResultado.textContent = numero < secreto
        ? `🔼 El número secreto es mayor que ${numero}.`
        : `🔽 El número secreto es menor que ${numero}.`;
    parrafoResultado.className = "pista";
    inputNumero.select();
}

botonComprobar.addEventListener("click", comprobarNumero);

inputNumero.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        comprobarNumero();
    }
});
