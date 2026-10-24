import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../api/client'
import PostGrid from '../components/PostGrid'
import Loader from '../components/Loader'

const MyPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/users/me/posts')
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (post) => {
    if (!confirm(`¿Eliminar "${post.title}"?`)) return
    await api.delete(`/posts/${post.id}`)
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="section-title mb-0">Mis publicaciones</h1>
        <Button as={Link} to="/perfil/nueva" className="btn-accent" size="sm">+ Nueva</Button>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <PostGrid
          posts={posts}
          showFavorite={false}
          onDelete={handleDelete}
          emptyText="Todavía no publicas nada. ¿Tienes un instrumento juntando polvo?"
        />
      )}
    </>
  )
}

export default MyPosts
