const User = require('../models/User')
const Issue = require('../models/Issue')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

exports.getAnalytics = asyncHandler(async (req, res) => {
    const [totalIssues, pendingIssues, resolvedIssues, categoryStats, totalWorkers] = await Promise.all([
        Issue.countDocuments(),
        Issue.countDocuments({ status: 'pending' }),
        Issue.countDocuments({ status: { $in: ['resolved', 'closed'] } }),
        Issue.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
        User.countDocuments({ role: 'worker' })
    ])

    res.json({
        totalIssues,
        pendingIssues,
        resolvedIssues,
        categoryStats,
        totalWorkers
    })
})

exports.getWorkers = asyncHandler(async (req, res) => {
    const workers = await User.find({ role: 'worker' }).select('-password').lean()
    res.json(workers)
})

exports.deleteWorker = asyncHandler(async (req, res) => {
    const worker = await User.findById(req.params.id)
    if (!worker) throw new ApiError(404, 'Worker not found')
    if (worker.role !== 'worker') throw new ApiError(400, 'User is not a worker')

    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Worker removed' })
})
