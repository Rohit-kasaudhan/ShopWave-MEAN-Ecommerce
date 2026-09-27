const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: uuidv4,
        unique: true,
        index: true,
    },
    FirstName: {
        type: String,
        required: [true, 'Please enter your second name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [3, 'Name should have more than 4 characters']
    },
    LastName: {
        type: String,
        required: [true, 'Please enter your first name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [3, 'Name should have more than 4 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true
    },
    phone:{
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [6, 'Password should have more than 6 characters']
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    verificationCode: String,
    verificationCodeExpires: Date,
    resetverified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    birthDate: {
        type: Date,
        required: [true, 'Please enter your birth date'],
    },
    gender:{
        type: String,
        enum: ['male', 'female'],
        required: [true, 'Please enter your gender']
    }
}, { timestamps: true });

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);
