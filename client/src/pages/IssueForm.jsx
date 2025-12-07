import { useState } from 'react'
import api from '../services/api'
import { authHeader } from '../services/auth'

export default function IssueForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const headers = authHeader()
      const res = await api.post('/issues', { title, description }, { headers })
      setMessage(res.data?.message || 'Issue reported')
      setTitle('')
      setDescription('')
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to report issue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Report an Issue</h2>
      <form onSubmit={submit} className="form">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required />
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} required />
        <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      </form>
      {message && <p className="info">{message}</p>}
    </div>
  )
}
