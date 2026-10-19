document.addEventListener("DOMContentLoaded", function () {

    // =========================================
    // ELEMENTOS PRINCIPALES
    // =========================================

    let formCriterio = document.getElementById("formCriterio");
    let nombreCriterio = document.getElementById("nombreCriterio");
    let porcentajeCriterio = document.getElementById("porcentajeCriterio");

    let tbodyCriterios = document.getElementById("tbodyCriterios");
    let totalPorcentaje = document.getElementById("totalPorcentaje");

    let tablaNotas = document.getElementById("tablaNotas");
    let encabezadoNotas = document.getElementById("encabezadoNotas");

    let globalSearch = document.getElementById("globalSearch");

    let btnGuardarBorrador = document.getElementById("btnGuardarBorrador");
    let btnExportar = document.getElementById("btnExportar");
    let btnEnviar = document.getElementById("btnEnviar");

    let alerta = document.getElementById("alerta");
    let alertaTitulo = document.getElementById("alertaTitulo");
    let alertaMensaje = document.getElementById("alertaMensaje");
    let alertaIcono = document.getElementById("alertaIcono");
    let cerrarAlerta = document.getElementById("cerrarAlerta");

    let tiempoAlerta;


    // =========================================
    // ALERTA PERSONALIZADA
    // =========================================

    function mostrarAlerta(titulo, mensaje, tipo) {

        alertaTitulo.textContent = titulo;
        alertaMensaje.textContent = mensaje;

        if (tipo === "error") {

            alertaIcono.textContent = "×";
            alertaIcono.style.background = "#feecec";
            alertaIcono.style.color = "#d32f2f";

        } else if (tipo === "advertencia") {

            alertaIcono.textContent = "!";
            alertaIcono.style.background = "#fff4df";
            alertaIcono.style.color = "#d97706";

        } else {

            alertaIcono.textContent = "✓";
            alertaIcono.style.background = "#e7f5e9";
            alertaIcono.style.color = "#2e7d32";
        }

        alerta.classList.add("mostrar");

        clearTimeout(tiempoAlerta);

        tiempoAlerta = setTimeout(function () {
            alerta.classList.remove("mostrar");
        }, 4000);
    }


    cerrarAlerta.addEventListener("click", function () {
        alerta.classList.remove("mostrar");
    });


    // =========================================
    // OBTENER PORCENTAJES
    // =========================================

    function obtenerPorcentajes() {

        let filas = tbodyCriterios.querySelectorAll("tr");

        let porcentajes = [];

        filas.forEach(function (fila) {

            let texto = fila.cells[1].textContent;

            let numero = parseFloat(
                texto.replace("%", "").trim()
            );

            if (!isNaN(numero)) {
                porcentajes.push(numero);
            }

        });

        return porcentajes;
    }


    // =========================================
    // CALCULAR TOTAL
    // =========================================

    function recalcularTotalPorcentaje() {

        let porcentajes = obtenerPorcentajes();

        let total = 0;

        porcentajes.forEach(function (porcentaje) {
            total += porcentaje;
        });

        totalPorcentaje.textContent = total + "%";

        if (total === 100) {

            totalPorcentaje.style.color = "#2e7d32";

        } else {

            totalPorcentaje.style.color = "#d32f2f";
        }

        actualizarEncabezados();
        recalcularTodasLasNotas();
    }


    // =========================================
    // ACTUALIZAR ENCABEZADOS DE NOTAS
    // =========================================

    function actualizarEncabezados() {

        let porcentajes = obtenerPorcentajes();

        let columnas = encabezadoNotas.querySelectorAll(
            "th"
        );

        let nombres = [];

        tbodyCriterios.querySelectorAll("tr").forEach(function (fila) {

            nombres.push(
                fila.cells[0].textContent.trim()
            );

        });


        for (let i = 0; i < porcentajes.length; i++) {

            let posicion = i + 2;

            if (columnas[posicion]) {

                let nombre = nombres[i] || "Criterio";

                columnas[posicion].innerHTML =
                    nombre +
                    '<span class="peso-columna">' +
                    porcentajes[i] +
                    "%" +
                    "</span>";
            }
        }
    }


    // =========================================
    // CALCULAR PROMEDIO DE UNA FILA
    // =========================================

    function calcularPromedioFila(fila) {

        let inputs = fila.querySelectorAll(".grade-input");

        let porcentajes = obtenerPorcentajes();

        let promedio = 0;

        let cantidad = Math.min(
            inputs.length,
            porcentajes.length
        );


        for (let i = 0; i < cantidad; i++) {

            let nota = parseFloat(inputs[i].value);

            if (isNaN(nota)) {
                nota = 0;
            }

            promedio += nota * (porcentajes[i] / 100);
        }


        let celdaPromedio =
            fila.querySelector(".promedio-final");


        if (porcentajes.length === inputs.length) {

            celdaPromedio.textContent =
                promedio.toFixed(1);

            celdaPromedio.classList.remove(
                "nota-alta",
                "nota-media",
                "nota-baja"
            );


            if (promedio >= 85) {

                celdaPromedio.classList.add(
                    "nota-alta"
                );

            } else if (promedio >= 70) {

                celdaPromedio.classList.add(
                    "nota-media"
                );

            } else {

                celdaPromedio.classList.add(
                    "nota-baja"
                );
            }

        } else {

            celdaPromedio.textContent = "-";
        }
    }


    // =========================================
    // RECALCULAR TODAS LAS NOTAS
    // =========================================

    function recalcularTodasLasNotas() {

        let filas =
            tablaNotas.querySelectorAll("tbody tr");

        filas.forEach(function (fila) {
            calcularPromedioFila(fila);
        });

    }


    // =========================================
    // AGREGAR CRITERIO
    // =========================================

    formCriterio.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            let nombre =
                nombreCriterio.value.trim();

            let porcentaje =
                parseFloat(
                    porcentajeCriterio.value
                );


            if (nombre === "") {

                mostrarAlerta(
                    "Datos incompletos",
                    "Debes ingresar el nombre del criterio.",
                    "advertencia"
                );

                return;
            }


            if (
                isNaN(porcentaje) ||
                porcentaje <= 0 ||
                porcentaje > 100
            ) {

                mostrarAlerta(
                    "Porcentaje inválido",
                    "El porcentaje debe estar entre 1 y 100.",
                    "advertencia"
                );

                return;
            }


            let totalActual = 0;

            obtenerPorcentajes().forEach(
                function (valor) {
                    totalActual += valor;
                }
            );


            if (totalActual + porcentaje > 100) {

                mostrarAlerta(
                    "Porcentaje excedido",
                    "La suma de los criterios no puede superar el 100%.",
                    "error"
                );

                return;
            }


            let fila =
                document.createElement("tr");


            fila.innerHTML = `
                <td>${nombre}</td>

                <td>${porcentaje}%</td>

                <td>
                    <button
                        type="button"
                        class="btn-eliminar"
                        title="Eliminar criterio">

                        <i class="fa-solid fa-trash"></i>

                    </button>
                </td>
            `;


            tbodyCriterios.appendChild(fila);


            nombreCriterio.value = "";
            porcentajeCriterio.value = "";


            recalcularTotalPorcentaje();


            mostrarAlerta(
                "Criterio agregado",
                "El criterio se agregó correctamente.",
                "exito"
            );

        }
    );


    // =========================================
    // ELIMINAR CRITERIO
    // =========================================

    tbodyCriterios.addEventListener(
        "click",
        function (evento) {

            let boton =
                evento.target.closest(".btn-eliminar");


            if (!boton) {
                return;
            }


            let fila = boton.closest("tr");

            let nombre =
                fila.cells[0].textContent.trim();


            fila.remove();

            recalcularTotalPorcentaje();


            mostrarAlerta(
                "Criterio eliminado",
                "Se eliminó el criterio: " + nombre,
                "exito"
            );

        }
    );


    // =========================================
    // CALCULAR NOTAS AL MODIFICAR
    // =========================================

    tablaNotas.addEventListener(
        "input",
        function (evento) {

            if (
                evento.target.classList.contains(
                    "grade-input"
                )
            ) {

                let valor =
                    parseFloat(evento.target.value);


                if (
                    valor < 0 ||
                    valor > 100
                ) {

                    evento.target.classList.add(
                        "nota-baja"
                    );

                } else {

                    evento.target.classList.remove(
                        "nota-baja"
                    );
                }


                let fila =
                    evento.target.closest("tr");

                calcularPromedioFila(fila);
            }

        }
    );


    // =========================================
    // BUSCAR ESTUDIANTES
    // =========================================

    globalSearch.addEventListener(
        "input",
        function () {

            let busqueda =
                globalSearch.value
                    .toLowerCase()
                    .trim();


            let filas =
                tablaNotas.querySelectorAll(
                    "tbody tr"
                );


            filas.forEach(function (fila) {

                let contenido =
                    fila.textContent.toLowerCase();


                if (
                    contenido.includes(busqueda)
                ) {

                    fila.style.display = "";

                } else {

                    fila.style.display = "none";
                }

            });

        }
    );


    // =========================================
    // GUARDAR BORRADOR
    // =========================================

    btnGuardarBorrador.addEventListener(
        "click",
        function () {

            mostrarAlerta(
                "Borrador guardado",
                "La información se guardó temporalmente.",
                "exito"
            );

        }
    );


    // =========================================
    // EXPORTAR
    // =========================================

    btnExportar.addEventListener(
        "click",
        function () {

            mostrarAlerta(
                "Exportación",
                "La planilla está preparada para exportarse a Excel o PDF.",
                "exito"
            );

        }
    );


    // =========================================
    // ENVIAR A COORDINACIÓN
    // =========================================

    btnEnviar.addEventListener(
        "click",
        function () {

            let porcentajes =
                obtenerPorcentajes();

            let total = 0;

            porcentajes.forEach(
                function (valor) {
                    total += valor;
                }
            );


            if (total !== 100) {

                mostrarAlerta(
                    "No se puede enviar",
                    "La suma de los criterios debe ser exactamente 100%.",
                    "advertencia"
                );

                return;
            }


            mostrarAlerta(
                "Planilla enviada",
                "La planilla fue enviada correctamente a Coordinación Académica.",
                "exito"
            );

        }
    );


    // =========================================
    // NOTIFICACIONES
    // =========================================

    document
        .querySelector('[data-accion="notificaciones"]')
        .addEventListener(
            "click",
            function () {

                mostrarAlerta(
                    "Notificaciones",
                    "Tienes 2 notificaciones del sistema docente.",
                    "exito"
                );

            }
        );


    // =========================================
    // CONFIGURACIÓN
    // =========================================

    document
        .querySelector('[data-accion="configuracion"]')
        .addEventListener(
            "click",
            function () {

                mostrarAlerta(
                    "Configuración",
                    "Las opciones generales del sistema están disponibles desde el portal.",
                    "exito"
                );

            }
        );


    // =========================================
    // CERRAR SESIÓN
    // =========================================

    document
        .getElementById("btnCerrarSesion")
        .addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                sessionStorage.removeItem(
                    "rolUsuario"
                );

                window.location.href =
                    "../../html/Registro.html";
            }
        );


    // =========================================
    // INICIALIZAR
    // =========================================

    recalcularTotalPorcentaje();

});