import { createContext, useContext, useEffect, useState } from 'react'
import api, { TOKEN_KEY } from '../api/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))

  // Al cargar la app, si hay token guardado se valida pidiendo el perfil
  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    api
      .get('/users/me')
      .then(({ data }) => setUser(data))
      .catch(() => logout())
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/login', { email, password })
    localStorage.setItem(TOKEN_KEY, data.token)
    setUser(data.user)
    setToken(data.token)
    return data.user
  }

  const register = async ({ name, email, password, picture }) => {
    await api.post('/users', { name, email, password, picture })
    return login(email, password)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)
