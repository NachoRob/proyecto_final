const bcrypt = require('bcryptjs')
const pool = require('./config/db')

// Error con código HTTP, lo atrapa el manejador de errores en app.js
const httpError = (code, message) => Object.assign(new Error(message), { code })

const POST_FIELDS = `
  p.id, p.title, p.description, p.price, p.image_url, p.condition, p.location, p.created_at,
  p.category_id, c.name AS category_name,
  p.user_id AS seller_id, u.name AS seller_name
`
const POST_JOINS = `
  FROM posts p
  JOIN categories c ON c.id = p.category_id
  JOIN users u ON u.id = p.user_id
`

const ORDER_BY = {
  recent: 'p.created_at DESC',
  price_asc: 'p.price ASC',
  price_desc: 'p.price DESC',
  title_asc: 'p.title ASC'
}

// ---------- Usuarios ----------

const crearUsuario = async ({ name, email, password, picture }) => {
  const hash = bcrypt.hashSync(password, 10)
  try {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, picture)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, picture`,
      [name, email.toLowerCase(), hash, picture || null]
    )
    return rows[0]
  } catch (error) {
    if (error.code === '23505') throw httpError(409, 'El email ya está registrado')
    throw error
  }
}

const verificarCredenciales = async (email, password) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
  const user = rows[0]
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw httpError(401, 'Email o contraseña incorrectos')
  }
  const { password: _, ...userSinPassword } = user
  return userSinPassword
}

const obtenerUsuarioPorId = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, picture, created_at FROM users WHERE id = $1',
    [id]
  )
  if (!rows.length) throw httpError(404, 'Usuario no encontrado')
  return rows[0]
}

// ---------- Categorías ----------

const obtenerCategorias = async () => {
  const { rows } = await pool.query('SELECT id, name FROM categories ORDER BY id')
  return rows
}

// ---------- Publicaciones ----------

const obtenerPosts = async ({ search, category_id, order_by = 'recent', limit = 50, page = 1 }) => {
  const filtros = []
  const valores = []

  if (search) {
    valores.push(`%${search}%`)
    filtros.push(`(p.title ILIKE $${valores.length} OR p.description ILIKE $${valores.length})`)
  }
  if (category_id) {
    valores.push(category_id)
    filtros.push(`p.category_id = $${valores.length}`)
  }

  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : ''
  const orden = ORDER_BY[order_by] || ORDER_BY.recent
  const lim = Math.min(Number(limit) || 50, 100)
  const offset = (Math.max(Number(page) || 1, 1) - 1) * lim

  const { rows } = await pool.query(
    `SELECT ${POST_FIELDS} ${POST_JOINS} ${where} ORDER BY ${orden} LIMIT ${lim} OFFSET ${offset}`,
    valores
  )
  const { rows: [{ count }] } = await pool.query(
    `SELECT COUNT(*) ${POST_JOINS} ${where}`,
    valores
  )
  return { total: Number(count), page: Number(page) || 1, results: rows }
}

const obtenerPostPorId = async (id) => {
  const { rows } = await pool.query(
    `SELECT ${POST_FIELDS}, u.email AS seller_email, u.picture AS seller_picture
     ${POST_JOINS} WHERE p.id = $1`,
    [id]
  )
  if (!rows.length) throw httpError(404, 'Publicación no encontrada')
  return rows[0]
}

const crearPost = async (userId, { title, description, price, image_url, category_id, condition, location }) => {
  const { rows } = await pool.query(
    `INSERT INTO posts (user_id, title, description, price, image_url, category_id, condition, location)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'usado'), $8)
     RETURNING id`,
    [userId, title, description, price, image_url, category_id, condition, location]
  )
  return obtenerPostPorId(rows[0].id)
}

const verificarDueño = async (postId, userId) => {
  const { rows } = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId])
  if (!rows.length) throw httpError(404, 'Publicación no encontrada')
  if (rows[0].user_id !== userId) throw httpError(403, 'No puedes modificar una publicación ajena')
}

const actualizarPost = async (postId, userId, datos) => {
  await verificarDueño(postId, userId)
  const { title, description, price, image_url, category_id, condition, location } = datos
  await pool.query(
    `UPDATE posts SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       price = COALESCE($3, price),
       image_url = COALESCE($4, image_url),
       category_id = COALESCE($5, category_id),
       condition = COALESCE($6, condition),
       location = COALESCE($7, location)
     WHERE id = $8`,
    [title, description, price, image_url, category_id, condition, location, postId]
  )
  return obtenerPostPorId(postId)
}

const eliminarPost = async (postId, userId) => {
  await verificarDueño(postId, userId)
  await pool.query('DELETE FROM posts WHERE id = $1', [postId])
}

const obtenerPostsDeUsuario = async (userId) => {
  const { rows } = await pool.query(
    `SELECT ${POST_FIELDS} ${POST_JOINS} WHERE p.user_id = $1 ORDER BY p.created_at DESC`,
    [userId]
  )
  return rows
}

// ---------- Favoritos ----------

const obtenerFavoritos = async (userId) => {
  const { rows } = await pool.query(
    `SELECT ${POST_FIELDS} ${POST_JOINS}
     JOIN favorites f ON f.post_id = p.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  )
  return rows
}

const agregarFavorito = async (userId, postId) => {
  await obtenerPostPorId(postId) // 404 si no existe
  const { rows } = await pool.query(
    `INSERT INTO favorites (user_id, post_id) VALUES ($1, $2)
     ON CONFLICT (user_id, post_id) DO UPDATE SET user_id = EXCLUDED.user_id
     RETURNING id, user_id, post_id`,
    [userId, postId]
  )
  return rows[0]
}

const eliminarFavorito = async (userId, postId) => {
  const { rowCount } = await pool.query(
    'DELETE FROM favorites WHERE user_id = $1 AND post_id = $2',
    [userId, postId]
  )
  if (!rowCount) throw httpError(404, 'El favorito no existe')
}

module.exports = {
  crearUsuario,
  verificarCredenciales,
  obtenerUsuarioPorId,
  obtenerCategorias,
  obtenerPosts,
  obtenerPostPorId,
  crearPost,
  actualizarPost,
  eliminarPost,
  obtenerPostsDeUsuario,
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
}
