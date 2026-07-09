import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../utils/api'
import PythonWorkspace from '../courses/python/PythonWorkspace'
import PythonPro from '../courses/python-pro/PythonPro'
import WebEditor from '../courses/web/WebEditor'
import ScratchCourse from '../courses/scratch/ScratchCourse'
import MinecraftCourse from '../courses/minecraft/MinecraftCourse'
import styles from './StudentView.module.css'

const componentes = {
  python: PythonWorkspace,
  python_pro: PythonPro,
  web: WebEditor,
  scratch: ScratchCourse,
  minecraft: MinecraftCourse,
}

export default function StudentView() {
  const { codigo } = useParams()
  const [estado, setEstado] = useState('cargando')
  const [modulo, setModulo] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    let activo = true
    fetch(`${API_URL}/student_link/${codigo}`)
      .then((r) => r.json())
      .then((datos) => {
        if (!activo) return
        if (datos.success && componentes[datos.module]) {
          setModulo(datos.module)
          setEstado('ok')
        } else {
          setMensaje(datos.message || 'Este enlace no es válido o expiró.')
          setEstado('error')
        }
      })
      .catch(() => {
        if (!activo) return
        setMensaje('No se pudo conectar con el servidor.')
        setEstado('error')
      })
    return () => {
      activo = false
    }
  }, [codigo])

  if (estado === 'cargando') {
    return <div className={styles.centro}>Cargando…</div>
  }

  if (estado === 'error') {
    return (
      <div className={styles.centro}>
        <i className="bi bi-link-45deg"></i>
        <h2>Enlace no disponible</h2>
        <p>{mensaje}</p>
      </div>
    )
  }

  const Curso = componentes[modulo]
  return <Curso studentMode />
}
