import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setCargando(true)
    try {
      const resultado = await login(usuario, password)
      if (resultado.success) {
        navigate('/dashboard')
      } else {
        setError(resultado.mensaje || 'No se pudo iniciar sesión')
      }
    } catch {
      setError('Error en el servidor')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <img src="/img/logo.png" className={styles.logo} alt="Kodland" />

        <div className={styles.slider}>
          <img src="/img/laptop.png" className={styles.illustration} alt="" />
          <h2>Programa en el navegador</h2>
          <p>
            ¡La plataforma online te permite crear un juego directamente en esta
            ventana!
          </p>
          <div className={styles.dots}>
            <span className={styles.active}></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.login}>
          <h1>Hola Tutor!</h1>

          <form onSubmit={manejarEnvio}>
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <a href="#" className={styles.forgot}>
              ¿Olvidaste tu usuario o contraseña?
            </a>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className={styles.separator}>
            <span></span>
            <p>o</p>
            <span></span>
          </div>

          <p className={styles.socialText}>Inicia sesión con redes sociales</p>

          <div className={styles.social}>
            <i className="bi bi-google"></i>
            <i className="bi bi-facebook"></i>
            <i className="bi bi-github"></i>
            <i className="bi bi-apple"></i>
          </div>

          <div className={styles.register}>
            ¿No tienes una cuenta? <a href="#">Crear una cuenta</a>
          </div>
        </div>
      </div>
    </div>
  )
}
