import { Container, Row, Col, Nav, Image } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/perfil', label: 'Mi perfil', end: true },
  { to: '/perfil/publicaciones', label: 'Mis publicaciones' },
  { to: '/perfil/favoritos', label: 'Mis favoritos' },
  { to: '/perfil/nueva', label: '+ Nueva publicación' }
]

// Layout del perfil: menú lateral + la sub-vista activa (Outlet)
const ProfileLayout = () => {
  const { user } = useAuth()

  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col md={3}>
          <aside className="profile-sidebar p-3">
            <div className="text-center mb-3">
              <Image
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                roundedCircle
                width={80}
                height={80}
                className="object-fit-cover mb-2"
              />
              <div className="fw-bold">{user.name}</div>
            </div>
            <Nav className="flex-md-column gap-1">
              {LINKS.map((link) => (
                <Nav.Link key={link.to} as={NavLink} to={link.to} end={link.end}>
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </aside>
        </Col>
        <Col md={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}

export default ProfileLayout
