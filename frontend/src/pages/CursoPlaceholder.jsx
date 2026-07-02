import { useParams, useNavigate } from 'react-router-dom'
import styles from './CursoPlaceholder.module.css'

const nombres = {
  python: 'Python',
  scratch: 'Scratch',
  'python-pro': 'Python Pro',
  minecraft: 'Minecraft',
  web: 'Web Dev',
}

export default function CursoPlaceholder() {
  const { clave } = useParams()
  const navigate = useNavigate()
  const nombre = nombres[clave] || 'Curso'

  return (
    <div className={styles.page} data-course={clave}>
      <div className={styles.tarjeta}>
        <span className={styles.etiqueta}>{nombre}</span>
        <h1>Próximamente</h1>
        <p>Este curso se está migrando a la nueva plataforma.</p>
        <button onClick={() => navigate('/dashboard')}>Volver al panel</button>
      </div>
    </div>
  )
}
