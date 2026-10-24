import { Card } from 'react-bootstrap'

// Contenedor compartido de login y registro; variant cambia el color
const AuthCard = ({ title, subtitle, variant = 'amber', children }) => (
  <div className="container py-5" style={{ maxWidth: 520 }}>
    <Card className={`auth-card auth-card-${variant}`}>
      <Card.Body className="p-4">
        <h1 className="h3 mb-0">{title}</h1>
        <p className="mb-3 opacity-75">{subtitle}</p>
        <hr />
        {children}
      </Card.Body>
    </Card>
  </div>
)

export default AuthCard
