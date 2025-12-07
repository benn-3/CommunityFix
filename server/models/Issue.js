const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open','in_progress','closed'], default: 'open' }
}, { timestamps: true })

module.exports = mongoose.model('Issue', IssueSchema)
