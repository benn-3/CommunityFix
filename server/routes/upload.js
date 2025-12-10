const express = require('express')
const router = express.Router()
const { upload, uploadToCloudinary } = require('../config/cloudinary')
const auth = require('../middleware/authMiddleware')

// Upload single image
router.post('/upload', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const result = await uploadToCloudinary(req.file.buffer)

        res.json({
            url: result.secure_url,
            publicId: result.public_id
        })
    } catch (err) {
        console.error('Upload error:', err)
        res.status(500).json({ message: 'Failed to upload image' })
    }
})

// Upload multiple images
router.post('/upload-multiple', auth, upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' })
        }

        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer))
        const results = await Promise.all(uploadPromises)

        const urls = results.map(result => ({
            url: result.secure_url,
            publicId: result.public_id
        }))

        res.json({ images: urls })
    } catch (err) {
        console.error('Upload error:', err)
        res.status(500).json({ message: 'Failed to upload images' })
    }
})

module.exports = router
