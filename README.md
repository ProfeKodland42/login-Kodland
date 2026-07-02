# Kodland Leveling

Plataforma de prácticas de Kodland: login por rol (tutor/estudiante/admin), dashboard de
cursos y workspaces por curso. En migración del frontend a React (Vite) consumiendo el
backend Flask existente.

## Estructura

```
login-Kodland/
├── backend/            Backend Flask + SQLite (fuente de verdad de auth y datos)
│   ├── main.py         Rutas: /, /login, /dashboard, /python, /admin, /ejecutar
│   ├── database.py     Acceso a la BD
│   ├── create_db.py    Crea leveling.db y siembra usuarios
│   ├── leveling.db     SQLite (tabla usuarios: usuario/password/rol)
│   ├── static/         CSS, JS e imágenes del frontend actual (vanilla)
│   └── templates/      Vistas Jinja actuales (login, dashboard, python, admin)
├── frontend/           App React (Vite) — migración en curso
├── legacy/
│   └── web-course/     Snapshot del curso Web Dev (IDE Monaco) del repo viejo,
│                       pendiente de migrar a @monaco-editor/react
├── .gitignore
└── README.md
```

## Correr el backend

Requiere Python 3.11+ con `flask` y `requests`.

```bash
cd backend
python create_db.py     # solo la primera vez, crea y siembra leveling.db
python main.py          # http://127.0.0.1:5000
```

## Correr el frontend (React)

```bash
cd frontend
npm install
npm run dev
```

## Migración a React

El backend Flask se mantiene y React solo lo consume (no se reescribe). El frontend
vanilla en `backend/templates` + `backend/static` se irá reemplazando curso por curso
por la app de `frontend/`. El curso Web Dev de `legacy/web-course/` se migrará a
`@monaco-editor/react`.
