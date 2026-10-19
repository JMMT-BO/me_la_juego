document.addEventListener("DOMContentLoaded", function () {
    // =========================================
    // REPORTE RÁPIDO
    // =========================================
    let btnReporte =
        document.getElementById("btnReporte");
    if (btnReporte) {
        btnReporte.addEventListener("click", function () {
            alert("Generando reporte rápido del sistema.");
        });
    }
    // =========================================
    // SINCRONIZAR DATOS
    // =========================================
    let btnSincronizar =
        document.getElementById("btnSincronizar");
    if (btnSincronizar) {
        btnSincronizar.addEventListener("click", function () {
            alert("Datos sincronizados correctamente.");
        });
    }
    // =========================================
    // BUSCADOR
    // =========================================
    let buscar =
        document.getElementById("buscar");
    if (buscar) {
        buscar.addEventListener("keyup", function () {
            console.log("Buscando:", buscar.value);
        });
    }

    let btnCrearUsuario =
        document.getElementById("btnCrearUsuario");
    if (btnCrearUsuario) {
         btnCrearUsuario.addEventListener("click", function () {
            window.location.href = "CrearUsuario.html";
         });
    }
});

function mostrarAlerta(titulo, mensaje, tipo = "exito") {

    let alerta = document.getElementById("alerta");
    let alertaTitulo = document.getElementById("alertaTitulo");
    let alertaMensaje = document.getElementById("alertaMensaje");
    let alertaIcono = document.getElementById("alertaIcono");

    alertaTitulo.textContent = titulo;
    alertaMensaje.textContent = mensaje;

    if (tipo === "exito") {
        alertaIcono.textContent = "✓";
    } 
    else if (tipo === "error") {
        alertaIcono.textContent = "×";
    } 
    else if (tipo === "advertencia") {
        alertaIcono.textContent = "!";
    } 
    else {
        alertaIcono.textContent = "i";
    }

    alerta.classList.add("mostrar");

    setTimeout(function () {
        alerta.classList.remove("mostrar");
    }, 4000);
}

document.getElementById("cerrarAlerta").addEventListener("click", function () {
    document.getElementById("alerta").classList.remove("mostrar");
});