const API_BASE_URL = "https://api.tvmaze.com";

/**
 * Obtiene una página completa de series desde TVMaze.
 *
 * La API utiliza páginas comenzando desde 0.
 *
 * @param {number} page - Página de la API.
 * @returns {Promise<Array>} Lista de series.
 */
export async function getShows(page = 0) {
    const response = await fetch(`${API_BASE_URL}/shows?page=${page}`);

    if (!response.ok) {
        throw new Error(
            `La API respondió con el estado ${response.status}.`
        );
    }

    return await response.json();
}