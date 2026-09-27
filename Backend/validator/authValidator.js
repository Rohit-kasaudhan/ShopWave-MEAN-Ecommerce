const { body, param } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.registerValidator = [
  body("FirstName")
    .notEmpty().withMessage("First name is required")
    .isLength({ min: 3, max: 50 }).withMessage("First name must be between 3 and 50 chars"),
  body("LastName")
    .notEmpty().withMessage("Last name is required")
    .isLength({ min: 3, max: 50 }).withMessage("Last name must be between 3 and 50 chars"),
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({email: value});
      if (user){
        throw new Error("Email already in use");
      }
    }),
  body("phone")
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[6-9][0-9]{9}$/).withMessage("Invalid indian mobile number")
        .custom(async (value) => {
      const user = await User.findOne({phone: value});
      if (user){
        throw new Error("Phone number already in use");
      }
    }),
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
    .isDate().withMessage("Invalid birth date format"),
  body("gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(['male', 'female']).withMessage("Invalid gender value")
];

exports.verifyEmailValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address"),
  body("verificationCode")
    .notEmpty().withMessage("Verification code is required")
    .isLength({ min: 6, max: 6 }).withMessage("Verification code must be 6 digits")
];

exports.loginValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({email: value});
      if (!user){
        throw new Error("Email does not exist");
      }
      }),
  body("password")
    .notEmpty().withMessage("Password is required")
    .custom(async (value, { req }) => {
      const user = await User.findOne({email: req.body.email}).select("+password");
      if (user){
        const isPasswordMatched = await bcrypt.compare(value, user.password);
        if (!isPasswordMatched){
          throw new Error("Invalid password");
        }
      }
    })
];

exports.forgotPasswordValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({email: value});
      if (!user){
        throw new Error("Email does not exist");
      }
    })
];

exports.verifyResetCodeValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({email: value});
      if (!user){
        throw new Error("Email does not exist");
      }
    }),
  body("resetCode")
    .notEmpty().withMessage("Reset code is required")
    .isLength({ min: 6, max: 6 }).withMessage("Reset code must be 6 digits")
];

exports.resetPasswordValidator = [
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email address")
    .custom(async (value) => {
      const user = await User.findOne({email: value});
      if (!user){
        throw new Error("Email does not exist");
      }
    }),
  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/)
    .withMessage("Password must be at least 6 characters and include both lowercase and uppercase letters"),
  body("confirmNewPassword")
    .notEmpty().withMessage("Confirm new password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];