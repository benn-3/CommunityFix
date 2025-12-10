const mongoose = require('mongoose')

const IssueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String }, // Coordinates or address string
  photos: [{ type: String }], // Array of URLs
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionPhotos: [{ type: String }],
  workerNotes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'assigned', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Issue', IssueSchema)
