const express = require('express')
const router = express.Router()
const { createIssue, listIssues } = require('../controllers/issueController')
const auth = require('../middleware/authMiddleware')

router.post('/', auth, createIssue)
router.get('/', listIssues)

module.exports = router
