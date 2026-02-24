const express = require('express')
const router = express.Router()
const { listCategories, createCategory, deleteCategory } = require('../controllers/categoryController')
const auth = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')

// Public — needed for dropdowns
router.get('/', listCategories)

// Admin only
router.post('/', auth, authorize('admin'), createCategory)
router.delete('/:id', auth, authorize('admin'), deleteCategory)

module.exports = router
