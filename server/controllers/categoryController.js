const Category = require('../models/Category')

exports.listCategories = async (req, res) => {
    try {
        const categories = await Category.find()
        res.json(categories)
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body
        const category = await Category.create({ name, description })
        res.status(201).json(category)
    } catch (err) {
        res.status(400).json({ message: 'Failed to create category' })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id)
        res.json({ message: 'Category deleted' })
    } catch (err) {
        res.status(500).json({ message: 'Server error' })
    }
}
