const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' })
  try {
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({
      name,
      email,
      password: hash,
      role: req.body.role || 'citizen'
    })
    // Generate token immediately after registration
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

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
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.login = async (req, res) => {
  const { email, password, role } = req.body

  console.log('Login attempt:', { email, role, hasPassword: !!password })

  if (!email || !password) {
    console.log('Missing credentials')
    return res.status(400).json({ message: 'Missing email or password' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      console.log('User not found:', email)
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    console.log('User found:', { email: user.email, role: user.role })

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      console.log('Password mismatch')
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Validating Role - only if role is provided
    if (role && user.role !== role) {
      console.log('Role mismatch:', { requested: role, actual: user.role })
      return res.status(403).json({
        message: `Access denied. You are registered as ${user.role}, not ${role}.`
      })
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    console.log('Login successful:', { email: user.email, role: user.role })

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id, // Add id field for compatibility
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
