import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const auth = useAuth()
  const user = auth?.user
  const logout = auth?.logout
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow"
            style={{
              backgroundImage: "url('/image.png')",
              backgroundSize: '100%',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
            aria-hidden="true"
          />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-navy-900">Community</span>
            <span className="text-teal-600">Fix</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <Link className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 rounded-lg transition-all duration-200" to="/issues">
                Issues
              </Link>
              <Link className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 rounded-lg transition-all duration-200" to="/report">
                Report
              </Link>
            </>
          )}

          {user ? (
            <>
              <Link
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 rounded-lg transition-all duration-200"
                to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
              >
                Dashboard
              </Link>

              <div className="w-px h-5 bg-slate-200 mx-2" />

              <button
                onClick={handleLogout}
                className="px-3.5 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer"
              >
                Logout
              </button>

              <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-navy-700 to-teal-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </>
          ) : (
            <>
              <Link className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 rounded-lg transition-all duration-200" to="/login">
                Sign in
              </Link>
              <Link className="ml-1 px-5 py-2 rounded-lg bg-navy-700 text-white text-sm font-semibold hover:bg-navy-800 transition-all duration-200 shadow-sm hover:shadow-md" to="/register">
                Get Started
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {user && (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-navy-700 to-teal-600 text-white flex items-center justify-center font-semibold text-xs mr-1">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <button aria-label="open menu" onClick={() => setOpen(true)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-navy-950/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-lg text-navy-900">Menu</span>
              <button aria-label="close menu" onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="space-y-1">
              <Link onClick={() => setOpen(false)} to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-700 transition-all">
                🏠 Home
              </Link>
              {user && (
                <>
                  <Link onClick={() => setOpen(false)} to="/issues" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-700 transition-all">
                    📋 Browse Issues
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/report" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-navy-700 transition-all">
                    ✏️ Report Issue
                  </Link>
                </>
              )}

              <div className="h-px bg-slate-100 my-3" />

              {user ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-navy-700 bg-navy-50 hover:bg-navy-100 transition-all"
                  >
                    📊 Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all mt-1 cursor-pointer"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} to="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50 transition-all">
                    Sign in
                  </Link>
                  <Link onClick={() => setOpen(false)} to="/register" className="block mt-3 text-center px-4 py-3 rounded-xl bg-navy-700 text-white font-semibold hover:bg-navy-800 shadow-md transition-all">
                    Create Account
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
