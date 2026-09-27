const Product = require('../models/product');
const cloudinary = require("../config/cloudinary");


////////slug to be url friendlt mens shoes
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name slug uuid');
        res.status(200).json({
            success: true,
            data: products,
            message: "Products retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const images = req.files.map( file => ({url:file.path, public_id: file.filename}) );
        const price = Number(req.body.price);
        const stock = Number(req.body.stock);

        const colors = req.body.colors
        ? req.body.colors.split(",").map(c => c.trim())
        : [];

        const sizes = req.body.sizes
        ? req.body.sizes.split(",").map(s => s.trim())
        : [];

        const product = await Product.create({
            name: req.body.name,
            description: req.body.description,
            price,
            category: req.body.category,
            stock,
            images,
            colors,
            sizes,
        });

        res.status(201).json({
            success: true,
            data: product,
            message: "Product created successfully",
        });
    }catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getProduct = async (req,res) => {
    try{
        const product = await Product.findOne({ uuid: req.params.id }).populate('category', 'name slug uuid');


        if(!product){
            return res.status(404).json({
                success: false,
                message: "No product found with this id"
            })
        }

        res.status(200).json({
            success: true,
            data : product,
            message: "Product retrieved successfully",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: err.message,
        })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ uuid: req.params.id });
        if(!product){
            return res.status(404).json({
                success: false,
                message: "No product found with this id"
            });
        }

        const publicIds = product.images.map(img => img.public_id);
        await cloudinary.api.delete_resources(publicIds);

        const data = await Product.findOneAndDelete({ uuid: req.params.id });

        res.status(200).json({
            success: true,
            data,
            message: "Product deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

exports.updateProduct = async (req, res) => {
    try{
        const product = await Product.findOne({ uuid: req.params.id });
        if(!product) return res.status(404).json({success: false, message: "No product found with this id"});

        const allowedFields = [
            "name",
            "description",
            "price",
            "category",
            "stock",
            "colors",
            "sizes",
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        await product.save();

        const allProducts = await Product.find();
        res.status(200).json({
            success: true,
            data: allProducts,
            message: "Product updated successfully"
        });
    } catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.deleteProductImage = async (req, res) => {
    try{
        const product = await Product.findOne({ uuid: req.params.id });
        if(!product){
            return res.status(404).json({
                success: false,
                message: "No product found with this id"
            });
        }

        await cloudinary.api.delete_resources([req.body.public_id]);

        product.images = product.images.filter(img => img.public_id !== req.body.public_id);
        await product.save();

        res.status(200).json({
            success: true,
            data: product,
            message: "Image deleted successfully"
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.addProductImage = async (req, res) => {
    try {
        const product = await Product.findOne({ uuid: req.params.id });
        if(!product){
            return res.status(404).json({
                success: false,
                message: "No product found with this id"
            });
        }

        const newImages = req.files.map(file => ({ url: file.path, public_id: file.filename }));
        product.images.push(...newImages);
        await product.save();

        res.status(200).json({
            success: true,
            data: product,
            message: "Image(s) added successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}