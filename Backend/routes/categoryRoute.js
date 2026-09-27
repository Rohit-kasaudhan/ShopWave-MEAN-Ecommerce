const express = require('express');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const { protect, allowedTo } = require('../middlewares/authMiddleware');

const {
    getAllCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

const {
    createCategoryValidator,
    updateCategoryValidator,
    checkIdParamValidator,
} = require('../validator/categoryValidator');

const router = express.Router();

router.route('/')
    .get(getAllCategories)
    .post(protect, allowedTo('admin'), createCategoryValidator, validatorMiddleware, createCategory);

router.route('/:id')
    .get(checkIdParamValidator, validatorMiddleware, getCategory)
    .put(protect, allowedTo('admin'), updateCategoryValidator, validatorMiddleware, updateCategory)
    .delete(protect, allowedTo('admin'), checkIdParamValidator, validatorMiddleware, deleteCategory);

module.exports = router;
