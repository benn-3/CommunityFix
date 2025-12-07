import { useState } from 'react'
import issueService from '../../services/issueService'

export default function IssueForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await issueService.create({ title, description })
      alert('Issue reported')
      setTitle('')
      setDescription('')
    } catch (err) {
      alert(err.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <label>Title</label>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <label>Description</label>
      <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
    </form>
  )
}
