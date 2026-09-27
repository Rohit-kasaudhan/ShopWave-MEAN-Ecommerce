const { body, param } = require("express-validator");

exports.createUserValidator = [
  body("FirstName")
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 3, max: 50 }).withMessage("First name must be between 3 and 50 chars"),
  body("LastName")
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Last name must be between 3 and 50 chars"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),
  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[6-9][0-9]{9}$/).withMessage("Invalid Egyption mobile number"),
  body("password")
    .notEmpty().withMessage("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage("Password must be at least 6 characters and include both lowercase and uppercase letters"),
  body("confirmPassword")
    .notEmpty().withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("birthDate")
    .notEmpty().withMessage("Birth date is required")
    .custom((val) => {
      if (isNaN(Date.parse(val))) {
        throw new Error("Invalid birth date format");
      }
      return true;
    }),
  body("gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(['male', 'female']).withMessage("Invalid gender value"),
  body("role")
    .optional()
    .isIn(['user', 'admin']).withMessage("Invalid role value")
];

exports.updateUserValidator = [
  param("uuid")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid ID length"), 
  body("FirstName")
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage("First name must be between 3 and 50 chars"),
  body("LastName")
    .optional()
    .isLength({ min: 3, max: 50 }).withMessage("Last name must be between 3 and 50 chars"),
  body("email")
    .optional()
    .isEmail().withMessage("Invalid email address"),
  body("phone")
    .optional()
    .matches(/^[6-9][0-9]{9}$/).withMessage("Invalid Egyption mobile number"), 
  body("birthDate")
    .optional()
    .custom((val) => {
      if (val && isNaN(Date.parse(val))) {
        throw new Error("Invalid birth date format");
      }
      return true;
    }),
  body("gender")
    .optional()
    .isIn(['male', 'female']).withMessage("Invalid gender value"),
  body("role")
    .optional()
    .isIn(['user', 'admin']).withMessage("Invalid role value")
];

exports.getUserValidator = [
  param("uuid")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid ID length"),
];

exports.deleteUserValidator = [
  param("uuid")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid ID length"),
];

exports.changePasswordValidator = [
  param("uuid")
    .notEmpty().withMessage("User ID is required")
    .isUUID().withMessage("Invalid ID length"),
  body("oldPassword")
    .notEmpty().withMessage("Old password is required"),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage("New password must be at least 6 characters and include both lowercase and uppercase letters"),
];
