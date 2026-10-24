import { Spinner } from 'react-bootstrap'

const Loader = ({ text = 'Cargando...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 text-muted">
    <Spinner animation="border" className="mb-2" />
    <span>{text}</span>
  </div>
)

export default Loader
