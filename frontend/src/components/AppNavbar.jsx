import { Container, Nav, Navbar, Button, Image } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AppNavbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar expand="md" className="app-navbar" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          🎸 Segunda Nota
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          {isAuthenticated ? (
            <>
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/tienda">Tienda</Nav.Link>
                <Nav.Link as={NavLink} to="/perfil/nueva">Vender</Nav.Link>
              </Nav>
              <Nav className="align-items-md-center gap-2">
                <Nav.Link as={NavLink} to="/perfil" end className="d-flex align-items-center gap-2">
                  {user.picture && (
                    <Image src={user.picture} roundedCircle width={30} height={30} className="object-fit-cover" />
                  )}
                  {user.name.split(' ')[0]}
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </Nav>
            </>
          ) : (
            <Nav className="ms-auto gap-2">
              <Button as={Link} to="/login" variant="outline-light" size="sm">
                Iniciar sesión
              </Button>
              <Button as={Link} to="/registro" className="btn-accent" size="sm">
                Regístrate
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
