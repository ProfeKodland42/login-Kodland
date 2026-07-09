import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { API_URL } from '../utils/api'
import styles from './Estudiantes.module.css'

const cursos = [
  { clave: 'python', nombre: 'Python' },
  { clave: 'python_pro', nombre: 'Python Pro' },
  { clave: 'web', nombre: 'Web Dev' },
  { clave: 'scratch', nombre: 'Scratch' },
  { clave: 'minecraft', nombre: 'Minecraft' },
]

export default function Estudiantes() {
  const [modulo, setModulo] = useState('python')
  const [enlace, setEnlace] = useState('')
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')
  const [copiado, setCopiado] = useState(false)

  async function generar() {
    setGenerando(true)
    setError('')
    setEnlace('')
    setCopiado(false)
    try {
      const respuesta = await fetch(`${API_URL}/generate_link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: modulo }),
      })
      const datos = await respuesta.json()
      if (datos.success) {
        setEnlace(`${window.location.origin}/student/${datos.code}`)
      } else {
        setError(datos.message || 'No se pudo generar el enlace.')
      }
    } catch {
      setError('No se pudo conectar con el servidor.')
    } finally {
      setGenerando(false)
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      setError('No se pudo copiar. Copia el enlace manualmente.')
    }
  }

  return (
    <DashboardLayout
      titulo="Estudiantes"
      subtitulo="Genera enlaces de acceso a un curso"
    >
      <div className={styles.panel}>
        <h3>Generar enlace para un estudiante</h3>
        <p className={styles.ayuda}>
          Elige un curso y comparte el enlace. El estudiante entra directo al
          curso, sin cuenta. El enlace expira en 1 hora.
        </p>

        <div className={styles.controles}>
          <select value={modulo} onChange={(e) => setModulo(e.target.value)}>
            {cursos.map((curso) => (
              <option key={curso.clave} value={curso.clave}>
                {curso.nombre}
              </option>
            ))}
          </select>
          <button onClick={generar} disabled={generando}>
            {generando ? 'Generando…' : 'Generar enlace'}
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {enlace && (
          <div className={styles.resultado}>
            <input readOnly value={enlace} onFocus={(e) => e.target.select()} />
            <button onClick={copiar}>{copiado ? 'Copiado' : 'Copiar'}</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
