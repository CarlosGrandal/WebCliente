// app.js — el oráculo elige su número secreto:
const tablero = document.getElementById("tablero");

let serpiente = [21, 22, 23];
let iniciado = false;
let intervalo;
let direccion;

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

    //if (!direccion) return;

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

    serpiente.push(cabeza);
    serpiente.shift();
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

}
dibujarTablero();
