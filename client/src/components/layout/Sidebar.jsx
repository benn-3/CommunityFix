import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({ className = '' }) {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`w-full lg:w-64 ${className}`}>
      <div className="space-y-6 sticky top-20">
        <div className="cf-card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Welcome back</p>
          <h3 className="font-bold text-lg text-slate-900 mt-1">Community Member</h3>
        </div>

        <nav className="space-y-1">
          {[
            { to: '/dashboard', label: '📊 Dashboard' },
            { to: '/issues', label: '📋 All issues' },
            { to: '/report', label: '✏️ Report an issue' },
            { to: '/admin', label: '⚙️ Admin' }
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-4 py-3 rounded-lg font-medium transition-all duration-200 nav-link ${
                isActive(link.to)
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'text-slate-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
