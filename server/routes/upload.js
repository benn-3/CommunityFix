const express = require('express')
const router = express.Router()
const { upload, uploadToCloudinary } = require('../config/cloudinary')
const auth = require('../middleware/authMiddleware')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

// Upload single image
router.post('/upload', auth, upload.single('image'), asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded')

    const result = await uploadToCloudinary(req.file.buffer)
    res.json({ url: result.secure_url, publicId: result.public_id })
}))

// Upload multiple images
router.post('/upload-multiple', auth, upload.array('images', 5), asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) throw new ApiError(400, 'No files uploaded')

    const results = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)))
    const images = results.map(r => ({ url: r.secure_url, publicId: r.public_id }))
    res.json({ images })
}))

module.exports = router
