// Crea las tablas (script.sql) y carga datos de ejemplo.
// Uso: npm run db:setup
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const pool = require('../config/db')

const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&fit=crop`

const usuarios = [
  { name: 'Camila Rojas', email: 'camila@demo.cl', picture: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Diego Muñoz', email: 'diego@demo.cl', picture: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Valentina Soto', email: 'valentina@demo.cl', picture: 'https://i.pravatar.cc/150?img=32' }
]

// [usuario, categoría, título, descripción, precio, imagen, estado, ubicación]
const posts = [
  [1, 1, 'Gibson Les Paul Standard verde', 'Les Paul en color verde metálico, cuerdas nuevas y estuche rígido incluido. Algunos detalles de uso en el canto.', 1450000, '1516924962500-2b4b3b99ea02', 'usado', 'Providencia, Santiago'],
  [2, 2, 'Bajo eléctrico tipo Precision', 'Bajo de 4 cuerdas color sonic blue, ideal para empezar o para ensayo. Incluye funda acolchada.', 320000, '1564186763535-ebb21ef5277f', 'usado', 'Ñuñoa, Santiago'],
  [3, 3, 'Batería acústica Pearl 5 piezas', 'Batería Pearl completa con platillos, banqueta y pedal. Se vende por cambio de departamento.', 690000, '1543443258-92b04ad5ec6b', 'usado', 'Viña del Mar'],
  [1, 3, 'Caja (snare) de madera 14"', 'Caja de madera con parche nuevo y baquetas de regalo. Sonido muy cálido.', 140000, '1519892300165-cb5542fb47c7', 'como nuevo', 'Providencia, Santiago'],
  [2, 4, 'Piano vertical Yamaha', 'Piano vertical Yamaha afinado hace 2 meses. Retiro en domicilio, se puede ayudar con el flete.', 1900000, '1552422535-c45813c61732', 'usado', 'Concepción'],
  [3, 4, 'Teclado controlador MIDI 61 teclas', 'Controlador MIDI con pads y perillas, perfecto para home studio. Poco uso.', 210000, '1598653222000-6b7b7a552625', 'como nuevo', 'Las Condes, Santiago'],
  [1, 6, 'Ukelele soprano de caoba', 'Ukelele soprano con afinador de clip y funda. Ideal para aprender.', 45000, '1556449895-a33c9dba33dd', 'como nuevo', 'Valparaíso'],
  [2, 1, 'Guitarra acústica 12 cuerdas', 'Guitarra electroacústica de 12 cuerdas, color natural. Sonido brillante y potente.', 280000, '1558098329-a11cff621064', 'usado', 'La Serena'],
  [3, 1, 'Guitarra acústica sunburst', 'Guitarra acústica sunburst con correa de cuero. Trastes en muy buen estado.', 160000, '1588449668365-d15e397f6787', 'usado', 'Temuco'],
  [1, 5, 'Violín 4/4 con arco y estuche', 'Violín de estudio 4/4, incluye arco, resina y estuche. Recién calibrado.', 190000, '1612225330812-01a9c6b355ec', 'como nuevo', 'Providencia, Santiago'],
  [2, 1, 'Guitarra eléctrica semi-hollow', 'Semi-hollow de cuerpo dorado, ideal para jazz y blues. Pastillas originales.', 520000, '1550291652-6ea9114a47b1', 'usado', 'Ñuñoa, Santiago'],
  [3, 1, 'Guitarra acústica negra', 'Guitarra acústica negra tamaño dreadnought, gran proyección. Se entrega con cuerdas nuevas.', 130000, '1514649923863-ceaf75b7ec00', 'usado', 'Puerto Montt']
]

const seed = async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'script.sql'), 'utf8')
  await pool.query(sql)

  const hash = bcrypt.hashSync('123456', 10)
  for (const u of usuarios) {
    await pool.query(
      'INSERT INTO users (name, email, password, picture) VALUES ($1, $2, $3, $4)',
      [u.name, u.email, hash, u.picture]
    )
  }

  for (const [i, [userId, catId, title, desc, price, imgId, condition, location]] of posts.entries()) {
    await pool.query(
      `INSERT INTO posts (user_id, category_id, title, description, price, image_url, condition, location, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - ($9 || ' hours')::interval)`,
      [userId, catId, title, desc, price, img(imgId), condition, location, i * 7]
    )
  }

  await pool.query('INSERT INTO favorites (user_id, post_id) VALUES (1, 3), (1, 5), (2, 1)')

  console.log(`✅ Base de datos lista: ${usuarios.length} usuarios, ${posts.length} publicaciones`)
  console.log('   Usuarios de prueba: camila@demo.cl / diego@demo.cl / valentina@demo.cl (clave 123456)')
  await pool.end()
}

seed().catch((error) => {
  console.error('❌ Error al cargar la base de datos:', error.message)
  process.exit(1)
})
