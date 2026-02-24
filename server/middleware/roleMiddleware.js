/**
 * Role-based authorization middleware.
 * Must be used AFTER authMiddleware (requires req.userRole).
 *
 * Usage: authorize('admin')  or  authorize('admin', 'worker')
 */
const ApiError = require('../utils/ApiError')

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return next(new ApiError(401, 'Authentication required'))
        }
        if (!allowedRoles.includes(req.userRole)) {
            return next(new ApiError(403, `Access denied. Required role: ${allowedRoles.join(' or ')}`))
        }
        next()
    }
}

module.exports = authorize
