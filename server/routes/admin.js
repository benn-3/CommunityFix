const express = require('express')
const router = express.Router()
const { getAnalytics, getWorkers, deleteWorker } = require('../controllers/adminController')
const auth = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

// All admin routes require authentication + admin role
router.get('/analytics', auth, authorize('admin'), getAnalytics)
router.get('/workers', auth, authorize('admin'), getWorkers)
router.delete('/workers/:id', auth, authorize('admin'), deleteWorker)

module.exports = router
