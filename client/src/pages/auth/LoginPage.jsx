import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authService.login({ email, password })
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
      console.error(err)
      alert(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
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
