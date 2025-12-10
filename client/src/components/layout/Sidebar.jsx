import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Sidebar({ className = '' }) {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`w-full ${className}`}>
      <div className="space-y-6 sticky top-24">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-1">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              {user ? 'Welcome back' : 'Welcome'}
            </p>
            {user?.role && (
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                  user.role === 'worker' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                    'bg-blue-100 text-blue-700 border-blue-200'
                }`}>
                {user.role}
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-slate-900 truncate">
            {user ? (user.name || user.email?.split('@')[0] || 'Member') : 'Guest'}
          </h3>
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
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive(link.to)
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
