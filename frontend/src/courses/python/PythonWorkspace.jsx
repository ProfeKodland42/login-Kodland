import { useState } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
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
  const [stdin, setStdin] = useState('')
  const [salida, setSalida] = useState('Esperando ejecución...')
  const [ejecutando, setEjecutando] = useState(false)

  async function ejecutar() {
    setEjecutando(true)
    setSalida('Ejecutando...')
    try {
      const respuesta = await fetch('/ejecutar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo: archivos[archivoActual], entrada: stdin }),
      })
      const datos = await respuesta.json()
      let texto = ''
      if (datos.stdout) texto += datos.stdout
      if (datos.stderr) texto += datos.stderr
      if (datos.build_stderr) texto += datos.build_stderr
      if (datos.build_result) texto += datos.build_result
      setSalida(texto.trim() === '' ? 'Proceso finalizado.' : texto)
    } catch {
      setSalida(
        'No se pudo conectar con el servidor. Revisa que el backend esté corriendo (cd backend && python main.py).'
      )
    } finally {
      setEjecutando(false)
    }
  }

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
          <button className={styles.run} onClick={ejecutar} disabled={ejecutando}>
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

          <div className={styles.bottom}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <i className="bi bi-keyboard"></i> Entrada (input)
              </div>
              <textarea
                className={styles.stdin}
                spellCheck="false"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Una línea por cada input()"
              ></textarea>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                <i className="bi bi-terminal"></i> Consola
              </div>
              <pre className={styles.output}>{salida}</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
