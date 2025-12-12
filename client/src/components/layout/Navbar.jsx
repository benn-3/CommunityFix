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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm"
              style={{
                backgroundImage: "url('/image.png')",
                backgroundSize: '100%',
                backgroundPosition: '100% 100%',
                backgroundRepeat: 'no-repeat' 
              }}
              aria-hidden="true"
            />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Community<span className="text-blue-600">Fix</span></span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="text-slate-600 hover:text-blue-600 transition-colors" to="/issues">Issues</Link>
          <Link className="text-slate-600 hover:text-blue-600 transition-colors" to="/report">Report</Link>

          {user ? (
            <>
              <Link
                className="text-slate-600 hover:text-blue-600 transition-colors"
                to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
              >
                Dashboard
              </Link>
              <div className="w-px h-4 bg-slate-300 mx-1"></div>
              <button
                onClick={handleLogout}
                className="text-slate-600 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
            </>
          ) : (
            <>
              <Link className="text-slate-600 hover:text-blue-600 transition-colors" to="/login">Login</Link>
              <Link className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200" to="/register">
                Register
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          {user && (
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200 mr-2">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          )}
          <button aria-label="open menu" onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-slate-100 text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl text-slate-900">Menu</span>
              <button aria-label="close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-slate-100 text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <Link onClick={() => setOpen(false)} to="/" className="block text-lg font-medium text-slate-800 hover:text-blue-600">Home</Link>
              <Link onClick={() => setOpen(false)} to="/issues" className="block text-lg font-medium text-slate-800 hover:text-blue-600">Browse Issues</Link>
              <Link onClick={() => setOpen(false)} to="/report" className="block text-lg font-medium text-slate-800 hover:text-blue-600">Report Issue</Link>

              <div className="h-px bg-slate-100 my-4"></div>

              {user ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    to={user.role === 'admin' ? '/admin' : user.role === 'worker' ? '/worker' : '/dashboard'}
                    className="block text-lg font-medium text-blue-600"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setOpen(false); }}
                    className="block w-full text-left text-lg font-medium text-red-600 mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link onClick={() => setOpen(false)} to="/login" className="block text-lg font-medium text-slate-800 hover:text-blue-600">Login</Link>
                  <Link onClick={() => setOpen(false)} to="/register" className="block mt-4 text-center px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
                    Register Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
