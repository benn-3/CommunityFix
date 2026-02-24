const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { config } = require('../config/env')

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const role = req.body.role || 'citizen'

  const existing = await User.findOne({ email })
  if (existing) {
    throw new ApiError(409, 'Email already registered')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await User.create({ name, email, password: hash, role })

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )

  res.status(201).json({
    message: 'User registered successfully',
    token,
    role: user.role,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

exports.login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw new ApiError(401, 'Invalid credentials')
  }

  // Validate role if provided
  if (role && user.role !== role) {
    throw new ApiError(403, `Access denied. You are registered as ${user.role}, not ${role}.`)
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  )

  res.json({
    token,
    user: {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})
