# 🎸 Segunda Nota: Marketplace de instrumentos usados

Proyecto final Desafío Latam. Compra y venta de instrumentos musicales usados.

```
backend/   API REST: Express + PostgreSQL (pg) + JWT + tests con jest/supertest
frontend/  React (Vite) + React Router + Context API + React-Bootstrap
docs/      Entregable Hito 1 (PDF + zip)
```

## Correr en local

Requisitos: Node 18+ y PostgreSQL.

```bash
# 1. Backend
cd backend
cp .env.example .env      # ajusta PGUSER / PGPASSWORD / JWT_SECRET
createdb marketplace
npm install
npm run db:setup          # crea tablas + datos de ejemplo
npm run dev               # http://localhost:3000
npm test                  # 15 tests de rutas

# 2. Frontend (otra terminal)
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:3000
npm install
npm run dev               # http://localhost:5173
```

Usuarios de prueba (clave `123456`): `camila@demo.cl`, `diego@demo.cl`, `valentina@demo.cl`

## Dónde está cada requisito

| Hito | Requisito | Archivo |
|---|---|---|
| 2 | React Router, rutas públicas/privadas | `frontend/src/App.jsx`, `components/PrivateRoute.jsx`, `PublicOnlyRoute.jsx` |
| 2 | Context API (estado global) | `frontend/src/context/AuthContext.jsx`, `FavoritesContext.jsx` |
| 2 | Componentes reutilizables con props | `components/PostCard.jsx`, `PostGrid.jsx`, `AuthCard.jsx`, `FavoriteButton.jsx` |
| 2 | Hooks (incluye uno propio) | `useState`/`useEffect` en vistas, `hooks/useCategories.js`, `useSearchParams` en `views/Gallery.jsx` |
| 3 | `pg` + consultas parametrizadas | `backend/config/db.js`, `backend/consultas.js` |
| 3 | JWT (login + rutas protegidas) | `backend/app.js` (`/login`), `backend/middlewares.js` (`verificarToken`) |
| 3 | CORS | `backend/app.js` |
| 3 | Middlewares de validación | `backend/middlewares.js` |
| 3 | Tests (4+ rutas, varios códigos) | `backend/tests/api.test.js` |
| 4 | Deploy | Ver sección siguiente |

## Deploy (Hito 4)

1. **Base de datos** (Render → New → PostgreSQL). Copia la *External Database URL*.
2. **Backend** (Render → New → Web Service, root `backend`): build `npm install`, start `npm start`.
   Variables: `DATABASE_URL=<URL interna de la BD>`, `JWT_SECRET=<algo largo>`.
   Para cargar las tablas: en tu PC corre `DATABASE_URL=<URL externa> npm run db:setup`.
3. **Frontend** (Netlify, base `frontend`): build `npm run build`, publish `frontend/dist`.
   Variable: `VITE_API_URL=<URL del backend en Render>`. `public/_redirects` ya maneja las rutas de React.
