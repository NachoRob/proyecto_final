import { useEffect, useState } from 'react'
import { Container, Row, Col, Badge, Button, Card, Image, Alert } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { getErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import FavoriteButton from '../components/FavoriteButton'
import Loader from '../components/Loader'
import { formatPrice, formatDate, FALLBACK_IMAGE } from '../utils/format'

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    setPost(null)
    setError('')
    api
      .get(`/posts/${id}`)
      .then(({ data }) => setPost(data))
      .catch((err) => setError(getErrorMessage(err)))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta publicación?')) return
    await api.delete(`/posts/${id}`)
    navigate('/perfil/publicaciones')
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="warning">{error}</Alert>
        <Link to="/tienda">← Volver a la tienda</Link>
      </Container>
    )
  }
  if (!post) return <Loader />

  const isOwner = user?.id === post.seller_id
  const mailto = `mailto:${post.seller_email}?subject=${encodeURIComponent(
    `Consulta por "${post.title}" en Segunda Nota`
  )}`

  return (
    <Container className="py-4">
      <Link to="/tienda" className="d-inline-block mb-3">← Volver a la tienda</Link>
      <Row className="g-4">
        <Col lg={6}>
          <Image
            src={post.image_url}
            alt={post.title}
            className="detail-img w-100"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
          />
        </Col>
        <Col lg={6}>
          <div className="d-flex gap-2 mb-2">
            <Badge bg="dark">{post.category_name}</Badge>
            <Badge bg="secondary">{post.condition}</Badge>
          </div>
          <h1 className="h2">{post.title}</h1>
          <div className="price fs-3 mb-3">{formatPrice(post.price)}</div>
          <p style={{ whiteSpace: 'pre-line' }}>{post.description}</p>
          <p className="text-muted small">
            📍 {post.location || 'Sin ubicación'} · Publicado el {formatDate(post.created_at)}
          </p>

          <div className="d-flex gap-2 flex-wrap mb-4">
            {isOwner ? (
              <Button variant="outline-danger" onClick={handleDelete}>Eliminar publicación</Button>
            ) : (
              <>
                <Button href={mailto} className="btn-accent">✉️ Enviar mensaje al vendedor</Button>
                <FavoriteButton post={post} withText />
              </>
            )}
          </div>

          <Card className="mb-4">
            <Card.Body className="d-flex align-items-center gap-3">
              <Image
                src={post.seller_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.seller_name)}`}
                roundedCircle
                width={56}
                height={56}
                className="object-fit-cover"
              />
              <div>
                <div className="small text-muted">Vendido por</div>
                <div className="fw-bold">{post.seller_name}{isOwner && ' (tú)'}</div>
              </div>
            </Card.Body>
          </Card>

          {post.location && (
            <iframe
              title="Mapa"
              className="map w-100"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(post.location + ', Chile')}&z=12&output=embed`}
            />
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default PostDetail
