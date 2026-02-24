import { useState, useEffect } from 'react'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import issueService from '../../services/issueService'
import uploadService from '../../services/uploadService'
import { useNavigate } from 'react-router-dom'

export default function CreateIssue() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Infrastructure')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedUrls, setUploadedUrls] = useState([])
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    issueService.getCategories()
      .then(data => {
        if (data && data.length > 0) {
          setCategories(data)
          setCategory(data[0].name)
        }
      })
      .catch(console.error)
  }, [])

  function validate() {
    const e = {}
    if (!title.trim()) e.title = 'Title is required'
    if (!description.trim()) e.description = 'Description is required'
    return e
  }

  async function handleFileChange(e) {
    const files = Array.from(e.target.files)
    if (files.length > 5) { alert('Maximum 5 images allowed'); return }

    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024
      if (!validTypes.includes(file.type)) { alert(`${file.name} is not a valid image type`); return false }
      if (file.size > maxSize) { alert(`${file.name} exceeds 5MB limit`); return false }
      return true
    })

    setSelectedFiles(validFiles)

    if (validFiles.length > 0) {
      setUploading(true)
      try {
        if (validFiles.length === 1) {
          const result = await uploadService.uploadImage(validFiles[0])
          setUploadedUrls([result.url])
        } else {
          const result = await uploadService.uploadMultipleImages(validFiles)
          setUploadedUrls(result.images.map(img => img.url))
        }
      } catch (err) {
        console.error(err)
        alert('Failed to upload images. Please try again.')
      } finally {
        setUploading(false)
      }
    }
  }

  function removeImage(index) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setUploadedUrls(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const eObj = validate()
    if (Object.keys(eObj).length) { setErrors(eObj); return }
    setErrors({})
    setSaving(true)
    try {
      await issueService.create({ title, category, description, location, photos: uploadedUrls })
      navigate('/issues')
    } catch (err) {
      console.error(err)
      alert(err?.response?.data?.message || 'Failed to create issue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy-900">Report an Issue</h1>
          <p className="text-sm text-slate-400 mt-1">Help improve your community by reporting infrastructure problems.</p>
        </div>

        <Card className="p-6 md:p-8" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              label="Title"
              error={errors.title}
              placeholder="Brief summary of the issue"
            />

            <Select
              label="Category"
              options={
                categories.length > 0
                  ? categories.map(c => ({ value: c.name, label: c.name }))
                  : [
                    { value: 'Infrastructure', label: 'Infrastructure' },
                    { value: 'Water', label: 'Water Supply' },
                    { value: 'Other', label: 'Other' }
                  ]
              }
              value={category}
              onChange={e => setCategory(e.target.value)}
            />

            <Input
              value={location}
              onChange={e => setLocation(e.target.value)}
              label="Location (Optional)"
              placeholder="e.g. 5th Main Road, Indiranagar"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              }
            />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Photos (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all duration-200">
                <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" id="file-upload" disabled={uploading} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">
                      {uploading ? 'Uploading…' : 'Click to upload images'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG, GIF up to 5MB (Max 5)</p>
                  </div>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden">
                      <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover" />
                      <button type="button" onClick={() => removeImage(index)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows="5"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 transition-all ${errors.description ? 'border-red-400' : ''}`}
                placeholder="Describe the issue in detail…"
              />
              {errors.description && <p className="text-xs text-red-500 mt-1.5">⚠ {errors.description}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="accent" disabled={saving || uploading}>
                {saving ? 'Submitting…' : uploading ? 'Uploading…' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
