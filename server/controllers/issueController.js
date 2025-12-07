const Issue = require('../models/Issue')

exports.createIssue = async (req, res) => {
  const { title, description } = req.body
  if (!title || !description) return res.status(400).json({ message: 'Missing fields' })
  try {
    const issue = await Issue.create({ title, description, reporter: req.userId })
    res.status(201).json({ message: 'Issue created', issue })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.listIssues = async (req, res) => {
  try {
    const issues = await Issue.find().populate('reporter', 'email')
    res.json({ issues })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
