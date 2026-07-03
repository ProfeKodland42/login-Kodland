const KEY = 'kodland_progreso'

function leer() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function modulosCompletados(curso) {
  const data = leer()
  return Array.isArray(data[curso]) ? data[curso] : []
}

export function marcarModulo(curso, moduloId) {
  const data = leer()
  const actuales = Array.isArray(data[curso]) ? data[curso] : []
  if (!actuales.includes(moduloId)) {
    data[curso] = [...actuales, moduloId]
    localStorage.setItem(KEY, JSON.stringify(data))
  }
}
