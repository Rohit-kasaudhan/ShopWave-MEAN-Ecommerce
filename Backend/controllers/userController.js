const User = require("../models/user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email or phone already exists",
      });
    }

    const user = await User.create(req.body);

    //////////////////to not put password in the response
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getUser = async (req, res) => {
    try{

        const user = await User.findOne({uuid: req.params.uuid}).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const userObj = user.toObject();
        delete userObj._id;
        delete userObj.__v;

        res.status(200).json({
            success: true,
            data: userObj,
            message: "User retrieved successfully",
        });
    }
    catch (error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.body.password || req.body.passwordChangedAt || 
      req.body.passwordResetCode || req.body.passwordResetExpires ||
      req.body.verificationCode || req.body.verificationCodeExpires || 
      req.body.uuid || req.body._id || req.body.__v) {

      return res.status(400).json({
        success: false,
        message: "this field cannot be updated through this method",
      });
    }

    if (!req.params.uuid ){
        return res.status(400).json({
            success: false,
            message: "User UUID is required",
        });
    }
    if (!req.body ){
        return res.status(400).json({
            success: false,
            message: "body is required",
        });
    }


    const user = await User.findOneAndUpdate({uuid: req.params.uuid}, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {

    if (!req.params.uuid ){
        return res.status(400).json({
            success: false,
            message: "User UUID is required",
        });
    }

    const user = await User.findOneAndDelete({uuid: req.params.uuid});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ uuid });

    if (!user) {
        return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }
    // const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // user.password = hashedNewPassword;
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};