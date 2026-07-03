# Kodland Leveling

Plataforma web educativa para clases de programación para niños. Centraliza el inicio de
sesión por roles (admin / tutor), el panel de cursos y los entornos de práctica de cada
curso (Python, Web Dev, y en camino Scratch, Python Pro y Minecraft).

Está pensada para **clases demostrativas**: el tutor elige el curso más afín al niño y le
muestra, en el momento, un entorno real donde programar desde el navegador, sin instalar
nada.

## Cómo está organizado

El proyecto tiene dos partes que se integran:

- **`backend/`** — API en **Flask + SQLite**. Maneja el login, los usuarios/roles y la
  ejecución de código Python. Es la fuente de verdad de la autenticación.
- **`frontend/`** — Interfaz en **React (Vite)**. Es la UI activa; consume el backend.

```
login-Kodland/
├── backend/
│   ├── main.py            Rutas Flask (login, ejecución de código, vistas)
│   ├── create_db.py       Crea leveling.db y siembra usuarios (correr 1 vez)
│   ├── requirements.txt   Dependencias Python (Flask, requests)
│   ├── leveling.db        SQLite — tabla usuarios (usuario / password / rol)
│   ├── static/            CSS, JS e imágenes de la UI vieja (vanilla, legacy)
│   └── templates/         Vistas Jinja de la UI vieja (legacy)
├── frontend/
│   ├── src/
│   │   ├── pages/         Login, Dashboard, EnConstruccion
│   │   ├── components/    DashboardLayout, ProtectedRoute
│   │   ├── context/       AuthContext (sesión), ThemeContext (claro/oscuro + temas)
│   │   ├── courses/       Editores por curso (python, web) y estructura para el resto
│   │   └── styles/        Variables de tema y paletas por curso
│   └── vite.config.js     Proxy a Flask en desarrollo
├── .gitignore
└── README.md
```

## Requisitos

- **Python 3.11+**
- **Node.js 18+** (para el frontend)

## Cómo correr el proyecto

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

Entra a **http://localhost:5173**. El login habla con el backend automáticamente (Vite lo
enruta por proxy, sin configuración extra).

## Rutas del backend

| Ruta | Método | Qué hace |
|------|--------|----------|
| `/login` | POST | Valida usuario/contraseña contra la BD y devuelve rol y nombre |
| `/ejecutar` | POST | Ejecuta código Python (servicio remoto) y devuelve la salida |
| `/`, `/dashboard`, `/python`, `/admin`, `/python_pro` | GET | Vistas HTML de la UI vieja (legacy) |

La app de React usa el backend **solo como API** (`/login` y `/ejecutar`). Las vistas HTML
(`/dashboard`, `/python`, etc.) son la interfaz antigua en Jinja, que se va reemplazando
por React.

## La app de React (frontend)

- **Login** conectado al backend, con sesión persistida.
- **Dashboard** (panel del tutor) con las tarjetas de cursos y menú lateral navegable.
- **Cursos funcionales:**
  - **Python** — editor Monaco + ejecución de código y consola.
  - **Web Dev** — editor HTML/CSS/JS con vista previa en vivo y validación de retos.
- **Modo claro/oscuro** persistente y **paleta de color por curso**.
- Secciones **Estudiantes / Reportes / Mensajes / Configuración**: en construcción.

## Usuarios de prueba

Los usuarios se siembran en `backend/create_db.py`. Ejemplos:

- **Admin:** usuario `admin`, contraseña `Admin2026`.
- **Tutor:** usuario `jrivera`, contraseña `Julian123`.

> Nota de seguridad: hoy las contraseñas están en texto plano en la base de datos y en
> `create_db.py`. Antes de un uso real hay que encriptarlas (hashing).

## Trabajo en equipo

Proyecto colaborativo. El backend (Flask, login, BD, ejecución de código) y el frontend
(React) se desarrollan en paralelo sobre este mismo repo. Para actualizar: `git pull` en
`main`, luego `pip install -r requirements.txt` (backend) y `npm install` (frontend) si
cambiaron dependencias.

## Próximos pasos

- Ejecución de Python 100% en el navegador (para `input()` interactivo).
- Vista diferenciada para estudiantes.
- Migrar los cursos de Scratch, Python Pro y Minecraft a React.
- Encriptar contraseñas (seguridad del login).
