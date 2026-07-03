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

// Reemplaza input() para que muestre la pregunta real y pida el dato al momento.
const SHIM_INPUT = [
  'import builtins as __b',
  'def __input(prompt=""):',
  '    r = __pedir_entrada(prompt)',
  '    if r is None:',
  '        raise EOFError("entrada cancelada")',
  '    return r',
  '__b.input = __input',
].join('\n')

// Ejecuta código Python en el navegador con Pyodide.
// onOutput(texto): salida en vivo (incluye el eco de la conversación).
// pedirEntrada(prompt): devuelve la respuesta al input(), o null para terminar.
export async function ejecutarPython(codigo, { onOutput, pedirEntrada }) {
  const pyodide = await obtenerPyodide()

  pyodide.setStdout({ batched: (texto) => onOutput(texto) })
  pyodide.setStderr({ batched: (texto) => onOutput(texto) })

  pyodide.globals.set('__pedir_entrada', (prompt) => {
    const pregunta = typeof prompt === 'string' ? prompt : ''
    if (pregunta) onOutput(pregunta)
    const respuesta = pedirEntrada(pregunta)
    if (respuesta === null || respuesta === undefined) return null
    onOutput(respuesta + '\n')
    return respuesta
  })

  try {
    await pyodide.runPythonAsync(SHIM_INPUT)
    await pyodide.runPythonAsync(codigo)
  } catch (error) {
    const mensaje = error?.message ?? String(error)
    if (mensaje.includes('EOFError')) {
      onOutput('\n[Ejecución detenida: faltó una respuesta de input()]')
    } else {
      onOutput('\n' + mensaje)
    }
  }
}
