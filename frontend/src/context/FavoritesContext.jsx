import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [favorites, setFavorites] = useState([])

  const loadFavorites = useCallback(async () => {
    const { data } = await api.get('/favorites')
    setFavorites(data)
  }, [])

  // Se cargan al iniciar sesión y se limpian al cerrarla
  useEffect(() => {
    if (isAuthenticated) loadFavorites().catch(() => setFavorites([]))
    else setFavorites([])
  }, [isAuthenticated, loadFavorites])

  const isFavorite = (postId) => favorites.some((p) => p.id === postId)

  const toggleFavorite = async (post) => {
    if (isFavorite(post.id)) {
      setFavorites((prev) => prev.filter((p) => p.id !== post.id))
      await api.delete(`/favorites/${post.id}`)
    } else {
      setFavorites((prev) => [post, ...prev])
      await api.post('/favorites', { post_id: post.id })
    }
  }

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => useContext(FavoritesContext)
