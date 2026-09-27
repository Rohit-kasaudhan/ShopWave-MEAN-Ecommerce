const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('-__v');
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
            message: 'Categories retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await Category.findOne({ uuid: req.params.id }).select('-__v');
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            data: category,
            message: 'Category retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json({
            success: true,
            data: category,
            message: 'Category created successfully',
        });
    } catch (error) {
        ///////////////////if it is a dublicate name
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { uuid: req.params.id },
            req.body,
            { new: true, runValidators: true }
        ).select('-__v');

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            data: category,
            message: 'Category updated successfully',
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists',
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ uuid: req.params.id });
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
