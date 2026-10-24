require('dotenv').config({ quiet: true })
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const {
  JWT_SECRET,
  reportarConsulta,
  verificarToken,
  validarLogin,
  validarRegistro,
  validarPost
} = require('./middlewares')
const db = require('./consultas')

const app = express()

app.use(cors())
app.use(express.json())
app.use(reportarConsulta)

app.get('/', (req, res) => {
  res.json({ message: 'API Marketplace de instrumentos funcionando 🎸' })
})

// ---------- Auth ----------

app.post('/users', validarRegistro, async (req, res, next) => {
  try {
    const user = await db.crearUsuario(req.body)
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
})

app.post('/login', validarLogin, async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await db.verificarCredenciales(email, password)
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
  } catch (error) {
    next(error)
  }
})

app.get('/users/me', verificarToken, async (req, res, next) => {
  try {
    res.json(await db.obtenerUsuarioPorId(req.user.id))
  } catch (error) {
    next(error)
  }
})

app.get('/users/me/posts', verificarToken, async (req, res, next) => {
  try {
    res.json(await db.obtenerPostsDeUsuario(req.user.id))
  } catch (error) {
    next(error)
  }
})

// ---------- Categorías ----------

app.get('/categories', async (req, res, next) => {
  try {
    res.json(await db.obtenerCategorias())
  } catch (error) {
    next(error)
  }
})

// ---------- Publicaciones ----------

app.get('/posts', async (req, res, next) => {
  try {
    res.json(await db.obtenerPosts(req.query))
  } catch (error) {
    next(error)
  }
})

app.get('/posts/:id', async (req, res, next) => {
  try {
    res.json(await db.obtenerPostPorId(req.params.id))
  } catch (error) {
    next(error)
  }
})

app.post('/posts', verificarToken, validarPost, async (req, res, next) => {
  try {
    const post = await db.crearPost(req.user.id, req.body)
    res.status(201).json(post)
  } catch (error) {
    next(error)
  }
})

app.put('/posts/:id', verificarToken, async (req, res, next) => {
  try {
    res.json(await db.actualizarPost(Number(req.params.id), req.user.id, req.body))
  } catch (error) {
    next(error)
  }
})

app.delete('/posts/:id', verificarToken, async (req, res, next) => {
  try {
    await db.eliminarPost(Number(req.params.id), req.user.id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

// ---------- Favoritos ----------

app.get('/favorites', verificarToken, async (req, res, next) => {
  try {
    res.json(await db.obtenerFavoritos(req.user.id))
  } catch (error) {
    next(error)
  }
})

app.post('/favorites', verificarToken, async (req, res, next) => {
  try {
    const { post_id } = req.body || {}
    if (!post_id) return res.status(400).json({ message: 'post_id es obligatorio' })
    const favorito = await db.agregarFavorito(req.user.id, post_id)
    res.status(201).json(favorito)
  } catch (error) {
    next(error)
  }
})

app.delete('/favorites/:postId', verificarToken, async (req, res, next) => {
  try {
    await db.eliminarFavorito(req.user.id, req.params.postId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

// ---------- 404 y errores ----------

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

app.use((error, req, res, next) => {
  // 22P02: id con formato inválido (ej: /posts/abc)
  if (error.code === '22P02') return res.status(400).json({ message: 'Parámetro inválido' })
  // 23503: llave foránea inexistente (ej: category_id que no existe)
  if (error.code === '23503') return res.status(400).json({ message: 'Referencia inválida' })
  if (typeof error.code === 'number') return res.status(error.code).json({ message: error.message })
  console.error(error)
  res.status(500).json({ message: 'Error interno del servidor' })
})

module.exports = app
