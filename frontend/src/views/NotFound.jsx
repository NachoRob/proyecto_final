import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <Container className="py-5 text-center">
    <div className="display-1">🎶</div>
    <h1 className="section-title">404: esta nota no existe</h1>
    <p className="text-muted">La página que buscas no está en nuestro repertorio.</p>
    <Button as={Link} to="/" className="btn-accent">Volver al inicio</Button>
  </Container>
)

export default NotFound
