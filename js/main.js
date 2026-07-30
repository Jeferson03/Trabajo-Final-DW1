import { getShows } from "./api.js";
import { renderShows } from "./ui.js";

/* =========================================
   ELEMENTOS DEL DOM
   ========================================= */

const catalog = document.querySelector("#catalog");

const loader = document.querySelector("#loader");

const errorMessage =
    document.querySelector("#error-message");

const resultStatus =
    document.querySelector("#result-status");

const pageIndicator =
    document.querySelector("#page-indicator");

const previousButton =
    document.querySelector("#previous-page");

const nextButton =
    document.querySelector("#next-page");


/* =========================================
   CONFIGURACIÓN DE PAGINACIÓN
   ========================================= */

/*
 * Cantidad de tarjetas que queremos mostrar en cada página de nuestra aplicación.
 */
const ITEMS_PER_PAGE = 15;

/*
 * Cantidad aproximada de resultados que entrega TVMaze por página de API.
 *
 * TVMaze utiliza 250 resultados por página.
 */
const API_PAGE_SIZE = 250;


/* =========================================
   ESTADO DE LA APLICACIÓN
   ========================================= */

/*
 * Resultados que hemos obtenido de la API.
 */
let allShows = [];

/*
 * Página que está viendo actualmente el usuario.
 */
let currentPage = 0;

/*
 * Página actual de la API.
 *
 * TVMaze comienza en page=0.
 */
let currentApiPage = 0;

/*
 * Indica si ya llegamos al final de la API.
 */
let apiFinished = false;


/* =========================================
   ESTADOS DE LA INTERFAZ
   ========================================= */
/**
 * Activa o desactiva el indicador de carga.
 *
 * @param {boolean} isLoading
 */
function setLoading(isLoading) {
    loader.classList.toggle(
        "hidden",
        !isLoading
    );
}


/**
 * Muestra un mensaje de error.
 *
 * @param {string} message
 */
function showError(message) {
    errorMessage.textContent = message;

    errorMessage.classList.remove(
        "hidden"
    );
}


/**
 * Oculta el mensaje de error.
 */
function clearError() {
    errorMessage.classList.add(
        "hidden"
    );

    errorMessage.textContent = "";
}


/* =========================================
   PAGINACIÓN
   ========================================= */

/**
 * Calcula qué elementos de allShows corresponden a la página actual.
 */
function getCurrentPageShows() {

    const start =
        currentPage * ITEMS_PER_PAGE;

    const end =
        start + ITEMS_PER_PAGE;

    return allShows.slice(
        start,
        end
    );
}


/**
 * Determina si necesitamos obtener más información desde la API.
 * @returns {Promise<void>}
 */
async function ensureEnoughShows() {

    /*
     * Mientras no tengamos suficientes resultados para mostrar la página actual...
     */
    while (
        !apiFinished &&
        allShows.length <=
            currentPage * ITEMS_PER_PAGE
    ) {

        await loadNextApiPage();
    }
}


/**
 * Solicita la siguiente página de la API.
 */
async function loadNextApiPage() {

    const shows =
        await getShows(currentApiPage);

    /*
     * Si la API no devuelve resultados, significa que no quedan más páginas.
     */
    if (
        !Array.isArray(shows) ||
        shows.length === 0
    ) {
        apiFinished = true;

        return;
    }

    /*
     * Agregamos TODOS los resultados.
     */
    allShows.push(...shows);

    /*
     * Pasamos a la siguiente página de la API.
     */
    currentApiPage++;


    if (
        shows.length < API_PAGE_SIZE
    ) {
        apiFinished = true;
    }
}


/**
 * Actualiza los botones de navegación y el indicador de página.
 */
function updatePagination() {

    /*
     * La interfaz comienza en página 1, aunque internamente usamos índice 0.
     */
    pageIndicator.textContent =
        `Página ${currentPage + 1}`;

    /*
     * En la primera página no se puede regresar.
     */
    previousButton.disabled =
        currentPage === 0;

    /*
     * Calculamos si existe una página siguiente con los datos actuales.
     */
    const nextPageStart =
        (currentPage + 1) *
        ITEMS_PER_PAGE;

    const hasNextPage =
        nextPageStart < allShows.length ||
        !apiFinished;

    nextButton.disabled =
        !hasNextPage;
}


/* =========================================
   RENDERIZADO
   ========================================= */

/**
 * Muestra la página actual.
 */
function renderCurrentPage() {

    const shows =
        getCurrentPageShows();

    renderShows(
        catalog,
        shows
    );

    /*
     * Mostramos información al usuario.
     */
    const firstResult =
        currentPage * ITEMS_PER_PAGE + 1;

    const lastResult =
        firstResult + shows.length - 1;

    resultStatus.textContent =
        `Mostrando ${firstResult}–${lastResult} de ${allShows.length} series`;

    updatePagination();
}


/* =========================================
   CARGA DE DATOS
   ========================================= */

/**
 * Inicializa la aplicación.
 */
async function initializeApp() {

    setLoading(true);

    clearError();

    try {

        /*
         * Cargamos la primera página
         */
        await loadNextApiPage();

        /*
         * Mostramos solamente los primeros 10 en la interfaz.
         */
        renderCurrentPage();

    } catch (error) {

        console.error(
            "Error al cargar las series:",
            error
        );

        resultStatus.textContent =
            "No fue posible cargar el catálogo.";

        showError(
            "Ocurrió un problema al consultar " +
            "TVMaze. Verifica tu conexión a Internet " +
            "e inténtalo nuevamente."
        );

    } finally {

        setLoading(false);
    }
}


/* =========================================
   BOTÓN ANTERIOR
   ========================================= */

previousButton.addEventListener(
    "click",
    () => {

        if (currentPage === 0) {
            return;
        }

        currentPage--;

        renderCurrentPage();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);


/* =========================================
   BOTÓN SIGUIENTE
   ========================================= */

nextButton.addEventListener(
    "click",
    async () => {

        /*
         * Primero avanzamos de página.
         */
        currentPage++;

        setLoading(true);

        clearError();

        try {

            /*
             * Comprobamos si tenemos suficientes
             * datos almacenados para mostrar
             * esta nueva página.
             *
             * Si no los tenemos, se consulta
             * automáticamente la siguiente
             * página de la API.
             */
            await ensureEnoughShows();

            /*
             * Mostramos los 10 correspondientes a la página actual.
             */
            renderCurrentPage();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } catch (error) {

            console.error(
                "Error al obtener más series:",
                error
            );

           
            currentPage--;

            renderCurrentPage();

            showError(
                "No fue posible cargar más " +
                "resultados. Inténtalo nuevamente."
            );

        } finally {

            setLoading(false);
        }
    }
);


initializeApp();