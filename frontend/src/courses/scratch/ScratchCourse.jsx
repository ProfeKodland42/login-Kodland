import { Link } from 'react-router-dom'
import styles from './ScratchCourse.module.css'

const EDITOR_URL = 'https://turbowarp.org/editor'

export default function ScratchCourse() {
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

        <div className={styles.right}>
          <a
            className={styles.abrir}
            href={EDITOR_URL}
            target="_blank"
            rel="noreferrer"
          >
            <i className="bi bi-box-arrow-up-right"></i> Abrir en pestaña nueva
          </a>
          <Link to="/dashboard" className={styles.volver}>
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
        </div>
      </header>

      <iframe
        title="Editor de Scratch"
        className={styles.editor}
        src={EDITOR_URL}
        allow="fullscreen; clipboard-read; clipboard-write; autoplay"
      ></iframe>
    </div>
  )
}
