import { useState } from 'react'
import authService from '../../services/authService'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    try {
      await authService.register({ email, password })
      alert('Registered — please login')
    } catch (err) {
      alert(err.message || 'Failed')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  )
}
