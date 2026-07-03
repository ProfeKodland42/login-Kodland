import { useRef, useState } from 'react'
import { ejecutarPython } from '../utils/pyodideRunner'

// Maneja una terminal Python interactiva: salida en vivo y entrada por línea.
export function usePythonRunner() {
  const [salida, setSalida] = useState('Esperando ejecución...')
  const [ejecutando, setEjecutando] = useState(false)
  const [esperando, setEsperando] = useState(false)
  const [linea, setLinea] = useState('')

  const resolverRef = useRef(null)
  const acumRef = useRef('')
  const empezadoRef = useRef(false)

  function onOutput(texto) {
    if (!empezadoRef.current) {
      empezadoRef.current = true
      acumRef.current = ''
    }
    acumRef.current += texto
    setSalida(acumRef.current)
  }

  function pedirEntrada() {
    return new Promise((resolve) => {
      setEsperando(true)
      resolverRef.current = (valor) => {
        setEsperando(false)
        resolverRef.current = null
        resolve(valor)
      }
    })
  }

  async function ejecutar(codigo) {
    setEjecutando(true)
    empezadoRef.current = false
    acumRef.current = ''
    setSalida('Cargando Python… (la primera vez puede tardar unos segundos)')
    try {
      await ejecutarPython(codigo, { onOutput, pedirEntrada })
      if (!empezadoRef.current || acumRef.current.trim() === '') {
        setSalida('Proceso finalizado.')
      }
    } catch (error) {
      onOutput('\n' + (error?.message ?? String(error)))
    } finally {
      setEsperando(false)
      resolverRef.current = null
      setEjecutando(false)
    }
  }

  function enviarLinea() {
    if (!esperando || !resolverRef.current) return
    const valor = linea
    onOutput(valor + '\n')
    setLinea('')
    resolverRef.current(valor)
  }

  function limpiar() {
    acumRef.current = ''
    empezadoRef.current = true
    setSalida('')
  }

  return {
    salida,
    ejecutando,
    esperando,
    linea,
    setLinea,
    ejecutar,
    enviarLinea,
    limpiar,
  }
}
