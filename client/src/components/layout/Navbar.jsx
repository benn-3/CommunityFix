import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="container flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">CF</div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">CommunityFix</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link className="text-slate-600 hover:text-blue-600 transition duration-200" to="/issues">Issues</Link>
          <Link className="text-slate-600 hover:text-blue-600 transition duration-200" to="/report">Report</Link>
          <Link className="text-slate-600 hover:text-blue-600 transition duration-200" to="/login">Login</Link>
          <Link className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition duration-200 transform hover:scale-105" to="/register">Register</Link>
        </nav>
      </div>
    </header>
  )
}
