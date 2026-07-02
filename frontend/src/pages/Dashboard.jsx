import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import styles from './Dashboard.module.css'

const cursos = [
  { clave: 'minecraft', nombre: 'Minecraft' },
  { clave: 'scratch', nombre: 'Scratch' },
  { clave: 'python', nombre: 'Python' },
  { clave: 'python-pro', nombre: 'Python Pro' },
  { clave: 'web', nombre: 'Web Dev' },
]

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={styles.pagina}>
      <header className={styles.barra}>
        <span className={styles.marca}>Kodland</span>
        <div className={styles.acciones}>
          <button className={styles.tema} onClick={toggleTheme}>
            {theme === 'dark' ? 'Claro' : 'Oscuro'}
          </button>
          <span className={styles.nombre}>{user.nombre}</span>
          <button className={styles.salir} onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        <h1 className={styles.titulo}>Cursos</h1>
        <div className={styles.grilla}>
          {cursos.map((curso) => (
            <article
              key={curso.clave}
              className={styles.tarjeta}
              data-course={curso.clave}
            >
              <h2>{curso.nombre}</h2>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
