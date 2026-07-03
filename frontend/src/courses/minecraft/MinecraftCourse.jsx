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
    duracion: '15 minutos',
    descripcion:
      'Aprende a construir tu primera casa utilizando madera, piedra y vidrio. Ideal para comenzar en el modo supervivencia.',
    conceptos: ['Bloques', 'Crafting', 'Puertas', 'Ventanas'],
    practica: 'https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1',
  },
  bridge: {
    titulo: 'Wooden Bridge',
    icono: 'bi-signpost-fill',
    img: '/img/bridge.png',
    nivel: 2,
    dificultad: 'Fácil',
    duracion: '20 minutos',
    descripcion:
      'Construye un puente de madera para conectar dos zonas del mapa.',
    conceptos: ['Simetría', 'Escaleras', 'Losas', 'Decoración'],
    practica: 'https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1',
  },
  castle: {
    titulo: 'Medieval Castle',
    icono: 'bi-bank',
    img: '/img/castle.png',
    nivel: 3,
    dificultad: 'Media',
    duracion: '60 minutos',
    descripcion:
      'Aprende a levantar un castillo medieval utilizando piedra, murallas y torres.',
    conceptos: ['Murallas', 'Torres', 'Decoración', 'Escalas'],
    practica: 'https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1',
  },
  redstone: {
    titulo: 'Redstone Door',
    icono: 'bi-lightning-charge-fill',
    img: '/img/redstone.png',
    nivel: 4,
    dificultad: 'Difícil',
    duracion: '45 minutos',
    descripcion:
      'Automatiza una puerta utilizando Redstone, palancas y pistones.',
    conceptos: ['Redstone', 'Pistones', 'Palancas', 'Circuitos'],
    practica: 'https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1',
  },
  farm: {
    titulo: 'Automatic Farm',
    icono: 'bi-tree-fill',
    img: '/img/farm.png',
    nivel: 3,
    dificultad: 'Media',
    duracion: '35 minutos',
    descripcion:
      'Construye una granja automática para producir comida de forma eficiente.',
    conceptos: ['Agua', 'Cultivos', 'Tolvas', 'Automatización'],
    practica: 'https://studio.code.org/courses/aquatic/units/1/lessons/1/levels/1',
  },
}

export default function MinecraftCourse() {
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
        <Link to="/dashboard" className={styles.back}>
          <i className="bi bi-arrow-left"></i> Volver
        </Link>
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
            <p>Ahora intenta construir este proyecto en Minecraft Education.</p>
            <a
              className={styles.practiceBtn}
              href={data.practica}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-box-arrow-up-right"></i> Practicar en Minecraft
              Education
            </a>
          </div>
        </aside>
      </main>

      <footer className={styles.statusBar}>Minecraft Education Studio</footer>
    </div>
  )
}
