import { useFavorites } from '../context/FavoritesContext'
import PostGrid from '../components/PostGrid'

const MyFavorites = () => {
  const { favorites } = useFavorites()

  return (
    <>
      <h1 className="section-title mb-4">Mis favoritos</h1>
      <PostGrid posts={favorites} emptyText="Aún no guardas favoritos. Toca ♡ en una publicación para guardarla." />
    </>
  )
}

export default MyFavorites
