import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from './Dashboard.module.css'

const cursos = [
  {
    clave: 'python',
    nombre: 'Python',
    img: '/img/python.png',
    descripcion: 'Aprende programación desde cero.',
    modulos: 12,
    porcentaje: 60,
    accion: 'Abrir Workspace',
  },
  {
    clave: 'scratch',
    nombre: 'Scratch',
    img: '/img/scratch.png',
    descripcion: 'Historias, videojuegos y animaciones.',
    modulos: 8,
    porcentaje: 40,
    accion: 'Ver módulos',
  },
  {
    clave: 'python-pro',
    nombre: 'Python Pro',
    img: '/img/python_pro.png',
    descripcion: 'Lleva tu programación al siguiente nivel.',
    modulos: 15,
    porcentaje: 25,
    accion: 'Ver módulos',
  },
  {
    clave: 'minecraft',
    nombre: 'Minecraft',
    img: '/img/minecraft.png',
    descripcion: 'Aprende creando mundos increíbles.',
    modulos: 7,
    porcentaje: 10,
    accion: 'Ver módulos',
  },
  {
    clave: 'web',
    nombre: 'Web Dev',
    img: '/img/web.svg',
    descripcion: 'Crea páginas con HTML, CSS y JavaScript.',
    modulos: 5,
    porcentaje: 20,
    accion: 'Abrir editor',
  },
]

const enlaces = [
  { icono: 'bi-house-door', texto: 'Inicio' },
  { icono: 'bi-book', texto: 'Cursos' },
  { icono: 'bi-people', texto: 'Estudiantes' },
  { icono: 'bi-file-earmark-bar-graph', texto: 'Reportes' },
  { icono: 'bi-chat-dots', texto: 'Mensajes' },
  { icono: 'bi-gear', texto: 'Configuración' },
]

function saludoPorHora() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Buenos días'
  if (hora < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Cursos')
  const [animar, setAnimar] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimar(true), 300)
    return () => clearTimeout(t)
  }, [])

  const inicial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'T'
  const claseRol = user.rol === 'admin' ? 'Administrador' : 'Tutor'

  return (
    <div className={`${styles.page} ${theme === 'light' ? styles.light : ''}`}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <i className="bi bi-mortarboard-fill"></i>
            <div>
              <h2>TUTOR'S</h2>
              <span>LEVELING</span>
            </div>
          </div>

          <nav className={styles.nav}>
            {enlaces.map((enlace, indice) => (
              <a key={enlace.texto} className={indice === 0 ? styles.active : ''}>
                <i className={`bi ${enlace.icono}`}></i>
                {enlace.texto}
              </a>
            ))}
          </nav>

          <div className={styles.perfil}>
            <div className={styles.avatar}>{inicial}</div>
            <div>
              <h4>{user.nombre}</h4>
              <span>{claseRol}</span>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.titulo}>
              <h1>{saludoPorHora()}</h1>
              <p>Panel principal del {claseRol}</p>
            </div>
            <div className={styles.acciones}>
              <button aria-label="Notificaciones">
                <i className="bi bi-bell"></i>
              </button>
              <button aria-label="Cambiar tema" onClick={toggleTheme}>
                <i className={`bi ${theme === 'light' ? 'bi-sun' : 'bi-moon'}`}></i>
              </button>
              <button aria-label="Salir" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </header>

          <section className={styles.tabs}>
            {['Cursos', 'Tareas', 'Calificaciones'].map((nombre) => (
              <a
                key={nombre}
                className={tab === nombre ? styles.active : ''}
                onClick={() => setTab(nombre)}
              >
                {nombre}
              </a>
            ))}
          </section>

          <section className={styles.cards}>
            {cursos.map((curso) => (
              <div className={styles.card} key={curso.clave}>
                <img src={curso.img} alt={curso.nombre} />
                <h3>{curso.nombre}</h3>
                <p>{curso.descripcion}</p>
                <div className={styles.progress}>
                  <div
                    className={styles.bar}
                    style={{ width: animar ? `${curso.porcentaje}%` : '0%' }}
                  ></div>
                </div>
                <div className={styles.info}>
                  <span>{curso.modulos} módulos</span>
                  <span>{curso.porcentaje}%</span>
                </div>
                <button onClick={() => navigate(`/courses/${curso.clave}`)}>
                  {curso.accion}
                </button>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  )
}
