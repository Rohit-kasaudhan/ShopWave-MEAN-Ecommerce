const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const sendEmail = require("../utils/sendEmail");

exports.register = async (req, res) => {
    try {
        const { confirmPassword, ...userData } = req.body;
        const user = await User.create(userData);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d',
        });

        return res.status(201).json({
            success: true,
            token,
            data: user,
            message: "Registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email }); 
    try {

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.verificationCode ) {
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "No verification code found. Please request a new one.",
            });
        }
        const isCodeValid = await bcrypt.compare(verificationCode, user.verificationCode);

        if (!isCodeValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification code",
            });
        }
        if (Date.now() > user.verificationCodeExpires) {
            user.verificationCode = null;
            user.verificationCodeExpires = null;
            await user.save();
            return res.status(400).json({
                success: false,
                message: "Expired verification code",
            });
        }
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d',
        });
        res.status(201).json({
            success: true,
            token,
            data: user,
            message: "User registered successfully",
        });

    } catch (error) {
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email does not exist",
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
            expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '7d',
        });

        res.status(200).json({
            success: true,
            token,
            data: user,
            message: "User logged in successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.forgotPassword = async (req, res) => {
    if (!req.body.email){
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
    }
    /////////////////for reset code //////////////////
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = await bcrypt.hash(resetCode, 12);
    const passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.findOneAndUpdate({ email: req.body.email }, { passwordResetCode: hashedResetCode, passwordResetExpires }, { new: true });

    try{
        await sendEmail({
            to: user.email,
            subject: "Your password reset code (valid for 10 minutes)",
            text: `Your password reset code is: ${resetCode}`,
        });    
        return res.status(200).json({
            success: true,
            message: "Password reset code sent successfully",
        });
    } catch (error) {

        console.error("Error sending email:", error);
        
        user.passwordResetCode = null;
        user.passwordResetExpires = null;
        await user.save();

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }



}

exports.verifyResetCode = async (req, res) => {
    const { email, resetCode } = req.body;
    const user = await User.findOne({ email }); 
    try {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.passwordResetCode ) {
        
            return res.status(400).json({
                success: false,
                message: "No reset code found. Please request a new one.",
            });
        }
        if (Date.now() > user.passwordResetExpires) {
            user.passwordResetCode = null;
            user.passwordResetExpires = null;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "Expired reset code",
            });
        }

        const isCodeValid = await bcrypt.compare(resetCode, user.passwordResetCode);
        if (!isCodeValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid reset code",
            });
        }

        user.resetverified = true;
        user.passwordResetCode = null;
        user.passwordResetExpires = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Reset code is valid",
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.resetPassword = async (req, res) => {
    const { email, newPassword, confirmNewPassword } = req.body;
    const user = await User.findOne({ email }); 
    try {
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!user.resetverified) {
            return res.status(400).json({
                success: false,
                message: "Reset code not verified. Please verify the reset code first.",
            });
        }
        user.password = newPassword;
        user.resetverified = false;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        user.resetverified = false;
        await user.save();
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};