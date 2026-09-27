const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const categorySchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: () => `CAT-${nanoid(6)}`,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Category name is required'],
            unique: true,
            trim: true,
            minLength: [2, 'Category name must be at least 2 characters'],
            maxLength: [50, 'Category name cannot exceed 50 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxLength: [500, 'Category description cannot exceed 500 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
    },
    { timestamps: true }
);

categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.trim().toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', categorySchema);
