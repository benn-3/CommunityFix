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
    if (files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB

      if (!validTypes.includes(file.type)) {
        alert(`${file.name} is not a valid image type`)
        return false
      }
      if (file.size > maxSize) {
        alert(`${file.name} exceeds 5MB limit`)
        return false
      }
      return true
    })

    setSelectedFiles(validFiles)

    // Auto-upload files
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
    if (Object.keys(eObj).length) {
      setErrors(eObj)
      return
    }
    setErrors({})
    setSaving(true)
    try {
      const payload = {
        title,
        category,
        description,
        location,
        photos: uploadedUrls
      }
      await issueService.create(payload)
      alert('Issue created successfully!')
      setTitle('')
      setDescription('')
      setLocation('')
      setSelectedFiles([])
      setUploadedUrls([])
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Report an Issue</h1>
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            />

            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload Photos (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-slate-600 font-medium">
                      {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB (Max 5 images)</p>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                          <div className="text-white text-xs">Uploading...</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
              <Button type="submit" className="px-6" disabled={saving || uploading}>
                {saving ? 'Submitting...' : uploading ? 'Uploading Images...' : 'Submit Issue'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
