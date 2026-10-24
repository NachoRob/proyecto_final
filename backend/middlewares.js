const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_cambiar_en_produccion'

// Muestra en consola cada consulta que llega al servidor
const reportarConsulta = (req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`)
  }
  next()
}

// Valida que exista "Authorization: Bearer <token>" y que el token sea válido.
// Si todo está bien, deja el id y email del usuario en req.user
const verificarToken = (req, res, next) => {
  const authorization = req.header('Authorization') || ''
  const [tipo, token] = authorization.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Debes iniciar sesión (token no enviado)' })
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validarLogin = (req, res, next) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
  }
  next()
}

const validarRegistro = (req, res, next) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' })
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ message: 'El email no es válido' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })
  }
  next()
}

const validarPost = (req, res, next) => {
  const { title, description, price, image_url, category_id } = req.body || {}
  if (!title || !description || price === undefined || !image_url || !category_id) {
    return res.status(400).json({
      message: 'title, description, price, image_url y category_id son obligatorios'
    })
  }
  if (isNaN(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: 'El precio debe ser un número positivo' })
  }
  next()
}

module.exports = {
  JWT_SECRET,
  reportarConsulta,
  verificarToken,
  validarLogin,
  validarRegistro,
  validarPost
}
