import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access a page they don't have permission for
    if (user.role === 'admin') return <Navigate to="/admin" replace />
    if (user.role === 'worker') return <Navigate to="/worker" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
