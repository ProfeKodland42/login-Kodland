# Kodland Leveling

Plataforma web educativa para clases de programación para niños. Centraliza el inicio de
sesión por roles (admin / tutor), el panel de cursos y los entornos de práctica de cada
curso: **Python, Python Pro, Web Dev, Scratch y Minecraft**.

Está pensada para **clases demostrativas**: el tutor elige el curso más afín al niño y le
muestra, en el momento, un entorno real donde programar desde el navegador, sin instalar
nada.

## Cómo está organizado

El proyecto tiene dos partes que se integran:

- **`frontend/`** — Interfaz en **React (Vite)**. Es la UI activa y donde ocurre casi todo.
- **`backend/`** — API en **Flask + SQLite**. Su única función activa hoy es el **login**
  (usuarios y roles).

> Dato importante: el curso de Python corre **en el navegador con Pyodide**, así que la
> ejecución de código **no depende del backend**. Lo único que la app de React necesita del
> backend es el login.

```
login-Kodland/
├── backend/
│   ├── main.py            Rutas Flask (login + vistas legacy)
│   ├── create_db.py       Crea leveling.db y siembra usuarios (correr 1 vez)
│   ├── requirements.txt   Dependencias (Flask, requests, flask-cors, gunicorn)
│   ├── leveling.db        SQLite — tabla usuarios (usuario / password / rol)
│   ├── static/            CSS/JS/imágenes de la UI vieja en HTML (legacy)
│   └── templates/         Vistas Jinja de la UI vieja (legacy)
├── frontend/
│   ├── src/
│   │   ├── pages/         Login, Dashboard, EnConstruccion
│   │   ├── components/    DashboardLayout, ProtectedRoute
│   │   ├── context/       AuthContext (sesión), ThemeContext (claro/oscuro + temas)
│   │   ├── courses/       Un curso por carpeta: python, python-pro, web, scratch, minecraft
│   │   ├── hooks/         usePythonRunner (terminal Python interactiva)
│   │   ├── utils/         pyodideRunner (ejecuta Python), progreso (avance por curso)
│   │   └── styles/        Variables de tema y paletas por curso
│   ├── vite.config.js     Proxy a Flask en desarrollo
│   ├── vercel.json        Rewrites para el routing de la SPA (deploy)
│   └── .env.example       Documenta VITE_API_URL
├── .gitignore
└── README.md
```

## Requisitos

- **Python 3.11+**
- **Node.js 18+**

## Cómo correr el proyecto (local)

Hay que levantar **las dos partes a la vez**, en dos terminales.

### 1) Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python create_db.py     # solo la primera vez: crea y siembra leveling.db
python main.py          # queda corriendo en http://127.0.0.1:5000
```

> La base de datos siempre se crea y se lee dentro de `backend/`, sin importar desde qué
> carpeta ejecutes el comando.

### 2) Frontend (React)

En **otra** terminal:

```bash
cd frontend
npm install
npm run dev             # abre en http://localhost:5173
```

Entra a **http://localhost:5173**. En local el login habla con el backend por el proxy de
Vite (sin configuración extra).

## Los cursos (frontend React)

- **Python** — editor Monaco que corre **en el navegador con Pyodide**. `input()` es
  interactivo (se escribe en la terminal, salida en vivo). No usa el backend.
- **Python Pro** — IDE estilo VS Code (explorer con proyectos, editor, terminal). También
  corre con Pyodide.
- **Web Dev** — editor HTML/CSS/JS con **vista previa en vivo** y validación de retos.
- **Scratch** — reproductor de proyectos embebido (TurboWarp) + botón para abrir el editor
  completo en otra pestaña. *(El editor embebido requeriría self-host — ver próximos pasos.)*
- **Minecraft** — galería de proyectos con info y enlace a actividades reales de code.org.

Además: **login** por rol, **dashboard** con menú lateral, **modo claro/oscuro** persistente
y **paleta de color por curso**. Secciones Estudiantes / Reportes / Mensajes / Configuración:
en construcción.

## Rutas del backend

| Ruta | Método | Qué hace |
|------|--------|----------|
| `/login` | POST | Valida usuario/contraseña y devuelve rol y nombre. **Lo único que usa React.** |
| `/ejecutar` | POST | Ejecuta Python vía servicio externo (paiza). **Legacy: React ya no lo usa (usa Pyodide).** |
| `/`, `/dashboard`, `/python`, `/admin`, `/python_pro`, `/minecraft` | GET | Vistas HTML de la UI vieja (legacy). |

> Abrir la URL del backend en el navegador muestra la **UI vieja de Flask**, no la app de
> React. La app real es el frontend (Vercel). Las vistas legacy siguen ahí por compatibilidad.

## Usuarios de prueba

Se siembran en `backend/create_db.py`. Ejemplos:

- **Admin:** usuario `admin`, contraseña `Admin2026`.
- **Tutor:** usuario `jrivera`, contraseña `Julian123`.

> Seguridad: hoy las contraseñas están en texto plano. Antes de un uso real hay que
> encriptarlas (hashing).

## Despliegue

Se despliega en dos servicios:

| Parte | Servicio | Configuración |
|-------|----------|---------------|
| **frontend/** | **Vercel** | Root Directory: `frontend`. Env var: `VITE_API_URL` = URL del backend en Render. |
| **backend/** | **Render** | Root Directory: `backend`. Build: `pip install -r requirements.txt && python create_db.py`. Start: `gunicorn main:app`. Sin variables de entorno. |

Notas:
- El frontend usa `VITE_API_URL` para saber a qué backend llamar en producción (en local usa
  el proxy). Ver `frontend/.env.example`.
- El backend tiene **CORS** habilitado para permitir las llamadas desde Vercel.
- En Render (plan free) el backend se **duerme** tras inactividad: el primer login tarda unos
  segundos. La BD SQLite se re-siembra en cada deploy (los usuarios de prueba siempre están).

## Trabajo en equipo

Proyecto colaborativo sobre este mismo repo (`main`). Para actualizar:

```bash
git pull                       # traer lo del equipo
# ...trabajar...
git add -A && git commit -m "..."
git push
```

Si cambiaron dependencias, `pip install -r requirements.txt` (backend) y `npm install`
(frontend).

## Próximos pasos

- **Scratch:** editor embebido de verdad (self-host de scratch-gui/TurboWarp).
- **Vista de estudiante** (hoy tutor y estudiante ven lo mismo).
- **Encriptar contraseñas** (hashing) y restringir CORS al dominio del frontend.
- Guardar el avance de los cursos en el backend (hoy es local, en el navegador).
