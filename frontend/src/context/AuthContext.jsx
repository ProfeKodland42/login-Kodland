import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'kodland_user'

// En desarrollo queda vacío (Vite hace proxy a Flask). En producción se define
// VITE_API_URL con la URL del backend en Render.
const API_URL = import.meta.env.VITE_API_URL || ''

function readStoredUser() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  async function login(usuario, password) {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    })
    const datos = await respuesta.json()
    if (!datos.success) {
      return { success: false, mensaje: datos.mensaje }
    }
    const sesion = { usuario, rol: datos.rol, nombre: datos.nombre }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion))
    setUser(sesion)
    return { success: true }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
