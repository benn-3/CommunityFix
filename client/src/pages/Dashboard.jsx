import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Dashboard() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    api.get('/')
      .then(res => setMessage(res.data || 'API reachable'))
      .catch(() => setMessage('Could not reach backend'))
  }, [])

  return (
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
      <p>Use the navigation to report issues or manage your account.</p>
    </div>
  )
}
