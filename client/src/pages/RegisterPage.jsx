import { useState } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { Link, useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise(r => setTimeout(r, 700))
      navigate('/login')
    } catch {
      alert('Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <h3 className="text-xl font-semibold mb-4">Create an account</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <div className="flex justify-end">
              <Button type="submit">{loading ? 'Creating...' : 'Create Account'}</Button>
            </div>
          </form>
        </Card>
        <p className="mt-4 text-center text-sm text-gray-600">Already registered? <Link to="/login" className="text-[var(--brand)]">Sign in</Link></p>
      </div>
    </div>
  )
}
