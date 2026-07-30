const FALLBACK_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="600"
             height="900"
             viewBox="0 0 600 900">

            <rect width="600" height="900" fill="#20232d"/>

            <text x="300"
                  y="430"
                  fill="#a7adbd"
                  font-family="Arial"
                  font-size="28"
                  text-anchor="middle">
                Sin imagen disponible
            </text>
        </svg>
    `);

/**
 * Elimina las etiquetas HTML del resumen
 * proporcionado por la API.
 *
 * @param {string|null} html
 * @returns {string}
 */
function stripHtml(html) {
    if (!html) {
        return "Sin descripción disponible.";
    }

    const temporaryElement = document.createElement("div");

    temporaryElement.innerHTML = html;

    return (
        temporaryElement.textContent.trim() ||
        "Sin descripción disponible."
    );
}

/**
 * Obtiene el año a partir de la fecha de estreno.
 *
 * @param {string|null} date
 * @returns {string}
 */
function getYear(date) {
    return date ? date.slice(0, 4) : "Año no disponible";
}

/**
 * Crea una tarjeta de serie.
 *
 * @param {Object} show
 * @returns {HTMLElement}
 */
export function createShowCard(show) {
    const article = document.createElement("article");
    article.className = "card";

    // Contenedor de imagen
    const imageWrapper = document.createElement("div");
    imageWrapper.className = "card-image-wrapper";

    // Imagen
    const image = document.createElement("img");

    image.className = "card-image";

    image.src = show.image?.medium || FALLBACK_IMAGE;

    image.alt = `Póster de ${show.name}`;

    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.src = FALLBACK_IMAGE;
    });

    // Año
    const year = document.createElement("span");

    year.className = "card-year";

    year.textContent = getYear(show.premiered);

    imageWrapper.append(image, year);

    // Contenido
    const content = document.createElement("div");

    content.className = "card-content";

    // Título
    const title = document.createElement("h3");

    title.className = "card-title";

    title.textContent = show.name || "Sin título";

    // Géneros
    const meta = document.createElement("p");

    meta.className = "card-meta";

    meta.textContent = show.genres?.length
        ? show.genres.slice(0, 2).join(" · ")
        : "Serie de TV";

    // Descripción
    const description = document.createElement("p");

    description.className = "card-description";

    description.textContent = stripHtml(show.summary);

    // Enlace
    const link = document.createElement("a");

    link.className = "card-link";

    link.href = show.url || "#";

    link.target = "_blank";

    link.rel = "noopener noreferrer";

    link.textContent = "Ver información →";

    content.append(
        title,
        meta,
        description,
        link
    );

    article.append(
        imageWrapper,
        content
    );

    return article;
}

/**
 * Renderiza las series recibidas.
 *
 * @param {HTMLElement} container
 * @param {Array} shows
 */
export function renderShows(container, shows) {
    const fragment = document.createDocumentFragment();

    shows.forEach((show) => {
        fragment.appendChild(
            createShowCard(show)
        );
    });

    container.replaceChildren(fragment);
}