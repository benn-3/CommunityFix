const { body, param, validationResult } = require('express-validator')

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

const validateCreateIssue = [
    body('title')
        .trim().notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
    body('description')
        .trim().notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters'),
    body('category')
        .trim().notEmpty().withMessage('Category is required'),
    body('location')
        .optional().trim().isLength({ max: 500 }).withMessage('Location too long'),
    body('photos')
        .optional().isArray({ max: 5 }).withMessage('Maximum 5 photos allowed'),
    handleValidation,
]

const validateUpdateIssue = [
    param('id').isMongoId().withMessage('Invalid issue ID'),
    body('status')
        .optional().isIn(['pending', 'approved', 'assigned', 'in_progress', 'resolved', 'closed'])
        .withMessage('Invalid status'),
    body('assignedTo')
        .optional().isMongoId().withMessage('Invalid worker ID'),
    body('priority')
        .optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    handleValidation,
]

const validateComment = [
    param('id').isMongoId().withMessage('Invalid issue ID'),
    body('text')
        .trim().notEmpty().withMessage('Comment text is required')
        .isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1-2000 characters'),
    handleValidation,
]

const validateIdParam = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    handleValidation,
]

module.exports = { validateCreateIssue, validateUpdateIssue, validateComment, validateIdParam }
