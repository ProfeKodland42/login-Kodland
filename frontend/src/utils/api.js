// URL del backend. En desarrollo queda vacío (Vite hace proxy a Flask); en
// producción se define VITE_API_URL con la URL del backend en Render.
export const API_URL = import.meta.env.VITE_API_URL || ''
