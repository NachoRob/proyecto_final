import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Alert } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import api, { getErrorMessage } from '../api/client'
import PostGrid from '../components/PostGrid'
import Loader from '../components/Loader'
import useCategories from '../hooks/useCategories'

const ORDER_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'title_asc', label: 'Nombre A-Z' }
]

const Gallery = () => {
  const categories = useCategories()
  // Los filtros viven en la URL (?search=...&category_id=...) para poder compartirlos
  const [searchParams, setSearchParams] = useSearchParams()
  const category_id = searchParams.get('category_id') || ''
  const order_by = searchParams.get('order_by') || 'recent'
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (next.toString() === searchParams.toString()) return
    setSearchParams(next, { replace: true })
  }

  // Espera 400ms después de escribir antes de buscar (debounce)
  useEffect(() => {
    const timer = setTimeout(() => updateParam('search', search.trim()), 400)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    setLoading(true)
    setError('')
    api
      .get('/posts', { params: Object.fromEntries(searchParams) })
      .then(({ data }) => {
        setPosts(data.results)
        setTotal(data.total)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [searchParams])

  return (
    <Container className="py-4">
      <h1 className="section-title mb-4">Tienda</h1>
      <Row className="g-2 mb-4 filters">
        <Col md={6}>
          <Form.Control
            type="search"
            placeholder="Buscar: guitarra, Yamaha, batería..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar"
          />
        </Col>
        <Col sm={6} md={3}>
          <Form.Select value={category_id} onChange={(e) => updateParam('category_id', e.target.value)} aria-label="Categoría">
            <option value="">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Col>
        <Col sm={6} md={3}>
          <Form.Select value={order_by} onChange={(e) => updateParam('order_by', e.target.value)} aria-label="Ordenar por">
            {ORDER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <Loader />
      ) : (
        <>
          <p className="text-muted small">{total} {total === 1 ? 'resultado' : 'resultados'}</p>
          <PostGrid posts={posts} emptyText="No encontramos instrumentos con esos filtros." />
        </>
      )}
    </Container>
  )
}

export default Gallery
