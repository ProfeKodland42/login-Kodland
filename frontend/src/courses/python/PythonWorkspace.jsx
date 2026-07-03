import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { usePythonRunner } from '../../hooks/usePythonRunner'
import styles from './PythonWorkspace.module.css'

const ejercicios = [
  {
    archivo: 'main.py',
    titulo: 'Entrada y saludo',
    codigo: `print("Bienvenido a Tutor's Leveling")

nombre = input("¿Cómo te llamas? ")

print("Hola", nombre)
`,
  },
  {
    archivo: 'variables.py',
    titulo: 'Variables básicas',
    codigo: `nombre = "Santiago"

edad = 29

pais = "Colombia"

print(nombre)
print(edad)
print(pais)
`,
  },
  {
    archivo: 'ejercicios.py',
    titulo: 'Bucle: tabla del 5',
    codigo: `print("Tabla del 5")

for i in range(1, 11):

    print(f"5 x {i} = {5 * i}")
`,
  },
]

const codigoInicial = Object.fromEntries(
  ejercicios.map((e) => [e.archivo, e.codigo])
)

export default function PythonWorkspace() {
  const [archivos, setArchivos] = useState(codigoInicial)
  const [archivoActual, setArchivoActual] = useState('main.py')
  const {
    salida,
    ejecutando,
    esperando,
    linea,
    setLinea,
    ejecutar,
    enviarLinea,
  } = usePythonRunner()

  const inputRef = useRef(null)
  const salidaRef = useRef(null)

  useEffect(() => {
    if (esperando) inputRef.current?.focus()
  }, [esperando])

  useEffect(() => {
    if (salidaRef.current) salidaRef.current.scrollTop = salidaRef.current.scrollHeight
  }, [salida])

  return (
    <div className={styles.ide}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.courseIcon}>
            <i className="bi bi-filetype-py"></i>
          </div>
          <div className={styles.courseInfo}>
            <h2>Python</h2>
            <span>Workspace de programación</span>
          </div>
        </div>

        <div className={styles.toolbarRight}>
          <button
            className={styles.run}
            onClick={() => ejecutar(archivos[archivoActual])}
            disabled={ejecutando}
          >
            <i className="bi bi-play-fill"></i>
            {ejecutando ? ' Ejecutando...' : ' Ejecutar código'}
          </button>
          <Link to="/dashboard" className={styles.volver}>
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
        </div>
      </header>

      <section className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>Ejercicios</div>
          {ejercicios.map((ejercicio) => (
            <div
              key={ejercicio.archivo}
              className={`${styles.leccion} ${
                archivoActual === ejercicio.archivo ? styles.active : ''
              }`}
              onClick={() => setArchivoActual(ejercicio.archivo)}
            >
              <i className="bi bi-file-earmark-code"></i>
              <div>
                <strong>{ejercicio.archivo}</strong>
                <small>{ejercicio.titulo}</small>
              </div>
            </div>
          ))}
        </aside>

        <div className={styles.main}>
          <div className={styles.editorArea}>
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={archivos[archivoActual]}
              onChange={(valor) =>
                setArchivos((prev) => ({ ...prev, [archivoActual]: valor ?? '' }))
              }
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          </div>

          <div className={styles.consola}>
            <div className={styles.consolaTitle}>
              <i className="bi bi-terminal"></i> Consola
            </div>
            <pre className={styles.output} ref={salidaRef}>
              {salida}
            </pre>
            <div className={styles.inputLine}>
              <span className={styles.prompt}>&rsaquo;</span>
              <input
                ref={inputRef}
                className={styles.entrada}
                value={linea}
                disabled={!esperando}
                placeholder={
                  esperando
                    ? 'Escribe tu respuesta y presiona Enter'
                    : ejecutando
                    ? 'Ejecutando…'
                    : 'Presiona “Ejecutar código” para empezar'
                }
                onChange={(e) => setLinea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') enviarLinea()
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
