const User = require('../models/User')
const Issue = require('../models/Issue')

exports.getAnalytics = async (req, res) => {
    try {
        const totalIssues = await Issue.countDocuments()
        const pendingIssues = await Issue.countDocuments({ status: 'pending' })
        const resolvedIssues = await Issue.countDocuments({ status: { $in: ['resolved', 'closed'] } })

        // Group by category
        const categoryStats = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ])

        const totalWorkers = await User.countDocuments({ role: 'worker' })

        res.json({
            totalIssues,
            pendingIssues,
            resolvedIssues,
            categoryStats,
            totalWorkers
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

exports.getWorkers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password')
        res.json(workers)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

exports.deleteWorker = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'Worker removed' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}
