import { useState } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { ejecutarPython } from '../../utils/pyodideRunner'
import calculatorCode from './calculator.py?raw'
import chatbotCode from './chatbot.py?raw'
import passwordCode from './password.py?raw'
import styles from './PythonPro.module.css'

const proyectos = {
  calculator: {
    archivo: 'calculadora.py',
    nombre: 'Calculator',
    descripcion:
      'Proyecto demostrativo para enseñar variables, operadores y funciones.',
    conceptos: ['Variables', 'Funciones', 'Input', 'Operadores'],
    codigo: calculatorCode,
  },
  chatbot: {
    archivo: 'chatbot.py',
    nombre: 'Chatbot',
    descripcion: 'Bot conversacional simple con respuestas aleatorias.',
    conceptos: ['Bucles', 'Listas', 'random', 'Input'],
    codigo: chatbotCode,
  },
  password: {
    archivo: 'password.py',
    nombre: 'Generador de contraseñas',
    descripcion: 'Genera contraseñas según el nivel de seguridad elegido.',
    conceptos: ['Bucles', 'Strings', 'random', 'Condicionales'],
    codigo: passwordCode,
  },
}

const codigoInicial = Object.fromEntries(
  Object.entries(proyectos).map(([clave, p]) => [clave, p.codigo])
)

const menu = ['Archivo', 'Editar', 'Ver', 'Ejecutar', 'Terminal', 'Ayuda']

export default function PythonPro() {
  const [valores, setValores] = useState(codigoInicial)
  const [actual, setActual] = useState('calculator')
  const [abiertos, setAbiertos] = useState(['calculator'])
  const [entrada, setEntrada] = useState('')
  const [salida, setSalida] = useState('Python Pro IDE\nEsperando ejecución...')
  const [estado, setEstado] = useState('Connected')
  const [ejecutando, setEjecutando] = useState(false)

  function abrir(clave) {
    setActual(clave)
    setAbiertos((prev) => (prev.includes(clave) ? prev : [...prev, clave]))
  }

  async function ejecutar() {
    setEjecutando(true)
    setEstado('Running...')
    setSalida('Cargando Python… (la primera vez puede tardar unos segundos)')

    const lineas = entrada ? entrada.split('\n') : []
    let indice = 0
    const pedirEntrada = (pregunta) =>
      indice < lineas.length
        ? lineas[indice++]
        : window.prompt(pregunta || 'Entrada del programa:')

    let acumulado = ''
    let empezado = false
    const onOutput = (texto) => {
      if (!empezado) {
        empezado = true
        acumulado = ''
      }
      acumulado += texto
      setSalida(acumulado)
    }

    try {
      await ejecutarPython(valores[actual], { onOutput, pedirEntrada })
      if (!empezado || acumulado.trim() === '')
        setSalida('Process finished successfully.')
      setEstado('Completed')
    } catch (error) {
      setSalida('No se pudo iniciar Python.\n' + (error?.message ?? error))
      setEstado('Error')
    } finally {
      setEjecutando(false)
    }
  }

  function limpiar() {
    setSalida('Python Pro IDE\n\nConsole cleared.')
  }

  const info = proyectos[actual]

  return (
    <div className={styles.ide}>
      <header className={styles.topbar}>
        <div className={styles.logo}>
          <h2>Tutor's Leveling</h2>
          <span>Python Pro IDE</span>
        </div>
        <nav className={styles.menu}>
          {menu.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <div className={styles.topRight}>
          <div className={styles.statusLive}>
            <span className={styles.liveDot}></span>
            {estado}
          </div>
          <Link to="/dashboard" className={styles.volver}>
            <i className="bi bi-arrow-left"></i> Volver
          </Link>
        </div>
      </header>

      <main className={styles.workspace}>
        <aside className={styles.activityBar}>
          <i className="bi bi-files"></i>
          <i className="bi bi-search"></i>
          <i className="bi bi-git"></i>
          <i className="bi bi-play-circle"></i>
          <i className="bi bi-gear"></i>
        </aside>

        <aside className={styles.explorer}>
          <div className={styles.panelTitle}>EXPLORER</div>
          <div className={styles.folderTitle}>
            <i className="bi bi-caret-down-fill"></i> PROJECT
          </div>
          <ul>
            {Object.entries(proyectos).map(([clave, p]) => (
              <li
                key={clave}
                className={`${styles.file} ${actual === clave ? styles.active : ''}`}
                onClick={() => abrir(clave)}
              >
                <i className="bi bi-file-earmark-code"></i>
                {p.archivo}
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.editorArea}>
          <div className={styles.tabs}>
            {abiertos.map((clave) => (
              <div
                key={clave}
                className={`${styles.tab} ${actual === clave ? styles.active : ''}`}
                onClick={() => setActual(clave)}
              >
                <i className="bi bi-file-earmark-code"></i>
                {proyectos[clave].archivo}
              </div>
            ))}
          </div>
          <div className={styles.editor}>
            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={valores[actual]}
              onChange={(valor) =>
                setValores((prev) => ({ ...prev, [actual]: valor ?? '' }))
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

        <aside className={styles.projectInfo}>
          <div className={styles.panelTitle}>PROJECT</div>
          <div className={styles.projectCard}>
            <h3>{info.nombre}</h3>
            <p>{info.descripcion}</p>
            <hr />
            <strong>Nivel</strong>
            <span className={styles.nivel}>Python Pro</span>
            <strong>Conceptos</strong>
            <div className={styles.chips}>
              {info.conceptos.map((concepto) => (
                <span key={concepto} className={styles.chip}>
                  {concepto}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <section className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <span>TERMINAL</span>
          <div>
            <button className={styles.run} onClick={ejecutar} disabled={ejecutando}>
              <i className="bi bi-play-fill"></i>
              {ejecutando ? ' Running...' : ' Run'}
            </button>
            <button className={styles.clear} onClick={limpiar}>
              <i className="bi bi-trash"></i> Clear
            </button>
          </div>
        </div>
        <div className={styles.terminalBody}>
          <textarea
            className={styles.stdin}
            spellCheck="false"
            value={entrada}
            onChange={(e) => setEntrada(e.target.value)}
            placeholder="Opcional: respuestas de input(). Vacío = te pregunta al momento."
          ></textarea>
          <pre className={styles.output}>{salida}</pre>
        </div>
      </section>

      <footer className={styles.statusBar}>
        <span>Python 3.12</span>
        <span>UTF-8</span>
        <span>Ln 1</span>
        <span>Col 1</span>
        <span>Spaces: 4</span>
        <span>
          <span className={styles.statusDot}></span>
          {estado}
        </span>
      </footer>
    </div>
  )
}
