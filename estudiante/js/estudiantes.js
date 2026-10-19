
/* =========================================
   DESCARGAR CERTIFICADO
========================================= */

const certificateBtn =
    document.getElementById("certificateBtn");


certificateBtn.addEventListener(
    "click",
    function () {

        alert(
            "El certificado se descargará próximamente."
        );

    }
);


/* =========================================
   CERRAR SESIÓN
========================================= */

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener(
    "click",
    function () {

        const confirmar = confirm(
            "¿Deseas cerrar sesión?"
        );


        if (confirmar) {

            alert(
                "Sesión cerrada correctamente."
            );

        }

    }
);


/* =========================================
   NOTIFICACIONES
========================================= */

const notification =
    document.querySelector(".notification");


notification.addEventListener(
    "click",
    function () {

        alert(
            "No tienes nuevas notificaciones."
        );

    }
);


/* =========================================
   NAVEGACIÓN
========================================= */

const navigationLinks =
    document.querySelectorAll(
        ".navigation a"
    );


navigationLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                navigationLinks.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                link.classList.add(
                    "active"
                );

            }
        );

    }
);


/* =========================================
   AVATAR
========================================= */

const avatar =
    document.querySelector(
        ".user-avatar"
    );


avatar.addEventListener(
    "click",
    function () {

        alert(
            "Perfil de Alejandro García Pérez"
        );

    }
);

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
