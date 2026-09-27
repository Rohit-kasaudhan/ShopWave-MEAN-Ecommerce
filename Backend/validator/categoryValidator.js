const { body, param } = require('express-validator');
const Category = require('../models/category');

exports.createCategoryValidator = [
    body('name')
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters')
        .custom(async (value) => {
            const existing = await Category.findOne({ name: { $regex: new RegExp(`^${value}$`, 'i') } });
            if (existing) throw new Error('A category with this name already exists');
        }),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

exports.updateCategoryValidator = [
    param('id')
        .notEmpty().withMessage('Category ID is required'),
    body('name')
        .optional()
        .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
];

exports.checkIdParamValidator = [
    param('id')
        .notEmpty().withMessage('Category ID is required'),
];
