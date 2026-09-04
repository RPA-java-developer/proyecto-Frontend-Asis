import axios from 'axios'

// Ajusta esta URL si tu API corre en otro puerto (revisa la consola
// al ejecutar dotnet run: "Now listening on: http://localhost:XXXX")
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5146/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// Adjunta el token guardado (si existe) en cada request
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('asisya_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Si el token expiró o es inválido, el backend responde 401.
// Limpiamos la sesión y mandamos al login.
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('asisya_token')
      localStorage.removeItem('asisya_username')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Normaliza los mensajes de error del backend (BadRequest con string,
// o el formato de validación de ASP.NET Core con { errors: {...} })
export function extractErrorMessage(error) {
  const data = error?.response?.data

  if (!data) return error.message || 'Error de conexión con el servidor.'
  if (typeof data === 'string') return data
  if (data.errors) {
    return Object.values(data.errors).flat().join(' ')
  }
  if (data.title) return data.title

  return 'Ocurrió un error inesperado.'
}
