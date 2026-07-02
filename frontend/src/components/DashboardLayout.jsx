import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from '../pages/Dashboard.module.css'

const enlaces = [
  { icono: 'bi-house-door', texto: 'Inicio', ruta: '/dashboard' },
  { icono: 'bi-people', texto: 'Estudiantes', ruta: '/estudiantes' },
  { icono: 'bi-file-earmark-bar-graph', texto: 'Reportes', ruta: '/reportes' },
  { icono: 'bi-chat-dots', texto: 'Mensajes', ruta: '/mensajes' },
  { icono: 'bi-gear', texto: 'Configuración', ruta: '/configuracion' },
]

export default function DashboardLayout({ titulo, subtitulo, children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const inicial = user?.nombre ? user.nombre.charAt(0).toUpperCase() : 'T'
  const claseRol = user?.rol === 'admin' ? 'Administrador' : 'Tutor'

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
            {enlaces.map((enlace) => (
              <a
                key={enlace.texto}
                className={location.pathname === enlace.ruta ? styles.active : ''}
                onClick={() => navigate(enlace.ruta)}
              >
                <i className={`bi ${enlace.icono}`}></i>
                {enlace.texto}
              </a>
            ))}
          </nav>

          <div className={styles.perfil}>
            <div className={styles.avatar}>{inicial}</div>
            <div>
              <h4>{user?.nombre}</h4>
              <span>{claseRol}</span>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.titulo}>
              <h1>{titulo}</h1>
              <p>{subtitulo}</p>
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

          {children}
        </main>
      </div>
    </div>
  )
}
