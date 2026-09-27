const express = require('express');
const upload = require('../middlewares/upload');
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { protect, allowedTo } = require('../middlewares/authMiddleware');

const { getAllProducts, createProduct, getProduct, deleteProduct, updateProduct, deleteProductImage, addProductImage } = require('../controllers/productController');

const { createProductValidator, checkIdParamValidator } = require('../validator/productValidator');



const router = express.Router();

router.route('/')
    .get(getAllProducts)
    .post(protect, allowedTo('admin'), upload.array("images", 4), createProductValidator, validatorMiddleware, createProduct);
router.route('/:id')
    .get(checkIdParamValidator, getProduct)
    .put(protect, allowedTo('admin'), checkIdParamValidator, updateProduct)
    .delete(protect, allowedTo('admin'), checkIdParamValidator, deleteProduct);
router.route('/:id/images')
    .post(protect, allowedTo('admin'), upload.array("images", 4), checkIdParamValidator, addProductImage)
    .delete(protect, allowedTo('admin'), checkIdParamValidator, deleteProductImage);

module.exports = router;