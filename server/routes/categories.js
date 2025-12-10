const express = require('express')
const router = express.Router()
const { listCategories, createCategory, deleteCategory } = require('../controllers/categoryController')
const auth = require('../middleware/authMiddleware')

router.get('/', listCategories) // Public read? Or authenticated? Let's make it public/open for dropdowns.
router.post('/', auth, createCategory)
router.delete('/:id', auth, deleteCategory)

module.exports = router
