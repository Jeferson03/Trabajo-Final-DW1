# CineWave — Catálogo de Series

Proyecto de aula para la asignatura **Desarrollo Web 1**, evaluación 3-4.

CineWave es una aplicación web desarrollada con **HTML, CSS y JavaScript Vanilla** que permite explorar un catálogo de series de televisión obtenido dinámicamente desde una **API REST pública**.

La aplicación implementa tarjetas generadas mediante JavaScript, programación asíncrona, consumo de API REST, organización modular y un sistema de paginación propio.

---

## Autor

**Jeferson Garcia Angel**

## Asignatura

**Desarrollo Web 1**

## Periodo

**2026-01**

---

# Objetivo del proyecto

El objetivo es aplicar los conocimientos adquiridos durante el curso sobre:

* Manipulación del DOM.
* Consumo de APIs REST.
* Solicitudes HTTP mediante `fetch()`.
* Programación asíncrona con `async/await`.
* Creación dinámica de elementos HTML.
* Componentes reutilizables.
* Paginación.
* Organización modular de JavaScript.
* Diseño responsive con HTML y CSS.
* Manejo de errores.

---

# API utilizada

El proyecto utiliza **TVMaze API**, una API REST pública que proporciona información sobre series de televisión.

Documentación oficial:

https://www.tvmaze.com/api

El endpoint utilizado es:

```text
https://api.tvmaze.com/shows?page={numero}
```

Por ejemplo:

```text
https://api.tvmaze.com/shows?page=0
```

La API utiliza una numeración de páginas que comienza en `0`.

---

# Funcionamiento de la aplicación

Cuando se inicia la aplicación, JavaScript realiza una solicitud HTTP GET a TVMaze mediante `fetch()`.

El flujo general es:

```text
Usuario
   │
   ▼
index.html
   │
   ▼
main.js
   │
   ▼
api.js
   │
   ▼
TVMaze API
   │
   ▼
Respuesta JSON
   │
   ▼
main.js
   │
   ▼
ui.js
   │
   ▼
Tarjetas generadas dinámicamente
```

La información obtenida de la API se utiliza para construir las tarjetas de las series.

Cada tarjeta contiene:

* Imagen o póster.
* Título.
* Año de estreno.
* Géneros.
* Descripción.
* Enlace hacia la información de la serie en TVMaze.

---

# Sistema de paginación

Una de las características principales del proyecto es que se implementan **dos niveles de paginación**.

## 1. Paginación de la API

TVMaze organiza sus resultados mediante páginas.

Por ejemplo:

```text
API page=0
       │
       └── hasta 250 series

API page=1
       │
       └── siguientes series

API page=2
       │
       └── siguientes series
```

La aplicación solicita estas páginas solamente cuando necesita más información.

---

## 2. Paginación de CineWave

Aunque la API puede devolver hasta 250 resultados por página, la aplicación muestra solamente **10 tarjetas por página** para facilitar la navegación.

Por ejemplo:

```text
Página 1 → series 1 - 15
Página 2 → series 16 - 30
Página 3 → series 31 - 45
```

Cuando el usuario llega al final de los resultados que ya fueron obtenidos desde la API, la aplicación solicita automáticamente la siguiente página de TVMaze.


# Estructura del proyecto

```text
Proyecto_CineWave/
│
├── index.html
├── styles.css
├── README.md
├── .gitignore
│
└── js/
    ├── api.js
    ├── main.js
    └── ui.js
```

---

# Descripción de los archivos

## `index.html`

Contiene la estructura principal de la aplicación.

El HTML define:

* Encabezado.
* Nombre del proyecto.
* Contenedor del catálogo.
* Indicador de carga.
* Mensajes de error.
* Botones de paginación.
* Pie de página.

Las tarjetas **no están escritas directamente en HTML**.

El contenedor inicialmente está vacío:

```html
<section
    id="catalog"
    class="catalog-grid"
    aria-label="Catálogo de series">
</section>
```

Las tarjetas son creadas posteriormente mediante JavaScript.

---

## `styles.css`

Contiene todos los estilos visuales de la aplicación.

Incluye:

* Diseño tipo plataforma de streaming.
* Sistema de tarjetas.
* Diseño responsive.
* Botones de navegación.
* Indicador de carga.
* Mensajes de error.
* Adaptación para dispositivos móviles.
* Efectos visuales al pasar el cursor sobre las tarjetas.

---

## `js/api.js`

Es el módulo encargado de la comunicación con la API.

Contiene la función:

```javascript
getShows(page)
```

