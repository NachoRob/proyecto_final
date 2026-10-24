import { useState } from 'react'
import { Form, Button, Alert, Row, Col, Card, InputGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import api, { getErrorMessage } from '../api/client'
import useCategories from '../hooks/useCategories'
import { CONDITIONS, FALLBACK_IMAGE, formatPrice } from '../utils/format'

const INITIAL = {
  title: '',
  category_id: '',
  price: '',
  condition: 'usado',
  location: '',
  image_url: '',
  description: ''
}

const CreatePost = () => {
  const categories = useCategories()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const { data } = await api.post('/posts', {
        ...form,
        price: Number(form.price),
        category_id: Number(form.category_id)
      })
      navigate(`/publicacion/${data.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
      setSending(false)
    }
  }

  return (
    <>
      <h1 className="section-title mb-4">Nueva publicación</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="g-4">
        <Col lg={7}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Título</Form.Label>
              <Form.Control name="title" maxLength={120} placeholder="Ej: Fender Stratocaster 2015" value={form.title} onChange={handleChange} required />
            </Form.Group>
            <Row>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="category_id">
                <Form.Label>Categoría</Form.Label>
                <Form.Select name="category_id" value={form.category_id} onChange={handleChange} required>
                  <option value="">Selecciona...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="condition">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="condition" value={form.condition} onChange={handleChange}>
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="price">
                <Form.Label>Precio</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control type="number" name="price" min={0} step={1000} placeholder="150000" value={form.price} onChange={handleChange} required />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} sm={6} className="mb-3" controlId="location">
                <Form.Label>Ubicación</Form.Label>
                <Form.Control name="location" placeholder="Ej: Ñuñoa, Santiago" value={form.location} onChange={handleChange} />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="image_url">
              <Form.Label>URL de la imagen</Form.Label>
              <Form.Control type="url" name="image_url" placeholder="https://..." value={form.image_url} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-4" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" placeholder="Estado, accesorios incluidos, motivo de venta..." value={form.description} onChange={handleChange} required />
            </Form.Group>
            <Button type="submit" className="btn-accent" disabled={sending}>
              {sending ? 'Publicando...' : 'Publicar'}
            </Button>
          </Form>
        </Col>

        {/* Vista previa en vivo de cómo se verá la tarjeta */}
        <Col lg={5}>
          <div className="small text-muted mb-2">Vista previa</div>
          <Card className="post-card">
            <div className="post-card-img-wrap">
              <Card.Img
                variant="top"
                src={form.image_url || FALLBACK_IMAGE}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
            </div>
            <Card.Body>
              <small className="text-muted">
                {categories.find((c) => c.id === Number(form.category_id))?.name || 'Categoría'} · {form.condition}
              </small>
              <h3 className="fs-6 mt-1">{form.title || 'Título de tu publicación'}</h3>
              <div className="price">{formatPrice(Number(form.price) || 0)}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default CreatePost
