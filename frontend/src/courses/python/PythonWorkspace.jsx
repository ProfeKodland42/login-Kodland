import { useState } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import styles from './PythonWorkspace.module.css'

const archivosIniciales = {
  'main.py': `print("Bienvenido a Tutor's Leveling")

nombre = input("¿Cómo te llamas? ")

print("Hola", nombre)
`,
  'variables.py': `nombre = "Santiago"

edad = 29

pais = "Colombia"

print(nombre)
print(edad)
print(pais)
`,
  'ejercicios.py': `print("Tabla del 5")

for i in range(1, 11):

    print(f"5 x {i} = {5 * i}")
`,
}

export default function PythonWorkspace() {
  const [archivos, setArchivos] = useState(archivosIniciales)
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
      setSalida('Error de conexión.')
    } finally {
      setEjecutando(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h2>Tutor's Leveling</h2>
          <span>Python Workspace</span>
        </div>
        <Link to="/dashboard" className={styles.volver}>
          <i className="bi bi-arrow-left"></i> Volver al Dashboard
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.editorContainer}>
          <div className={styles.tabs}>
            {Object.keys(archivos).map((nombre) => (
              <div
                key={nombre}
                className={`${styles.tab} ${
                  archivoActual === nombre ? styles.active : ''
                }`}
                onClick={() => setArchivoActual(nombre)}
              >
                <i className="bi bi-file-earmark-code"></i>
                <span>{nombre}</span>
              </div>
            ))}
          </div>

          <div className={styles.editor}>
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
        </section>

        <button className={styles.run} onClick={ejecutar} disabled={ejecutando}>
          <i className="bi bi-play-fill"></i>
          {ejecutando ? ' Ejecutando...' : ' Ejecutar Código'}
        </button>

        <section className={styles.stdin}>
          <div className={styles.consoleTitle}>
            <i className="bi bi-keyboard"></i> Entrada del programa (input)
          </div>
          <textarea
            spellCheck="false"
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="Escribe aquí lo que leerá input(), una línea por dato."
          ></textarea>
        </section>

        <section className={styles.console}>
          <div className={styles.consoleTitle}>
            <i className="bi bi-terminal"></i> Consola
          </div>
          <pre className={styles.output}>{salida}</pre>
        </section>
      </main>
    </div>
  )
}
