import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'citizen'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      })

      if (res.token && res.user) {
        login(res.token, res.user)
        alert(`Registered successfully as ${res.user.role}!`)

        if (res.user.role === 'admin') navigate('/admin')
        else if (res.user.role === 'worker') navigate('/worker')
        else navigate('/dashboard')
      } else {
        navigate('/login')
      }

    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[550px]">

        {/* Left Side - Blue Gradient */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 flex-col items-center justify-center text-white p-10 relative">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4">Join Us</h2>
          <p className="text-center text-blue-100 mb-8 max-w-xs">
            Subscribe to make your community a better place to live. Report issues, track progress, and help us fix things together.
          </p>
          <Link to="/" className="px-8 py-2.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors cursor-pointer block mt-8">
            CommunityFix
          </Link>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center bg-white relative">
          <div className="md:hidden text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Join Us</h2>
          </div>

          <h3 className="text-3xl text-gray-700 font-bold text-center mb-8">Register Here</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                required
              />
            </div>

            {/* Attractive Role Selection */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400 font-semibold text-lg">
                  {formData.role === 'admin' ? '🛡️' : formData.role === 'worker' ? '👷' : '👤'}
                </span>
              </div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-700 font-medium appearance-none cursor-pointer hover:bg-gray-100"
              >
                <option value="citizen">Citizen Account</option>
                <option value="worker">Worker / Technician</option>
                <option value="admin">Admin / Officer</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 group-hover:text-blue-600 transition-colors">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
              <label className="absolute -top-2 left-2 px-1 text-xs font-semibold text-blue-600 bg-white">Select Role</label>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
