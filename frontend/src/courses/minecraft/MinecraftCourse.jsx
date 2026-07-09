import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './MinecraftCourse.module.css'

const proyectos = {
  house: {
    titulo: 'Starter House',
    icono: 'bi-house-door-fill',
    img: '/img/house.png',
    nivel: 1,
    dificultad: 'Fácil',
    duracion: '10 minutos',
    descripcion:
      'Aprende a construir tu primera casa.',
    conceptos: ['Bloques', 'Crafting'],
    practica: 'https://studio.code.org/es/courses/mc/units/1/lessons/1/levels/6',
  },
  bridge: {
    titulo: 'Atrapa el pez',
    icono: 'bi-signpost-fill',
    img: '/img/pez.jpeg',
    nivel: 2,
    dificultad: 'Fácil',
    duracion: '10 minutos',
    descripcion:
      'Atrapa el pez tropical.',
    conceptos: ['Bucles', 'Condiciones', 'Logica'],
    practica: 'https://studio.code.org/es/courses/aquatic/units/1/lessons/1/levels/8',
  },
  castle: {
    titulo: 'Bot constructor',
    icono: 'bi-bank',
    img: '/img/bot.jpeg',
    nivel: 3,
    dificultad: 'Media',
    duracion: '10 minutos',
    descripcion:
      'Aprende a construir usando el Bot de minecraft, ayuda a steve!!',
    conceptos: ['bot', 'construcción', 'automatizacion'],
    practica: 'https://studio.code.org/es/courses/hero/units/1/lessons/1/levels/7',
  },
  redstone: {
    titulo: 'Funciones ¿Que es eso?',
    icono: 'bi-lightning-charge-fill',
    img: '/img/funciones.png',
    nivel: 4,
    dificultad: 'Difícil',
    duracion: '8 minutos',
    descripcion:
      'Aprendamos funciones y usemos de nuevo el bot.',
    conceptos: ['Funciones', 'Bucles', 'Automatizacion', 'Logica'],
    practica: 'https://studio.code.org/es/courses/hero/units/1/lessons/1/levels/10',
  },

}

export default function MinecraftCourse({ studentMode }) {
  const [actual, setActual] = useState('house')
  const data = proyectos[actual]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.logo}>
          <h2>Tutor's Leveling</h2>
          <span>Minecraft Studio</span>
        </div>
        <nav className={styles.nav}>
          <span>Projects</span>
          <span>Gallery</span>
          <span>Education</span>
          <span>Help</span>
        </nav>
        {!studentMode && (
          <Link to="/dashboard" className={styles.back}>
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
        )}
      </header>

      <main className={styles.workspace}>
        <aside className={styles.explorer}>
          <div className={styles.panelTitle}>PROJECTS</div>
          <ul className={styles.projectList}>
            {Object.entries(proyectos).map(([clave, p]) => (
              <li
                key={clave}
                className={`${styles.project} ${
                  actual === clave ? styles.active : ''
                }`}
                onClick={() => setActual(clave)}
              >
                <i className={`bi ${p.icono}`}></i>
                {p.titulo}
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.viewer}>
          <div className={styles.viewerHeader}>
            <i className="bi bi-image"></i> Preview
          </div>
          <div className={styles.viewerImage}>
            <img className={styles.image} src={data.img} alt={data.titulo} />
          </div>
        </section>

        <aside className={styles.info}>
          <div className={styles.panelTitle}>INFORMATION</div>
          <div className={styles.infoCard}>
            <h3>{data.titulo}</h3>
            <p>{data.descripcion}</p>
            <hr />
            <strong>Dificultad</strong>
            <div className={styles.dificultad}>
              {Array.from({ length: data.nivel }).map((_, i) => (
                <i key={i} className="bi bi-star-fill"></i>
              ))}
              <span>{data.dificultad}</span>
            </div>
            <strong>Duración</strong>
            <p>{data.duracion}</p>
            <strong>Conceptos</strong>
            <ul>
              {data.conceptos.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <hr />
            <h4>¿Listo para practicar?</h4>
            <p>Aprende a programar con esta actividad de Minecraft en code.org.</p>
            <a
              className={styles.practiceBtn}
              href={data.practica}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-box-arrow-up-right"></i> Ir a la actividad
            </a>
          </div>
        </aside>
      </main>

      <footer className={styles.statusBar}>Minecraft Education Studio</footer>
    </div>
  )
}
