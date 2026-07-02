# legacy/web-course

Snapshot del curso **Web Dev** traído del repo `kodland-practice` (Flask). Es un IDE
educativo con Monaco Editor, preview en vivo (HTML/CSS/JS) y validación de retos
client-side. Se conserva aquí como referencia para la migración a React (Vite).

## Estado

Solo referencia. **No está cableado a `main.py`** del repo nuevo a propósito: así la
app existente (login, dashboard, Python) sigue corriendo sin cambios. La integración
real ocurre en la migración a `@monaco-editor/react` (Paso 3 del plan).

## Contenido

- `routes/editor.py` — blueprint Flask que sirve la página del IDE (`/editor/`).
- `routes/api.py` — sirve el reto como JSON (`/api/challenge/html/1`).
- `templates/editor/index.html` — layout del IDE (toolbar, sidebar con objetivos,
  editor, preview, consola). Carga Monaco estático desde `static/monaco/min/vs`.
- `templates/base.html` — layout base del que hereda el IDE.
- `templates/editor/components/` — fragmentos de una versión anterior del IDE (no los
  usa `index.html`; se conservan para historial).
- `static/js/editor.js` — instancia Monaco, tabs de archivo, arma el `srcdoc` del
  preview y dispara la validación en cada cambio.
- `static/js/validator.js` — hace `fetch` al reto, parsea el HTML con `DOMParser` y
  compara contra los `objetivos` para marcar progreso.
- `static/js/` (storage, files, tabs, ui) — stubs; la lógica real vive en
  `editor.js` y `validator.js`.
- `static/css/` — estilos del IDE.
- `static/monaco/` — distribución de Monaco Editor (servida estática, sin bundling).
- `challenges/html/modulo1.json` — reto del Módulo 1 (objetivos: h1, p, button).

## Qué migrar a React (Paso 3 / 5)

- El editor a `@monaco-editor/react` conservando el split view editor/preview.
- El preview en vivo por `srcdoc` y el botón "Vista previa" (abrir en ventana).
- La validación de retos leyendo el JSON de objetivos.