Esta función realiza la solicitud HTTP mediante:

```javascript
fetch()
```

y utiliza:

```javascript
async/await
```

para obtener los resultados.

---

## `js/ui.js`

Este módulo contiene las funciones relacionadas con la interfaz.

Su función principal es:

```javascript
createShowCard(show)
```

Esta función recibe la información de una serie y construye dinámicamente una tarjeta HTML utilizando el DOM.

También contiene:

```javascript
renderShows(container, shows)
```

que se encarga de insertar las tarjetas generadas dentro del catálogo.

---

## `js/main.js`

Es el módulo principal de la aplicación.

Se encarga de:

* Controlar el estado de la aplicación.
* Obtener información de `api.js`.
* Controlar la paginación.
* Determinar qué 10 resultados mostrar.
* Solicitar nuevas páginas a la API cuando es necesario.
* Actualizar los botones.
* Actualizar el indicador de página.
* Controlar el estado de carga.
* Manejar errores.
* Coordinar `api.js` y `ui.js`.

Las principales variables utilizadas son:

```javascript
const ITEMS_PER_PAGE = 15;

let allShows = [];

let currentPage = 0;

let currentApiPage = 0;

let apiFinished = false;
```

---

# Requisitos

Para ejecutar el proyecto se necesita:

* Un navegador moderno:

  * Google Chrome.
  * Microsoft Edge.
  * Mozilla Firefox.
* Conexión a Internet.
* Un servidor local.

No es necesario instalar librerías externas ni ejecutar `npm install`.

---

# Instrucciones de ejecución

## Opción 1 — Visual Studio Code + Live Server

### 1. Descargar el proyecto

Descomprimir el archivo del proyecto.

### 2. Abrir el proyecto

Abrir la carpeta:

```text
Proyecto_CineWave
```

en Visual Studio Code.

### 3. Instalar Live Server

Si no está instalado, instalar la extensión **Live Server** de Visual Studio Code.

### 4. Ejecutar

Abrir:

```text
index.html
```

Hacer clic derecho sobre el archivo y seleccionar:

```text
Open with Live Server
```

El navegador abrirá automáticamente la aplicación.

### 5. Comprobar la aplicación

Verificar que:

1. Se carguen las series.
2. Aparezcan 15 tarjetas.
3. Se muestre `Página 1`.
4. El botón **Siguiente** funcione.
5. La página cambie a `Página 2`.
6. Se muestren las siguientes 15 series.
7. El botón **Anterior** permita regresar.
8. Las tarjetas sean diferentes entre las páginas.

---



# Tecnologías utilizadas

| Tecnología      | Uso                           |
| --------------- | ----------------------------- |
| HTML5           | Estructura de la aplicación   |
| CSS3            | Diseño y estilos              |
| JavaScript ES6+ | Lógica de la aplicación       |
| Fetch API       | Solicitudes HTTP              |
| Async/Await     | Programación asíncrona        |
| DOM API         | Creación dinámica de tarjetas |
| TVMaze API      | Fuente de información         |
| ES Modules      | Organización modular          |

---


# Manejo de errores

La aplicación cuenta con manejo de errores mediante `try/catch`.

Si ocurre algún problema durante la solicitud:

```javascript
try {
    // Solicitud a la API
} catch (error) {
    // Manejo del error
}
```

se muestra un mensaje al usuario indicando que no fue posible cargar el catálogo.

Esto evita que la aplicación quede completamente inutilizable cuando existe un problema de conexión o la API no responde correctamente.

---

# Flujo de paginación

El funcionamiento completo puede resumirse así:

```text
INICIO
  │
  ▼
Solicitar API page=0
  │
  ▼
Guardar resultados en allShows
  │
  ▼
Mostrar resultados 1-10
  │
  ▼
Usuario pulsa "Siguiente"
  │
  ▼
¿Hay suficientes resultados almacenados?
  │
  ├── SÍ ──► Mostrar siguientes 10
  │
  └── NO
        │
        ▼
   Solicitar siguiente página API
        │
        ▼
   Agregar resultados a allShows
        │
        ▼
   Mostrar siguientes 10
        │
        ▼
      Repetir
```

Esta estrategia permite mostrar una cantidad pequeña de tarjetas por página sin descartar los resultados restantes proporcionados por la API.

---


# Créditos

**API utilizada:** TVMaze

Documentación:

https://www.tvmaze.com/api

**Proyecto académico:** Desarrollo Web 1 — 2026-01

**Autor:** Jeferson Garcia Angel
