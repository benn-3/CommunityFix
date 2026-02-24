import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('citizen')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      console.log('Attempting login with:', { email, role })
      const res = await authService.login({ email, password, role })
      console.log('Login response:', res)

      if (res?.token && res?.user) {
        login(res.token, res.user)
        switch (res.user.role) {
          case 'admin': navigate('/admin'); break
          case 'worker': navigate('/worker'); break
          default: navigate('/dashboard'); break
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (err) {
      console.error('Login error:', err)
      console.error('Error response:', err?.response?.data)
      setError(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

        {/* Left Panel */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 flex-col items-center justify-center text-white p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border border-white/20 rounded-full" />
            <div className="absolute bottom-20 right-10 w-48 h-48 border border-white/10 rounded-full" />
          </div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <h2 className="text-3xl font-bold mb-3">Welcome Back</h2>
            <p className="text-navy-200 text-sm leading-relaxed max-w-xs mx-auto">
              Sign in to continue tracking issues and improving your neighborhood.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link to="/" className="text-xs text-navy-300 hover:text-white transition-colors font-medium">
                ← Back to CommunityFix
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <div className="md:hidden text-center mb-6">
            <h2 className="text-2xl font-bold text-navy-900">Welcome Back</h2>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-1">Sign In</h3>
          <p className="text-sm text-slate-400 mb-8">Enter your credentials to access your account</p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all text-sm"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all text-sm"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Login as</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'citizen', label: 'Citizen', icon: '👤' },
                  { value: 'worker', label: 'Worker', icon: '👷' },
                  { value: 'admin', label: 'Admin', icon: '🛡️' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${role === opt.value
                        ? 'bg-navy-700 text-white border-navy-700 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                  >
                    <span>{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-700 text-white font-semibold rounded-xl hover:bg-navy-800 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-navy-700 font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
