import { Link } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">CF</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">CommunityFix</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="nav-link text-slate-600" to="/issues">Issues</Link>
          <Link className="nav-link text-slate-600" to="/report">Report</Link>
          <Link className="nav-link text-slate-600" to="/login">Login</Link>
          <Link className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition duration-200 transform hover:scale-105" to="/register">Register</Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button aria-label="open menu" onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-slate-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div>
          <div className="mobile-drawer-backdrop" onClick={() => setOpen(false)} />
          <div className="mobile-drawer">
            <div className="flex items-center justify-between mb-4">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">CF</div>
                <span className="font-bold text-slate-900">CommunityFix</span>
              </Link>
              <button aria-label="close menu" onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-slate-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" focusable="false">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2">
              <Sidebar />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
