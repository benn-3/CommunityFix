const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['citizen', 'admin', 'worker'], default: 'citizen' }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
