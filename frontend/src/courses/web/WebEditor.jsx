import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import reto from './modulo1.json'
import { marcarModulo } from '../../utils/progreso'
import styles from './WebEditor.module.css'

const archivosIniciales = {
  html: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Mi Primera Página</title>
</head>
<body>



</body>
</html>`,
  css: `body {
    font-family: Arial, sans-serif;
    padding: 40px;
    background: #fafafa;
}

h1 {
    color: #007acc;
}

button {
    padding: 12px 20px;
    border: none;
    border-radius: 6px;
    background: #007acc;
    color: white;
    cursor: pointer;
}`,
  js: `function saludar() {
    alert("¡Hola desde JavaScript!");
}`,
}

const lenguajes = { html: 'html', css: 'css', js: 'javascript' }
const etiquetas = { html: 'index.html', css: 'style.css', js: 'script.js' }

function construirDocumento(archivos) {
  return `<!DOCTYPE html>
<html>
<head>
<style>${archivos.css}</style>
</head>
<body>
${archivos.html}
<script>${archivos.js}<\/script>
</body>
</html>`
}

export default function WebEditor({ studentMode }) {
  const [archivos, setArchivos] = useState(archivosIniciales)
  const [archivoActual, setArchivoActual] = useState('html')

  const objetivos = useMemo(() => {
    const doc = new DOMParser().parseFromString(archivos.html, 'text/html')
    return reto.objetivos.map((objetivo) => {
      const elemento = doc.querySelector(objetivo.selector)
      const apertura = archivos.html.includes(`<${objetivo.selector}`)
      const cierre = archivos.html.includes(`</${objetivo.selector}>`)
      const texto = elemento ? elemento.textContent.trim().length > 0 : false
      return { ...objetivo, completado: !!elemento && apertura && cierre && texto }
    })
  }, [archivos.html])

  const completados = objetivos.filter((o) => o.completado).length
  const total = objetivos.length
  const porcentaje = Math.round((completados / total) * 100)
  const documento = useMemo(() => construirDocumento(archivos), [archivos])

  useEffect(() => {
    if (porcentaje === 100) marcarModulo('web', 'modulo1')
  }, [porcentaje])

  function vistaPrevia() {
    const ventana = window.open()
    ventana.document.write(documento)
    ventana.document.close()
  }

  function reiniciar() {
    setArchivos(archivosIniciales)
    setArchivoActual('html')
  }

  return (
    <div className={styles.ide}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.courseIcon}>
            <i className="bi bi-globe2"></i>
          </div>
          <div className={styles.courseInfo}>
            <h2>Diseño Web</h2>
            <span>Módulo 1 · HTML Básico</span>
          </div>
        </div>

        <div className={styles.toolbarCenter}>
          {Object.keys(etiquetas).map((clave) => (
            <button
              key={clave}
              className={`${styles.fileTab} ${
                archivoActual === clave ? styles.active : ''
              }`}
              onClick={() => setArchivoActual(clave)}
            >
              {etiquetas[clave]}
            </button>
          ))}
        </div>

        <div className={styles.toolbarRight}>
          {!studentMode && (
            <Link to="/dashboard" className={styles.volver}>
              <i className="bi bi-arrow-left"></i> Volver
            </Link>
          )}
          <button onClick={vistaPrevia}>Vista previa</button>
          <button onClick={reiniciar}>Reiniciar</button>
        </div>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.challengeCard}>
            <span className={styles.challengeTag}>Módulo {reto.id}</span>
            <h2>{reto.titulo}</h2>
            <p>{reto.descripcion}</p>
          </div>

          <div className={styles.challengeCard}>
            <h3>Objetivos</h3>
            {objetivos.map((objetivo) => (
              <div key={objetivo.id} className={styles.goal}>
                <i
                  className={`bi ${
                    objetivo.completado
                      ? 'bi-check-circle-fill'
                      : 'bi-hourglass-split'
                  } ${styles.goalIcon} ${
                    objetivo.completado ? styles.done : ''
                  }`}
                ></i>
                <div>
                  <strong>{objetivo.nombre}</strong>
                  <small>{objetivo.hint}</small>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.challengeCard}>
            <h3>Recompensa</h3>
            <h1 className={styles.xp}>{reto.xp} XP</h1>
          </div>

          <div className={styles.challengeCard}>
            <div className={styles.progressHeader}>
              <span>Progreso</span>
              <span>{porcentaje}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${porcentaje}%` }}
              ></div>
            </div>
          </div>
        </aside>

        <section className={styles.editorContainer}>
          <Editor
            height="100%"
            language={lenguajes[archivoActual]}
            theme="vs-dark"
            value={archivos[archivoActual]}
            onChange={(valor) =>
              setArchivos((prev) => ({ ...prev, [archivoActual]: valor ?? '' }))
            }
            options={{
              fontSize: 16,
              minimap: { enabled: false },
              automaticLayout: true,
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        </section>

        <section className={styles.previewContainer}>
          <div className={styles.previewHeader}>Vista previa</div>
          <iframe title="preview" className={styles.preview} srcDoc={documento} />
        </section>
      </section>

      <footer className={styles.console}>
        <div className={styles.consoleLeft}>Consola</div>
        <div className={styles.consoleRight}>
          {porcentaje === 100
            ? `Reto completado. +${reto.xp} XP`
            : `Objetivos completados: ${completados}/${total}`}
        </div>
      </footer>
    </div>
  )
}
