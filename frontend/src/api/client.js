import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export const TOKEN_KEY = 'sn_token'

const api = axios.create({ baseURL: API_URL })

// Agrega el token JWT a todas las peticiones si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Mensaje de error legible para mostrar en pantalla
export const getErrorMessage = (error) =>
  error.response?.data?.message || 'No se pudo conectar con el servidor'

export default api
