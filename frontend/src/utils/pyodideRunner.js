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

// Ejecuta código Python en el navegador.
// onOutput(texto): recibe la salida a medida que se produce.
// pedirEntrada(): devuelve la siguiente línea de input(), o null para terminar.
export async function ejecutarPython(codigo, { onOutput, pedirEntrada }) {
  const pyodide = await obtenerPyodide()

  pyodide.setStdout({ batched: (texto) => onOutput(texto) })
  pyodide.setStderr({ batched: (texto) => onOutput(texto) })
  pyodide.setStdin({
    stdin: () => {
      const linea = pedirEntrada()
      if (linea === null || linea === undefined) return null
      return linea + '\n'
    },
  })

  try {
    await pyodide.runPythonAsync(codigo)
  } catch (error) {
    onOutput('\n' + (error?.message ?? String(error)))
  }
}
