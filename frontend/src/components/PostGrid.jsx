import { Row, Col } from 'react-bootstrap'
import PostCard from './PostCard'

const PostGrid = ({ posts, emptyText = 'No hay publicaciones para mostrar.', ...cardProps }) => {
  if (!posts.length) return <p className="text-muted py-4 text-center">{emptyText}</p>

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {posts.map((post) => (
        <Col key={post.id}>
          <PostCard post={post} {...cardProps} />
        </Col>
      ))}
    </Row>
  )
}

export default PostGrid
