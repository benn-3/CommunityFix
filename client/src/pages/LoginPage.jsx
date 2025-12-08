import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Link, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import { useAuth } from '../hooks/useAuth'

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
      // expect { token }
      if (res?.token) {
        login(res.token)
        navigate('/')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch(err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Sign in to CommunityFix</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <div className="flex items-center justify-between">
              <div className="text-sm"><Link to="/forgot" className="text-[var(--brand)]">Forgot?</Link></div>
              <Button type="submit">{loading ? 'Signing in...' : 'Sign in'}</Button>
            </div>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">Don't have an account? <Link to="/register" className="text-[var(--brand)]">Create free account</Link></p>
      </div>
    </div>
  )
}
