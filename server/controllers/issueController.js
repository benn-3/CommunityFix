const Issue = require('../models/Issue')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

exports.createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, location, photos } = req.body

  const issue = await Issue.create({
    title,
    description,
    category,
    location,
    photos: photos || [],
    reporter: req.userId
  })

  res.status(201).json({ message: 'Issue created', issue })
})

exports.listIssues = asyncHandler(async (req, res) => {
  // Pagination
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50))
  const skip = (page - 1) * limit

  // Optional filters
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  if (req.query.category) filter.category = req.query.category

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('reporter', 'email name')
      .populate('assignedTo', 'email name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Issue.countDocuments(filter)
  ])

  res.json({
    issues,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  })
})

exports.getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
    .populate('reporter', 'name email')
    .populate('assignedTo', 'name email')
    .populate('comments.user', 'name email')

  if (!issue) throw new ApiError(404, 'Issue not found')

  res.json(issue)
})

exports.updateIssue = asyncHandler(async (req, res) => {
  const { status, assignedTo, resolutionPhotos, workerNotes, priority } = req.body

  const issue = await Issue.findById(req.params.id)
  if (!issue) throw new ApiError(404, 'Issue not found')

  if (status) issue.status = status
  if (assignedTo) issue.assignedTo = assignedTo
  if (resolutionPhotos) issue.resolutionPhotos = resolutionPhotos
  if (workerNotes) issue.workerNotes = workerNotes
  if (priority) issue.priority = priority

  await issue.save()

  res.json({ message: 'Issue updated', issue })
})

exports.upvoteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id)
  if (!issue) throw new ApiError(404, 'Issue not found')

  const userId = req.userId
  const index = issue.upvotes.indexOf(userId)
  if (index === -1) {
    issue.upvotes.push(userId)
  } else {
    issue.upvotes.splice(index, 1)
  }

  await issue.save()
  res.json(issue)
})

exports.addComment = asyncHandler(async (req, res) => {
  const { text } = req.body

  const issue = await Issue.findById(req.params.id)
  if (!issue) throw new ApiError(404, 'Issue not found')

  issue.comments.push({
    user: req.userId,
    text,
    createdAt: new Date()
  })

  await issue.save()

  // Populate in one query using the same document
  await issue.populate([
    { path: 'comments.user', select: 'name email' },
    { path: 'reporter', select: 'name email' }
  ])

  res.json(issue)
})
