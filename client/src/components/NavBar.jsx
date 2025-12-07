import { Link } from 'react-router-dom'
import { getToken, logout } from '../services/auth'

export default function NavBar() {
  const token = getToken()

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/dashboard" className="nav-brand">CommunityFix</Link>
      </div>
      <div className="nav-right">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/report">Report Issue</Link>
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={() => { logout(); window.location.href = '/login' }} className="btn-link">Logout</button>
        )}
      </div>
    </nav>
  )
}
