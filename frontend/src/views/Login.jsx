import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api/client'
import AuthCard from '../components/AuthCard'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      await login(form.email, form.password)
      // Vuelve a la página privada que se intentó abrir, o a la tienda
      navigate(location.state?.from || '/tienda', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard title="Segunda Nota" subtitle="Iniciar sesión" variant="amber">
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="nombre@ejemplo.com" value={form.email} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" name="password" placeholder="******" value={form.password} onChange={handleChange} required />
        </Form.Group>
        <div className="d-flex gap-2 align-items-center">
          <Button type="submit" variant="dark" disabled={sending}>
            {sending ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
          <Button variant="light" onClick={() => navigate('/')}>Volver</Button>
        </div>
      </Form>
      <p className="mt-4 mb-0 small">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        <br />
        <span className="opacity-75">Demo: camila@demo.cl / 123456</span>
      </p>
    </AuthCard>
  )
}

export default Login
