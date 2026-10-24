import { Button } from 'react-bootstrap'
import { useFavorites } from '../context/FavoritesContext'

const FavoriteButton = ({ post, withText = false }) => {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(post.id)

  return (
    <Button
      variant={active ? 'danger' : 'outline-secondary'}
      size={withText ? undefined : 'sm'}
      onClick={() => toggleFavorite(post)}
      aria-pressed={active}
      title={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      {active ? '♥' : '♡'}
      {withText && (active ? ' En favoritos' : ' Guardar en favoritos')}
    </Button>
  )
}

export default FavoriteButton
