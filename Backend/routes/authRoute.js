const express = require("express");
const router = express.Router();
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const {
    register,
    verifyEmail,
    login,
    forgotPassword,
    verifyResetCode,
    resetPassword
} = require("../controllers/authController");

const {
    registerValidator,
    verifyEmailValidator,
    loginValidator,
    forgotPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator
} = require("../validator/authValidator");

router.post("/register", registerValidator, validatorMiddleware, register);
router.post("/verifyEmail", verifyEmailValidator, validatorMiddleware, verifyEmail);
router.post("/login", loginValidator, validatorMiddleware, login);
router.post("/forgotPassword", forgotPasswordValidator, validatorMiddleware, forgotPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, validatorMiddleware, verifyResetCode);
router.post("/resetPassword", resetPasswordValidator, validatorMiddleware, resetPassword);

module.exports = router;