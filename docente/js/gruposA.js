/**
 * ============================================================
 * SISTEMA DE GESTIÓN ACADÉMICA
 * Portal Docente
 *
 * Módulo: Gestión de Grupos Asignados
 * Archivo: gruposA.js
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", function () {

    GruposModulo.init();

});


const GruposModulo = (() => {

    /* =========================================================
       DATOS DE LOS GRUPOS
    ========================================================== */

    const cursos = [

        {
            codigo: "MAT-201",
            nombre: "Cálculo Diferencial",
            grupo: "Grupo 02",
            semestre: "Semestre 2",
            jornada: "Mañana",
            estudiantes: 32,
            horario: "Lun y Mié 08:00 - 10:00",
            aula: "Aula 302 • Edificio B (Campus Central)",
            icono: "fa-sigma",
            estado: "progress",
            avance: 60,
            estadoTexto: "Calificaciones al 60%"
        },

        {
            codigo: "MAT-102",
            nombre: "Álgebra Lineal",
            grupo: "Grupo 01",
            semestre: "Semestre 1",
            jornada: "Mañana",
            estudiantes: 35,
            horario: "Mar y Jue 10:00 - 12:00",
            aula: "Aula 104 • Pabellón A",
            icono: "fa-table-cells",
            estado: "warning",
            estadoTexto: "Planilla sin enviar"
        },

        {
            codigo: "MAT-305",
            nombre: "Métodos Numéricos",
            grupo: "Grupo 03",
            semestre: "Semestre 4",
            jornada: "Tarde",
            estudiantes: 28,
            horario: "Viernes 14:00 - 18:00",
            aula: "Laboratorio C-2 • Centro de Cómputo",
            icono: "fa-laptop-code",
            estado: "success",
            avance: 100,
            estadoTexto: "Actas Listas para Envío"
        },

        {
            codigo: "MAT-204",
            nombre: "Ecuaciones Diferenciales",
            grupo: "Grupo 01",
            semestre: "Semestre 3",
            jornada: "Tarde",
            estudiantes: 33,
            horario: "Lun y Mié 14:00 - 16:00",
            aula: "Aula 201 • Facultad de Ingeniería",
            icono: "fa-square-root-variable",
            estado: "neutral",
            avance: 80,
            estadoTexto: "Al día"
        }

    ];


    /* =========================================================
       ESTADO DEL MÓDULO
    ========================================================== */

    const estado = {
        modalCallback: null
    };


    /* =========================================================
       REFERENCIAS DEL HTML
    ========================================================== */

    const DOM = {

        courseGrid: document.getElementById("courseGrid"),

        courseSearch: document.getElementById("courseSearch"),

        globalSearch: document.getElementById("globalSearchInput"),

        semestreFilter: document.getElementById("semestreFilter"),

        jornadaFilter: document.getElementById("jornadaFilter"),

        visibleCount: document.getElementById("visibleCount"),

        totalGrupos: document.getElementById("totalGrupos"),

        totalEstudiantes: document.getElementById("totalEstudiantes"),

        syncBtn: document.getElementById("syncBtn"),

        btnSemestre: document.getElementById("btnSemestre"),

        btnAyuda: document.getElementById("btnAyuda"),

        btnNotificaciones:
            document.getElementById("btnNotificaciones"),

        btnPerfil:
            document.getElementById("btnPerfil"),

        btnGuia:
            document.getElementById("btnGuia"),

        btnSoporte:
            document.getElementById("btnSoporte"),

        btnCerrarSesion:
            document.getElementById("btnCerrarSesion"),

        actionModal:
            document.getElementById("actionModal"),

        modalTitle:
            document.getElementById("modalTitle"),

        modalBody:
            document.getElementById("modalBody"),

        modalConfirmBtn:
            document.getElementById("modalConfirmBtn"),

        btnCerrarModal:
            document.getElementById("btnCerrarModal"),

        btnCancelarModal:
            document.getElementById("btnCancelarModal"),

        toastContainer:
            document.getElementById("toastContainer")

    };


    /* =========================================================
       INICIALIZACIÓN
    ========================================================== */

    const init = () => {

        actualizarEstadisticas();

        renderCursos(cursos);

        configurarEventos();

    };


    /* =========================================================
       ESTADÍSTICAS
    ========================================================== */

    const actualizarEstadisticas = () => {

        const totalGrupos = cursos.length;

        const totalEstudiantes = cursos.reduce(
            (total, curso) => total + curso.estudiantes,
            0
        );

        DOM.totalGrupos.textContent =
            String(totalGrupos).padStart(2, "0");

        DOM.totalEstudiantes.textContent =
            totalEstudiantes;

    };


    /* =========================================================
       RENDERIZAR CURSOS
    ========================================================== */

    const renderCursos = (listaCursos) => {

        if (!DOM.courseGrid) {
            return;
        }

        DOM.courseGrid.innerHTML = "";

        DOM.visibleCount.textContent =
            listaCursos.length;


        if (listaCursos.length === 0) {

            DOM.courseGrid.innerHTML = `
                <div class="empty-state">

                    <i class="fa-solid fa-folder-open"></i>

                    <p>
                        No se encontraron asignaturas
                        que coincidan con los filtros.
                    </p>

                </div>
            `;

            return;
        }


        const fragment =
            document.createDocumentFragment();


        listaCursos.forEach((curso) => {

            const card =
                document.createElement("article");

            card.className = "course-card";


            card.innerHTML = `

                <div>

                    <div class="card-header">

                        <div>

                            <span class="course-code-tag">
                                ${curso.codigo}
                            </span>

                            <span class="semester-tag">
                                ${curso.semestre}
                            </span>

                        </div>

                        <i class="fa-solid ${curso.icono} course-icon"></i>

                    </div>


                    <h3 class="course-title">
                        ${curso.nombre}
                    </h3>


                    <div class="group-name">
                        ${curso.grupo}
                    </div>


                    <div class="course-details">

                        <div class="detail-item">

                            <i class="fa-solid fa-users"></i>

                            <strong>
                                ${curso.estudiantes}
                            </strong>

                            Estudiantes

                        </div>


                        <div class="detail-item">

                            <i class="fa-regular fa-clock"></i>

                            ${curso.horario}

                        </div>


                        <div class="detail-item">

                            <i class="fa-solid fa-location-dot"></i>

                            ${curso.aula}

                        </div>

                    </div>


                    ${crearEstado(curso)}

                </div>


                <div class="card-actions">

                    ${crearAcciones(curso)}

                </div>

            `;


            fragment.appendChild(card);

        });


        DOM.courseGrid.appendChild(fragment);

    };


    /* =========================================================
       ESTADO DE CADA CURSO
    ========================================================== */

    const crearEstado = (curso) => {

        if (curso.estado === "progress") {

            return `

                <div class="status-box progress">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            font-weight:600;
                        "
                    >

                        <span>
                            ${curso.estadoTexto}
                        </span>

                        <span style="color:#854d0e;">
                            ${curso.avance}%
                        </span>

                    </div>


                    <div class="progress-bar-container">

                        <div
                            class="progress-bar-fill"
                            style="
                                width:${curso.avance}%;
                                background-color:#854d0e;
                            "
                        ></div>

                    </div>

                </div>

            `;
        }


        if (curso.estado === "warning") {

            return `

                <div class="status-box warning">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            align-items:center;
                        "
                    >

                        <span>

                            <i class="fa-solid fa-file-circle-exclamation"></i>

                            <strong>
                                ${curso.estadoTexto}
                            </strong>

                        </span>

                        <span
                            style="
                                font-weight:700;
                                font-size:0.75rem;
                            "
                        >
                            Pendiente
                        </span>

                    </div>


                    <p
                        style="
                            font-size:0.75rem;
                            margin-top:4px;
                        "
                    >
                        Tiene notas guardadas en borrador
                        pendientes de publicar.
                    </p>

                </div>

            `;
        }


        if (curso.estado === "success") {

            return `

                <div class="status-box success">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            font-weight:600;
                            margin-bottom:4px;
                        "
                    >

                        <span>

                            <i class="fa-regular fa-circle-check"></i>

                            ${curso.estadoTexto}

                        </span>

                        <span>
                            100% Evaluado
                        </span>

                    </div>


                    <p style="font-size:0.75rem;">
                        Cierre consolidado.
                        Puede generar el reporte final firmado.
                    </p>

                </div>

            `;
        }


        if (curso.estado === "neutral") {

            return `

                <div class="status-box neutral">

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            font-weight:600;
                        "
                    >

                        <span>
                            ● ${curso.estadoTexto}
                        </span>

                        <span
                            style="
                                font-size:0.75rem;
                                color:var(--text-muted);
                            "
                        >
                            Sin pendientes inmediatos
                        </span>

                    </div>


                    <div class="progress-bar-container">

                        <div
                            class="progress-bar-fill"
                            style="
                                width:${curso.avance}%;
                                background-color:var(--primary-dark);
                            "
                        ></div>

                    </div>

                </div>

            `;
        }


        return "";

    };


    /* =========================================================
       BOTONES DE LAS TARJETAS
    ========================================================== */

    const crearAcciones = (curso) => {

        if (curso.codigo === "MAT-102") {

            return `

                <button
                    class="btn btn-navy btn-action-grades"
                    data-code="${curso.codigo}"
                    data-title="${curso.nombre}"
                >

                    <i class="fa-solid fa-pen-to-square"></i>

                    Ingresar Calificaciones

                </button>

            `;
        }


        if (curso.codigo === "MAT-305") {

            return `

                <button
                    class="btn btn-light btn-action-records"
                    data-code="${curso.codigo}"
                    data-title="${curso.nombre}"
                >

                    <i class="fa-regular fa-file-pdf"></i>

                    Ver Actas

                </button>

            `;
        }


        return `

            <button
                class="btn btn-light btn-action-criteria"
                data-code="${curso.codigo}"
                data-title="${curso.nombre}"
            >
                Gestionar Criterios
            </button>


            <button
                class="btn btn-navy btn-action-grades"
                data-code="${curso.codigo}"
                data-title="${curso.nombre}"
            >

                <i class="fa-solid fa-pen-to-square"></i>

                Ingresar Notas

            </button>

        `;

    };


    /* =========================================================
       FILTROS
    ========================================================== */

    const aplicarFiltros = () => {

        const texto =
            DOM.courseSearch.value
                .toLowerCase()
                .trim();


        const semestre =
            DOM.semestreFilter.value;


        const jornada =
            DOM.jornadaFilter.value;


        const cursosFiltrados =
            cursos.filter((curso) => {

                const coincideTexto =
                    curso.codigo
                        .toLowerCase()
                        .includes(texto)
                    ||
                    curso.nombre
                        .toLowerCase()
                        .includes(texto);


                const coincideSemestre =
                    semestre === ""
                    ||
                    curso.semestre === semestre;


                const coincideJornada =
                    jornada === ""
                    ||
                    curso.jornada === jornada;


                return (
                    coincideTexto &&
                    coincideSemestre &&
                    coincideJornada
                );

            });


        renderCursos(cursosFiltrados);

    };


    /* =========================================================
       MODAL
    ========================================================== */

    const abrirModal = (titulo, contenido, callback) => {

        DOM.modalTitle.textContent =
            titulo;

        DOM.modalBody.innerHTML =
            contenido;

        estado.modalCallback =
            callback;

        DOM.actionModal.classList.add("active");

    };


    const cerrarModal = () => {

        DOM.actionModal.classList.remove("active");

        estado.modalCallback = null;

    };


    const confirmarModal = () => {

        if (
            typeof estado.modalCallback ===
            "function"
        ) {

            estado.modalCallback();

        }

        cerrarModal();

    };


    /* =========================================================
       INGRESAR NOTAS
    ========================================================== */

    const ingresarNotas = (codigo, titulo) => {

        abrirModal(

            `Ingresar Notas - ${titulo} (${codigo})`,

            `

                <p style="margin-bottom:12px;">
                    Seleccione el corte de evaluación:
                </p>


                <select
                    id="modalCorteSelect"
                    class="filter-select"
                    style="width:100%; margin-bottom:12px;"
                >

                    <option value="1">
                        Corte 1 (30%)
                    </option>

                    <option value="2">
                        Corte 2 (30%)
                    </option>

                    <option value="3">
                        Corte Final (40%)
                    </option>

                </select>


                <div
                    style="
                        background-color:#f1f5f9;
                        padding:10px;
                        border-radius:6px;
                        font-size:0.8rem;
                        color:#475569;
                    "
                >

                    <i class="fa-solid fa-circle-info"></i>

                    Las notas pueden guardarse
                    como borrador antes de publicarlas.

                </div>

            `,

            () => {

                const select =
                    document.getElementById(
                        "modalCorteSelect"
                    );


                const corte =
                    select.value;


                mostrarToast(
                    `Cargando matriz del Corte ${corte} para ${titulo}`
                );

            }

        );

    };


    /* =========================================================
       GESTIONAR CRITERIOS
    ========================================================== */

    const gestionarCriterios =
        (codigo, titulo) => {

            abrirModal(

                `Criterios de Evaluación - ${titulo}`,

                `

                    <p style="margin-bottom:10px;">
                        Distribución porcentual del curso:
                    </p>


                    <div class="criteria-list">

                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                margin-bottom:10px;
                            "
                        >

                            <span>
                                Exámenes Parciales:
                            </span>

                            <input
                                type="number"
                                value="50"
                                min="0"
                                max="100"
                                class="filter-input"
                                style="width:80px;"
                            >

                        </div>


                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                                margin-bottom:10px;
                            "
                        >

                            <span>
                                Talleres y Quices:
                            </span>

                            <input
                                type="number"
                                value="30"
                                min="0"
                                max="100"
                                class="filter-input"
                                style="width:80px;"
                            >

                        </div>


                        <div
                            style="
                                display:flex;
                                justify-content:space-between;
                                align-items:center;
                            "
                        >

                            <span>
                                Proyecto Integrador:
                            </span>

                            <input
                                type="number"
                                value="20"
                                min="0"
                                max="100"
                                class="filter-input"
                                style="width:80px;"
                            >

                        </div>

                    </div>

                `,

                () => {

                    mostrarToast(
                        `Criterios actualizados para ${codigo}`
                    );

                }

            );

        };


    /* =========================================================
       VER ACTAS
    ========================================================== */

    const verActas =
        (codigo, titulo) => {

            abrirModal(

                `Acta Oficial - ${titulo}`,

                `

                    <p style="margin-bottom:12px;">
                        Vista previa del consolidado
                        definitivo para
                        <strong>${codigo}</strong>.
                    </p>


                    <div
                        style="
                            border:1px dashed var(--border-color);
                            padding:16px;
                            border-radius:6px;
                            text-align:center;
                            background-color:#fafafa;
                        "
                    >

                        <i
                            class="fa-solid fa-file-pdf fa-2x"
                            style="
                                color:#dc2626;
                                margin-bottom:6px;
                            "
                        ></i>


                        <p
                            style="
                                font-size:0.85rem;
                                font-weight:600;
                            "
                        >
                            Acta_Final_${codigo}_2024-I.pdf
                        </p>

                    </div>

                `,

                () => {

                    mostrarToast(
                        `Preparando Acta PDF de ${codigo}...`
                    );

                }

            );

        };


    /* =========================================================
       SINCRONIZAR
    ========================================================== */

    const sincronizar = () => {

        const textoOriginal =
            DOM.syncBtn.innerHTML;


        DOM.syncBtn.disabled = true;


        DOM.syncBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Sincronizando...
        `;


        setTimeout(() => {

            DOM.syncBtn.disabled = false;

            DOM.syncBtn.innerHTML =
                textoOriginal;


            mostrarToast(
                "Sincronización completada con éxito."
            );

        }, 1200);

    };


    /* =========================================================
       CAMBIAR SEMESTRE
    ========================================================== */

    const cambiarSemestre = () => {

        abrirModal(

            "Cambiar Período Académico",

            `

                <select
                    id="semesterSelect"
                    class="filter-select"
                    style="width:100%;"
                >

                    <option value="2024-I">
                        2024 - Primer Semestre (Vigente)
                    </option>

                    <option value="2023-II">
                        2023 - Segundo Semestre
                    </option>

                </select>

            `,

            () => {

                const seleccionado =
                    document.getElementById(
                        "semesterSelect"
                    ).value;


                mostrarToast(
                    `Período seleccionado: ${seleccionado}`
                );

            }

        );

    };


    /* =========================================================
       SOPORTE
    ========================================================== */

    const abrirSoporte = () => {

        abrirModal(

            "Soporte Técnico",

            `

                <p style="margin-bottom:10px;">
                    Escriba la descripción de su solicitud:
                </p>


                <textarea
                    id="supportMessage"
                    placeholder="Escriba su consulta aquí..."
                    style="
                        width:100%;
                        height:100px;
                        padding:10px;
                        border-radius:6px;
                        border:1px solid var(--border-color);
                        resize:vertical;
                    "
                ></textarea>

            `,

            () => {

                const mensaje =
                    document.getElementById(
                        "supportMessage"
                    ).value.trim();


                if (mensaje === "") {

                    mostrarToast(
                        "Debe escribir una consulta."
                    );

                    return;

                }


                mostrarToast(
                    "Solicitud enviada al área de soporte."
                );

            }

        );

    };


    /* =========================================================
       EVENTOS
    ========================================================== */

    const configurarEventos = () => {

        /* -----------------------------------------------------
           BÚSQUEDA LOCAL
        ------------------------------------------------------ */

        DOM.courseSearch.addEventListener(
            "input",
            aplicarFiltros
        );


        /* -----------------------------------------------------
           BÚSQUEDA GLOBAL
        ------------------------------------------------------ */

        DOM.globalSearch.addEventListener(
            "input",
            function () {

                DOM.courseSearch.value =
                    this.value;

                aplicarFiltros();

            }
        );


        /* -----------------------------------------------------
           FILTROS
        ------------------------------------------------------ */

        DOM.semestreFilter.addEventListener(
            "change",
            aplicarFiltros
        );


        DOM.jornadaFilter.addEventListener(
            "change",
            aplicarFiltros
        );


        /* -----------------------------------------------------
           BOTONES DE LAS TARJETAS
        ------------------------------------------------------ */

        DOM.courseGrid.addEventListener(
            "click",
            function (event) {

                const botonNotas =
                    event.target.closest(
                        ".btn-action-grades"
                    );


                const botonCriterios =
                    event.target.closest(
                        ".btn-action-criteria"
                    );


                const botonActas =
                    event.target.closest(
                        ".btn-action-records"
                    );


                if (botonNotas) {

                    ingresarNotas(
                        botonNotas.dataset.code,
                        botonNotas.dataset.title
                    );

                    return;
                }


                if (botonCriterios) {

                    gestionarCriterios(
                        botonCriterios.dataset.code,
                        botonCriterios.dataset.title
                    );

                    return;
                }


                if (botonActas) {

                    verActas(
                        botonActas.dataset.code,
                        botonActas.dataset.title
                    );

                }

            }
        );


        /* -----------------------------------------------------
           SINCRONIZAR
        ------------------------------------------------------ */

        DOM.syncBtn.addEventListener(
            "click",
            sincronizar
        );


        /* -----------------------------------------------------
           SEMESTRE
        ------------------------------------------------------ */

        DOM.btnSemestre.addEventListener(
            "click",
            cambiarSemestre
        );


        /* -----------------------------------------------------
           AYUDA
        ------------------------------------------------------ */

        DOM.btnAyuda.addEventListener(
            "click",
            function () {

                mostrarToast(
                    "Centro de ayuda del Portal Docente."
                );

            }
        );


        /* -----------------------------------------------------
           NOTIFICACIONES
        ------------------------------------------------------ */

        DOM.btnNotificaciones.addEventListener(
            "click",
            function () {

                mostrarToast(
                    "No hay nuevas notificaciones."
                );

            }
        );


        /* -----------------------------------------------------
           PERFIL
        ------------------------------------------------------ */

        DOM.btnPerfil.addEventListener(
            "click",
            function () {

                mostrarToast(
                    "Prof. Carlos Rivera - Ciencias Básicas."
                );

            }
        );


        /* -----------------------------------------------------
           GUÍA
        ------------------------------------------------------ */

        DOM.btnGuia.addEventListener(
            "click",
            function () {

                mostrarToast(
                    "Preparando la Guía Rápida del Docente."
                );

            }
        );


        /* -----------------------------------------------------
           SOPORTE
        ------------------------------------------------------ */

        DOM.btnSoporte.addEventListener(
            "click",
            abrirSoporte
        );


        /* -----------------------------------------------------
           SIDEBAR
        ------------------------------------------------------ */

        document
            .querySelectorAll(".sidebar-menu a[data-nav]")
            .forEach((enlace) => {

                enlace.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();


                        document
                            .querySelectorAll(
                                ".sidebar-menu li"
                            )
                            .forEach((item) => {

                                item.classList.remove(
                                    "active"
                                );

                            });


                        this.parentElement.classList.add(
                            "active"
                        );


                        mostrarToast(
                            `Navegando a: ${this.dataset.nav}`
                        );

                    }
                );

            });


        /* -----------------------------------------------------
           MODAL
        ------------------------------------------------------ */

        DOM.modalConfirmBtn.addEventListener(
            "click",
            confirmarModal
        );


        DOM.btnCerrarModal.addEventListener(
            "click",
            cerrarModal
        );


        DOM.btnCancelarModal.addEventListener(
            "click",
            cerrarModal
        );


        /* -----------------------------------------------------
           CERRAR MODAL AL HACER CLICK FUERA
        ------------------------------------------------------ */

        DOM.actionModal.addEventListener(
            "click",
            function (event) {

                if (event.target === DOM.actionModal) {

                    cerrarModal();

                }

            }
        );


        /* -----------------------------------------------------
           ESC PARA CERRAR MODAL
        ------------------------------------------------------ */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    DOM.actionModal.classList.contains(
                        "active"
                    )
                ) {

                    cerrarModal();

                }

            }
        );


        /* -----------------------------------------------------
           CERRAR SESIÓN
           
           auth.js conserva la responsabilidad de autenticación.
           Este módulo no duplica esa lógica.
        ------------------------------------------------------ */

        if (DOM.btnCerrarSesion) {

            DOM.btnCerrarSesion.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    /*
                     * Si auth.js tiene una función global
                     * cerrarSesion(), se utiliza.
                     */
                    if (
                        typeof window.cerrarSesion ===
                        "function"
                    ) {

                        window.cerrarSesion();

                    } else {

                        mostrarToast(
                            "La sesión será cerrada por el sistema de autenticación."
                        );

                    }

                }
            );

        }

    };


    /* =========================================================
       TOAST
    ========================================================== */

    const mostrarToast = (mensaje) => {

        if (!DOM.toastContainer) {
            return;
        }


        const toast =
            document.createElement("div");


        toast.className = "toast";


        toast.innerHTML = `

            <i
                class="fa-solid fa-circle-check"
                style="color:#4ade80;"
            ></i>

            <span>
                ${mensaje}
            </span>

        `;


        DOM.toastContainer.appendChild(toast);


        setTimeout(() => {

            toast.remove();

        }, 3000);

    };


    /* =========================================================
       API DEL MÓDULO
    ========================================================== */

    return {

        init

    };

})();