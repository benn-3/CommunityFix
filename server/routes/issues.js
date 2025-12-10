const express = require('express')
const router = express.Router()
const { createIssue, listIssues, updateIssue, upvoteIssue, addComment, getIssueById } = require('../controllers/issueController')
const auth = require('../middleware/authMiddleware')

router.post('/', auth, createIssue)
router.get('/', listIssues)
router.get('/:id', getIssueById)
router.put('/:id', auth, updateIssue)
router.post('/:id/upvote', auth, upvoteIssue)
router.post('/:id/comment', auth, addComment)

module.exports = router
