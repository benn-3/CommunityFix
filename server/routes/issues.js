const express = require('express')
const router = express.Router()
const { createIssue, listIssues, updateIssue, upvoteIssue, addComment, getIssueById } = require('../controllers/issueController')
const auth = require('../middleware/authMiddleware')
const authorize = require('../middleware/roleMiddleware')
const { validateCreateIssue, validateUpdateIssue, validateComment, validateIdParam } = require('../validators/issueValidator')

router.post('/', auth, authorize('citizen', 'worker'), validateCreateIssue, createIssue)
router.get('/', listIssues)
router.get('/:id', validateIdParam, getIssueById)
router.put('/:id', auth, validateUpdateIssue, updateIssue)
router.post('/:id/upvote', auth, validateIdParam, upvoteIssue)
router.post('/:id/comment', auth, validateComment, addComment)

module.exports = router
