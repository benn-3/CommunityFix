const Issue = require('../models/Issue')

exports.createIssue = async (req, res) => {
  const { title, description, category, location, photos } = req.body
  if (!title || !description || !category) return res.status(400).json({ message: 'Missing fields' })
  try {
    const issue = await Issue.create({
      title,
      description,
      category,
      location,
      photos: photos || [],
      reporter: req.userId
    })
    res.status(201).json({ message: 'Issue created', issue })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.listIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('reporter', 'email').populate('assignedTo', 'email name')
    res.json({ issues })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.updateIssue = async (req, res) => {
  const { id } = req.params
  // Allow these fields to be updated
  const { status, assignedTo, resolutionPhotos, workerNotes, priority } = req.body

  console.log('Update issue request:', { id, body: req.body })

  try {
    const issue = await Issue.findById(id)
    if (!issue) {
      console.log('Issue not found:', id)
      return res.status(404).json({ message: 'Issue not found' })
    }

    console.log('Current issue:', {
      title: issue.title,
      status: issue.status,
      assignedTo: issue.assignedTo
    })

    if (status) issue.status = status
    if (assignedTo) issue.assignedTo = assignedTo
    if (resolutionPhotos) issue.resolutionPhotos = resolutionPhotos
    if (workerNotes) issue.workerNotes = workerNotes
    if (priority) issue.priority = priority

    await issue.save()

    console.log('Issue updated successfully:', {
      title: issue.title,
      status: issue.status,
      assignedTo: issue.assignedTo,
      priority: issue.priority
    })

    res.json({ message: 'Issue updated', issue })
  } catch (err) {
    console.error('Update issue error:', err)
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

exports.upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
    if (!issue) return res.status(404).json({ message: 'Issue not found' })

    const userId = req.userId
    const index = issue.upvotes.indexOf(userId)
    if (index === -1) {
      issue.upvotes.push(userId)
    } else {
      issue.upvotes.splice(index, 1)
    }

    await issue.save()
    res.json(issue)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body
    if (!text) return res.status(400).json({ message: 'Comment text is required' })

    const issue = await Issue.findById(req.params.id)
    if (!issue) return res.status(404).json({ message: 'Issue not found' })

    const comment = {
      user: req.userId,
      text,
      createdAt: new Date()
    }

    issue.comments.push(comment)
    await issue.save()

    // Return updated issue with populated comments
    const populatedIssue = await Issue.findById(req.params.id)
      .populate('comments.user', 'name email')
      .populate('reporter', 'name email')

    res.json(populatedIssue)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email')
    if (!issue) return res.status(404).json({ message: 'Issue not found' })
    res.json(issue)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
