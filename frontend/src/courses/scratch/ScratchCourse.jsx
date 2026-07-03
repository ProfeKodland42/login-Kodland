import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './ScratchCourse.module.css'

const EDITOR_URL = 'https://turbowarp.org/editor'

function extraerId(texto) {
  const encontrado = String(texto).match(/(\d{3,})/)
  return encontrado ? encontrado[1] : ''
}

export default function ScratchCourse() {
  const [entrada, setEntrada] = useState('')
  const [projectId, setProjectId] = useState('')

  function cargar() {
    setProjectId(extraerId(entrada))
  }

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <div className={styles.left}>
          <div className={styles.icon}>
            <i className="bi bi-puzzle-fill"></i>
          </div>
          <div className={styles.info}>
            <h2>Scratch</h2>
            <span>Programación con bloques</span>
          </div>
        </div>

        <div className={styles.center}>
          <input
            className={styles.input}
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') cargar()
            }}
            placeholder="Pega el link o ID de un proyecto de Scratch para jugarlo"
          />
          <button className={styles.cargar} onClick={cargar}>
            Cargar
          </button>
        </div>

        <div className={styles.right}>
          <a
            className={styles.abrir}
            href={EDITOR_URL}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-box-arrow-up-right"></i> Crear (editor)
          </a>
          <Link to="/dashboard" className={styles.volver}>
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
        </div>
      </header>

      {projectId ? (
        <iframe
          title="Proyecto de Scratch"
          className={styles.editor}
          src={`https://turbowarp.org/${projectId}/embed`}
          allow="fullscreen; autoplay"
        ></iframe>
      ) : (
        <div className={styles.placeholder}>
          <i className="bi bi-controller"></i>
          <h3>Juega un proyecto de Scratch</h3>
          <p>
            Pega arriba el link o el ID de un proyecto (de scratch.mit.edu o
            turbowarp.org) y presiona <strong>Cargar</strong>.
          </p>
          <p>
            Para <strong>crear</strong> con bloques, usa el botón “Crear
            (editor)”.
          </p>
        </div>
      )}
    </div>
  )
}
