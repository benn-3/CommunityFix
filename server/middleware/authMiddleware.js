const jwt = require('jsonwebtoken')
const { config } = require('../config/env')
const ApiError = require('../utils/ApiError')

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

  if (!token) {
    return next(new ApiError(401, 'Authentication required. No token provided'))
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.userId = decoded.userId
    req.userRole = decoded.role
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please login again'))
    }
    return next(new ApiError(401, 'Invalid token'))
  }
}
