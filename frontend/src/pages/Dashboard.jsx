import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
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
    accion: 'Abrir IDE',
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

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [animar, setAnimar] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimar(true), 300)
    return () => clearTimeout(t)
  }, [])

  const claseRol = user.rol === 'admin' ? 'Administrador' : 'Tutor'
  const saludo = (() => {
    const hora = new Date().getHours()
    if (hora < 12) return 'Buenos días'
    if (hora < 18) return 'Buenas tardes'
    return 'Buenas noches'
  })()

  return (
    <DashboardLayout titulo={saludo} subtitulo={`Panel principal del ${claseRol}`}>
      <section className={styles.tabs}>
        <a className={styles.active}>Cursos</a>
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
    </DashboardLayout>
  )
}
