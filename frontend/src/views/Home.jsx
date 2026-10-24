import { useEffect, useState } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import PostGrid from '../components/PostGrid'
import Loader from '../components/Loader'
import useCategories from '../hooks/useCategories'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const categories = useCategories()
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/posts', { params: { limit: 4, order_by: 'recent' } })
      .then(({ data }) => setLatest(data.results))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="hero">
        <Container className="hero-content">
          <p className="hero-kicker">Marketplace de instrumentos usados</p>
          <h1 className="hero-title">
            Tu próximo instrumento
            <br />
            ya tiene historia.
          </h1>
          <p className="hero-sub">
            Compra y vende guitarras, bajos, baterías, teclados y más, directo entre músicos.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            {isAuthenticated ? (
              <>
                <Button as={Link} to="/tienda" size="lg" className="btn-accent">
                  Ir a la tienda
                </Button>
                <Button as={Link} to="/perfil/nueva" size="lg" variant="outline-light">
                  Vender un instrumento
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/registro" size="lg" className="btn-accent">
                  Crear cuenta gratis
                </Button>
                <Button as={Link} to="/login" size="lg" variant="outline-light">
                  Ya tengo cuenta
                </Button>
              </>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-5">
        <h2 className="section-title mb-3">Categorías</h2>
        <div className="d-flex flex-wrap gap-2 mb-5">
          {categories.map((c) => (
            <Link key={c.id} to={`/tienda?category_id=${c.id}`} className="category-chip">
              {c.name}
            </Link>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-end mb-3">
          <h2 className="section-title mb-0">Recién publicados</h2>
          <Link to="/tienda">Ver todo →</Link>
        </div>
        {loading ? <Loader /> : <PostGrid posts={latest} showFavorite={isAuthenticated} />}

        <div className="row g-4 mt-5 text-center how-it-works">
          {[
            ['📸', 'Publica', 'Sube una foto, ponle precio y listo.'],
            ['🔎', 'Encuentra', 'Filtra por categoría, precio o palabra clave.'],
            ['🤝', 'Conversa', 'Contacta al vendedor y cierra el trato.']
          ].map(([icon, title, text]) => (
            <div className="col-md-4" key={title}>
              <div className="fs-1">{icon}</div>
              <h3 className="h5 mt-2">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}

export default Home
