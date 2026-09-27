const mongoose = require('mongoose');
const {nanoid} = require('nanoid');


const productSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: () => `PROD-${nanoid(6)}`,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
        maxLength: [1000, 'Product description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        min: [0, 'Product price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select a product category'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        min: [0, 'Product stock cannot be negative']
    },
    images: [{
        url:{
            type: String,
            required: [true, 'Image url is required']
        },
        public_id: {
            type: String,
            required: [true, 'Public id is required']
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    colors: [{
        type: String,
    }],
    sizes: [{
        type: String,
    }],
});


module.exports = mongoose.model('Product', productSchema);