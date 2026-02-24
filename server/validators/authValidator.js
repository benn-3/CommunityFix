const { body, validationResult } = require('express-validator')

/**
 * Middleware that checks validation results and returns structured errors.
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        })
    }
    next()
}

const validateRegister = [
    body('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name')
        .optional().trim().isLength({ max: 100 }).withMessage('Name too long'),
    body('role')
        .optional().isIn(['citizen', 'worker', 'admin']).withMessage('Invalid role'),
    handleValidation,
]

const validateLogin = [
    body('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required'),
    body('role')
        .optional().isIn(['citizen', 'worker', 'admin']).withMessage('Invalid role'),
    handleValidation,
]

module.exports = { validateRegister, validateLogin }
