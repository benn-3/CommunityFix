import { useState } from 'react'
import uploadService from '../services/uploadService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

export default function TestUpload() {
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadedUrl, setUploadedUrl] = useState('')
    const [error, setError] = useState('')

    async function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        setSelectedFile(file)
        setError('')
        setUploadedUrl('')
    }

    async function handleUpload() {
        if (!selectedFile) {
            setError('Please select a file first')
            return
        }

        setUploading(true)
        setError('')

        try {
            console.log('Uploading file:', selectedFile.name)
            const result = await uploadService.uploadImage(selectedFile)
            console.log('Upload successful:', result)
            setUploadedUrl(result.url)
            alert('Upload successful! ✅')
        } catch (err) {
            console.error('Upload failed:', err)
            console.error('Error details:', err.response?.data)
            setError(err.response?.data?.message || err.message || 'Upload failed')
            alert('Upload failed! ❌ Check console for details')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-8">
            <Card className="p-8">
                <h1 className="text-2xl font-bold mb-6">🧪 Cloudinary Upload Test</h1>

                <div className="space-y-6">
                    {/* File Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
                        />
                        {selectedFile && (
                            <p className="text-sm text-slate-600 mt-2">
                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || uploading}
                        className="w-full"
                    >
                        {uploading ? '⏳ Uploading...' : '📤 Upload to Cloudinary'}
                    </Button>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800">❌ Error:</p>
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                    )}

                    {/* Success Display */}
                    {uploadedUrl && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-2">✅ Upload Successful!</p>
                            <p className="text-xs text-green-600 break-all mb-3">{uploadedUrl}</p>
                            <img
                                src={uploadedUrl}
                                alt="Uploaded"
                                className="w-full max-h-64 object-contain rounded-lg border border-green-200"
                            />
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 mb-2">📋 Test Instructions:</p>
                        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                            <li>Select an image file (JPG, PNG, GIF, WebP)</li>
                            <li>Click "Upload to Cloudinary"</li>
                            <li>Check browser console (F12) for detailed logs</li>
                            <li>If successful, image will appear below</li>
                            <li>If failed, error message will show</li>
                        </ol>
                    </div>

                    {/* Cloudinary Status */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-sm font-medium text-slate-800 mb-2">🔧 Cloudinary Configuration:</p>
                        <div className="text-xs text-slate-600 space-y-1">
                            <p>• Server should have CLOUDINARY_CLOUD_NAME in .env</p>
                            <p>• Server should have CLOUDINARY_API_KEY in .env</p>
                            <p>• Server should have CLOUDINARY_API_SECRET in .env</p>
                            <p>• Upload endpoint: POST /upload/upload</p>
                            <p>• Requires authentication (login first)</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
