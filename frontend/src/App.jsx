import { Routes, Route } from 'react-router-dom'
import AppNavbar from './components/AppNavbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import PublicOnlyRoute from './components/PublicOnlyRoute'
import ProfileLayout from './components/ProfileLayout'
import Home from './views/Home'
import Login from './views/Login'
import Register from './views/Register'
import Gallery from './views/Gallery'
import PostDetail from './views/PostDetail'
import Profile from './views/Profile'
import CreatePost from './views/CreatePost'
import MyPosts from './views/MyPosts'
import MyFavorites from './views/MyFavorites'
import NotFound from './views/NotFound'

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Vistas públicas */}
          <Route path="/" element={<Home />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Route>

          {/* Vistas privadas: requieren sesión iniciada */}
          <Route element={<PrivateRoute />}>
            <Route path="/tienda" element={<Gallery />} />
            <Route path="/publicacion/:id" element={<PostDetail />} />
            <Route path="/perfil" element={<ProfileLayout />}>
              <Route index element={<Profile />} />
              <Route path="publicaciones" element={<MyPosts />} />
              <Route path="favoritos" element={<MyFavorites />} />
              <Route path="nueva" element={<CreatePost />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
