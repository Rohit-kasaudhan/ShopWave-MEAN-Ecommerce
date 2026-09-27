const { body, param } = require("express-validator");



exports.createProductValidator = [
  body("name")
    .notEmpty().withMessage("Product name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Product name must be between 3 and 100 chars"),
  body("description")
    .notEmpty().withMessage("Product description is required")
    .isLength({ min: 10, max: 1000 }).withMessage("Product description must be between 10 and 1000 chars"),
  body("price")
    .notEmpty().withMessage("Product price is required")
    .isFloat({ gt: 0 }).withMessage("Product price must be a positive number"),
  body("category")
    .notEmpty().withMessage("Product category is required")
    .isMongoId().withMessage("Category must be a valid category ID"),
  body("stock")
    .notEmpty().withMessage("Product stock is required")
    .isInt({ gt: -1 }).withMessage("Product stock must be a non-negative integer"),
  body("images")
    .custom((value, { req }) => {
      if (!req.files || req.files.length === 0) {
        throw new Error("At least one product image is required");
      }
      return true;
    }),
];

exports.checkIdParamValidator = [
  param('id')
    .notEmpty().withMessage("Product id is required"),
]
