import { useState } from 'react'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import issueService from '../../services/issueService'
import { useNavigate } from 'react-router-dom'

export default function CreateIssue() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Infrastructure')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  function validate() {
    const e = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const eObj = validate()
    if (Object.keys(eObj).length) {
      setErrors(eObj)
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const payload = { title, category, description }
      await issueService.create(payload)
      alert('Issue created')
      setTitle(''); setDescription('')
      navigate('/issues')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to create issue')
    } finally {
      setSaving(false)
    }
  }

  const navigate = useNavigate()

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Report an Issue</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input value={title} onChange={e => setTitle(e.target.value)} label="Title" error={errors.title} placeholder="Brief summary of the issue" />
            <Select label="Category" options={[
              { value: 'Infrastructure', label: 'Infrastructure' },
              { value: 'Sanitation', label: 'Sanitation' },
              { value: 'Maintenance', label: 'Maintenance' },
              { value: 'Other', label: 'Other' },
            ]} value={category} onChange={e => setCategory(e.target.value)} />
            <label className="block text-sm">
              <span className="block text-sm font-medium text-slate-700 mb-1.5">Description</span>
              <textarea
                rows="6"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Detailed description of the problem..."
              />
              {errors.description && <p className="text-xs text-red-600 mt-1.5">{errors.description}</p>}
            </label>

            <div className="flex justify-end">
              <Button type="submit" className="px-6">{saving ? 'Submitting...' : 'Submit Issue'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
