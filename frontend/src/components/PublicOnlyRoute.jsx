import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

// Login y registro no tienen sentido si ya hay sesión iniciada
const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <Loader />
  if (isAuthenticated) return <Navigate to="/tienda" replace />
  return <Outlet />
}

export default PublicOnlyRoute
