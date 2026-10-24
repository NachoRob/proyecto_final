import { Card, Badge, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'
import { formatPrice, FALLBACK_IMAGE } from '../utils/format'

// Tarjeta reutilizable: la usan la tienda, el home, mis publicaciones y favoritos.
// showFavorite y onDelete cambian qué acciones se muestran.
const PostCard = ({ post, showFavorite = true, onDelete }) => {
  return (
    <Card className="post-card h-100">
      <Link to={`/publicacion/${post.id}`} className="post-card-img-wrap">
        <Card.Img
          variant="top"
          src={post.image_url}
          alt={post.title}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
        />
        <Badge bg="light" text="dark" className="post-card-badge">
          {post.condition}
        </Badge>
      </Link>
      <Card.Body className="d-flex flex-column">
        <small className="text-muted mb-1">{post.category_name}</small>
        <Card.Title as="h3" className="fs-6 mb-2">
          <Link to={`/publicacion/${post.id}`} className="stretched-link-none">
            {post.title}
          </Link>
        </Card.Title>
        <div className="price mb-2">{formatPrice(post.price)}</div>
        <small className="text-muted mt-auto">
          {post.location} · {post.seller_name}
        </small>
      </Card.Body>
      {(showFavorite || onDelete) && (
        <Card.Footer className="bg-transparent d-flex justify-content-between align-items-center">
          {showFavorite && <FavoriteButton post={post} />}
          {onDelete && (
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(post)}>
              Eliminar
            </Button>
          )}
        </Card.Footer>
      )}
    </Card>
  )
}

export default PostCard
