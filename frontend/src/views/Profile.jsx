import { useEffect, useState } from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { formatDate } from '../utils/format'

const Profile = () => {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const [myPostsCount, setMyPostsCount] = useState(null)

  useEffect(() => {
    api.get('/users/me/posts').then(({ data }) => setMyPostsCount(data.length))
  }, [])

  const stats = [
    { label: 'Publicaciones', value: myPostsCount ?? '…', to: '/perfil/publicaciones' },
    { label: 'Favoritos', value: favorites.length, to: '/perfil/favoritos' }
  ]

  return (
    <>
      <h1 className="section-title mb-4">¡Hola, {user.name.split(' ')[0]}! 👋</h1>
      <Card className="mb-4">
        <Card.Body>
          <dl className="row mb-0">
            <dt className="col-sm-4">Nombre</dt>
            <dd className="col-sm-8">{user.name}</dd>
            <dt className="col-sm-4">Email</dt>
            <dd className="col-sm-8">{user.email}</dd>
            {user.created_at && (
              <>
                <dt className="col-sm-4">Miembro desde</dt>
                <dd className="col-sm-8 mb-0">{formatDate(user.created_at)}</dd>
              </>
            )}
          </dl>
        </Card.Body>
      </Card>
      <Row className="g-3 mb-4">
        {stats.map((s) => (
          <Col sm={6} key={s.label}>
            <Card as={Link} to={s.to} className="stat-card text-decoration-none h-100">
              <Card.Body>
                <div className="stat-value">{s.value}</div>
                <div className="text-muted">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button as={Link} to="/perfil/nueva" className="btn-accent">+ Publicar un instrumento</Button>
    </>
  )
}

export default Profile
