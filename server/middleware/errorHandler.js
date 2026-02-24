/**
 * Global error handling middleware.
 * Must be registered LAST in the middleware chain.
 */
const { config } = require('../config/env')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
    // Default status and message
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400
        message = 'Invalid ID format'
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 409
        const field = Object.keys(err.keyValue || {})[0]
        message = `Duplicate value for '${field}'`
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400
        const messages = Object.values(err.errors).map(e => e.message)
        message = messages.join(', ')
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token'
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token expired'
    }

    // Multer file size error
    if (err.code === 'LIMIT_FILE_SIZE') {
        statusCode = 400
        message = 'File too large. Maximum size is 5MB'
    }

    // Log in development
    if (!config.isProduction) {
        console.error(`[ERROR] ${statusCode} — ${message}`)
        if (statusCode === 500) console.error(err.stack)
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...((!config.isProduction && statusCode === 500) && { stack: err.stack })
    })
}
