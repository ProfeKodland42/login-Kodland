const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v314.0.2/full/'

let pyodidePromise = null

function cargarScript() {
  return new Promise((resolve, reject) => {
    if (window.loadPyodide) return resolve()
    const script = document.createElement('script')
    script.src = PYODIDE_URL + 'pyodide.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo descargar Pyodide.'))
    document.head.appendChild(script)
  })
}

async function obtenerPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      await cargarScript()
      return window.loadPyodide({ indexURL: PYODIDE_URL })
    })()
  }
  return pyodidePromise
}

// Ejecuta código Python en el navegador con Pyodide.
// El input() es asíncrono: no bloquea, la salida se ve en vivo y el dato
// se escribe en la terminal (no en un cuadro emergente).
//   onOutput(texto): salida en vivo.
//   pedirEntrada(pregunta): Promise que resuelve con la línea escrita.
export async function ejecutarPython(codigo, { onOutput, pedirEntrada }) {
  const pyodide = await obtenerPyodide()

  pyodide.setStdout({ batched: (texto) => onOutput(texto) })
  pyodide.setStderr({ batched: (texto) => onOutput(texto) })

  pyodide.globals.set('__ainput', async (prompt) => {
    const pregunta = typeof prompt === 'string' ? prompt : ''
    if (pregunta) onOutput(pregunta)
    const respuesta = await pedirEntrada(pregunta)
    return respuesta ?? ''
  })

  // input(...) -> await __ainput(...) para que sea asíncrono en la terminal.
  const transformado = codigo.replace(/(?<![.\w])input\s*\(/g, 'await __ainput(')

  try {
    await pyodide.runPythonAsync(transformado)
  } catch (error) {
    onOutput('\n' + (error?.message ?? String(error)))
  }
}
