import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      console.log('Attempting login with:', { email, role })
      const res = await authService.login({ email, password, role })
      console.log('Login response:', res)

      if (res?.token && res?.user) {
        login(res.token, res.user)
        alert(`Logged in successfully as ${res.user.role}!`)

        switch (res.user.role) {
          case 'admin':
            navigate('/admin')
            break
          case 'worker':
            navigate('/worker')
            break
          default:
            navigate('/dashboard')
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err?.response?.data)
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed'
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px]">

        {/* Left Side - Blue Gradient */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 flex-col items-center justify-center text-white p-10 relative">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l-.9-1.352A1.15 1.15 0 0011 13.628L10.975 14H5a2 2 0 01-2-2V5zm6.5 6A2.5 2.5 0 1012 8.5 2.5 2.5 0 009.5 11z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-center text-blue-100 mb-8 max-w-xs">
            We are glad to see you again! Log in to continue reporting issues and improving your neighborhood.
          </p>
          <Link to="/" className="px-8 py-2.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors cursor-pointer">
            CommunityFix
          </Link>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
          {/* Mobile header */}
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Welcome Back</h2>
          </div>

          <h3 className="text-3xl text-gray-700 font-bold text-center mb-8">Login Here</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-sm"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 px-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-orange-500 focus:ring-orange-500" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot" className="text-blue-600 font-bold hover:underline">Forgot Password?</Link>
            </div>

            {/* Role Selection Dropdown */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 font-semibold text-lg">
                  {role === 'admin' ? '🛡️' : role === 'worker' ? '👷' : '👤'}
                </span>
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-700 font-medium appearance-none cursor-pointer hover:bg-gray-100"
              >
                <option value="citizen">Citizen</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 group-hover:text-blue-600 transition-colors">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
              <label className="absolute -top-2 left-2 px-1 text-xs font-semibold text-blue-600 bg-white">Select Role</label>
            </div>

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
