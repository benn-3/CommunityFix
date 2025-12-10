const express = require('express')
const router = express.Router()
const { getAnalytics, getWorkers, deleteWorker } = require('../controllers/adminController')
const auth = require('../middleware/authMiddleware')

// All admin routes require auth. Ideally middleware also checks role='admin'
router.get('/analytics', auth, getAnalytics)
router.get('/workers', auth, getWorkers)
router.delete('/workers/:id', auth, deleteWorker)

module.exports = router
