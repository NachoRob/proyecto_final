const request = require('supertest')
const app = require('../app')
const pool = require('../config/db')

// Usuario nuevo en cada corrida para no chocar con datos existentes
const email = `test_${Date.now()}@test.cl`
const password = '123456'
let token
let postId

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', [email])
  await pool.end()
})

describe('POST /users (registro)', () => {
  it('crea un usuario y responde 201', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'Test', email, password })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).not.toHaveProperty('password')
  })

  it('responde 409 si el email ya existe', async () => {
    const res = await request(app).post('/users').send({ name: 'Test', email, password })
    expect(res.statusCode).toBe(409)
  })

  it('responde 400 si faltan campos', async () => {
    const res = await request(app).post('/users').send({ email })
    expect(res.statusCode).toBe(400)
  })
})

describe('POST /login', () => {
  it('responde 200 con token y usuario', async () => {
    const res = await request(app).post('/login').send({ email, password })
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe(email)
    token = res.body.token
  })

  it('responde 401 con contraseña incorrecta', async () => {
    const res = await request(app).post('/login').send({ email, password: 'mala' })
    expect(res.statusCode).toBe(401)
  })
})

describe('GET /posts', () => {
  it('responde 200 con un arreglo de publicaciones', async () => {
    const res = await request(app).get('/posts')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.results)).toBe(true)
  })

  it('GET /posts/:id responde 404 si no existe', async () => {
    const res = await request(app).get('/posts/999999')
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /posts (ruta protegida)', () => {
  const nuevoPost = {
    title: 'Guitarra de prueba',
    description: 'Publicada desde los tests',
    price: 100000,
    image_url: 'https://example.com/guitarra.jpg',
    category_id: 1
  }

  it('responde 401 sin token', async () => {
    const res = await request(app).post('/posts').send(nuevoPost)
    expect(res.statusCode).toBe(401)
  })

  it('responde 201 con token válido', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoPost)
    expect(res.statusCode).toBe(201)
    expect(res.body.title).toBe(nuevoPost.title)
    postId = res.body.id
  })

  it('responde 400 si faltan campos', async () => {
    const res = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Incompleto' })
    expect(res.statusCode).toBe(400)
  })
})

describe('Favoritos', () => {
  it('POST /favorites responde 201', async () => {
    const res = await request(app)
      .post('/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ post_id: postId })
    expect(res.statusCode).toBe(201)
  })

  it('GET /favorites incluye la publicación', async () => {
    const res = await request(app).get('/favorites').set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.some((p) => p.id === postId)).toBe(true)
  })

  it('DELETE /favorites/:postId responde 204', async () => {
    const res = await request(app)
      .delete(`/favorites/${postId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(204)
  })
})

describe('DELETE /posts/:id', () => {
  it('responde 401 con token inválido', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', 'Bearer token_falso')
    expect(res.statusCode).toBe(401)
  })

  it('responde 204 cuando el dueño elimina su publicación', async () => {
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.statusCode).toBe(204)
  })
})
