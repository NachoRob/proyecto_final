export const formatPrice = (price) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price)

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

export const CONDITIONS = ['nuevo', 'como nuevo', 'usado']

// Imagen de reemplazo si la URL de una publicación no carga
export const FALLBACK_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e9e4dc"/><text x="50%" y="58%" font-size="80" text-anchor="middle">🎵</text></svg>`
  )
