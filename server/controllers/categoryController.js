const Category = require('../models/Category')
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')

exports.listCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().lean()
    res.json(categories)
})

exports.createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name || !name.trim()) throw new ApiError(400, 'Category name is required')

    const existing = await Category.findOne({ name: name.trim() })
    if (existing) throw new ApiError(409, 'Category already exists')

    const category = await Category.create({ name: name.trim(), description })
    res.status(201).json(category)
})

exports.deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) throw new ApiError(404, 'Category not found')

    res.json({ message: 'Category deleted' })
})
