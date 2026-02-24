import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ className = '' }) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  const getLinks = () => {
    if (!user) return []

    const commonLinks = [
      { to: '/issues', label: 'All Issues', icon: '📋' }
    ]

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Admin Panel', icon: '⚙️' },
          ...commonLinks,
          { to: '/report', label: 'Report Issue', icon: '✏️' }
        ]
      case 'worker':
        return [
          { to: '/worker', label: 'My Tasks', icon: '🔧' },
          ...commonLinks
        ]
      case 'citizen':
      default:
        return [
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          ...commonLinks,
          { to: '/report', label: 'Report Issue', icon: '✏️' }
        ]
    }
  }

  const links = getLinks()

  return (
    <aside className={`w-full ${className}`}>
      <div className="space-y-5">
        {/* User Card */}
        <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center font-bold text-sm">
              {user ? (user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U') : 'G'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {user ? (user.name || user.email?.split('@')[0] || 'Member') : 'Guest'}
              </h3>
              <p className="text-xs text-navy-200 truncate">{user?.email || ''}</p>
            </div>
          </div>
          {user?.role && (
            <span className={`inline-flex items-center text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30' :
                user.role === 'worker' ? 'bg-amber-500/20 text-amber-200 border border-amber-400/30' :
                  'bg-teal-500/20 text-teal-200 border border-teal-400/30'
              }`}>
              {user.role}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(link.to)
                  ? 'bg-navy-700 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Help Card */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100/60 border border-teal-200/60 rounded-2xl p-4">
          <p className="text-xs font-semibold text-teal-800 mb-1">Need help?</p>
          <p className="text-[11px] text-teal-700 leading-relaxed">Report infrastructure issues and track their resolution in real-time.</p>
        </div>
      </div>
    </aside>
  )
}
