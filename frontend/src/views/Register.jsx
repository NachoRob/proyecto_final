import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api/client'
import AuthCard from '../components/AuthCard'

const INITIAL = { name: '', email: '', password: '', confirm: '', picture: '' }

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres')
    if (form.password !== form.confirm) return setError('Las contraseñas no coinciden')

    setSending(true)
    try {
      await register(form)
      navigate('/perfil', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard title="Segunda Nota" subtitle="Crear una cuenta" variant="green">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Nombre</Form.Label>
          <Form.Control name="name" placeholder="Tu nombre" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="nombre@ejemplo.com" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <div className="row">
          <Form.Group className="mb-3 col-sm-6" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" name="password" placeholder="******" value={form.password} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3 col-sm-6" controlId="confirm">
            <Form.Label>Repetir contraseña</Form.Label>
            <Form.Control type="password" name="confirm" placeholder="******" value={form.confirm} onChange={handleChange} required />
          </Form.Group>
        </div>
        <Form.Group className="mb-4" controlId="picture">
          <Form.Label>URL de tu foto (opcional)</Form.Label>
          <Form.Control type="url" name="picture" placeholder="https://..." value={form.picture} onChange={handleChange} />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button type="submit" className="btn-accent" disabled={sending}>
            {sending ? 'Creando cuenta...' : 'Registrarme'}
          </Button>
          <Button variant="light" onClick={() => navigate('/')}>Volver</Button>
        </div>
      </Form>
      <p className="mt-4 mb-0 small">
        ¿Ya tienes cuenta? <Link to="/login" className="link-light">Inicia sesión</Link>
      </p>
    </AuthCard>
  )
}

export default Register
