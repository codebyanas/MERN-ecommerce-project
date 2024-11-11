const cloudinary = require('cloudinary');
const productModel = require('../models/productModel')

// Function for add product
const addProducts = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;

        const image1 = req.files['image1'] && req.files['image1'][0]
        const image2 = req.files['image2'] && req.files['image2'][0]
        const image3 = req.files['image3'] && req.files['image3'][0]
        const image4 = req.files['image4'] && req.files['image4'][0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        if (images.length === 0) {
            return res.status(400).json({ message: 'Please upload at least one image' });
        }

        // Upload images to Cloudinary
        const imagesUrl = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.v2.uploader.upload(image.path, {
                folder: 'e-commerce',
                public_id: `products/${name}-${Date.now()}`,
                width: 800,
                height: 800,
                crop: 'limit',
                quality: 90
            });
            return result.secure_url;
        }));

        // Save data to MongoDb
        const productData = new productModel({
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestSeller: bestSeller === 'true' ? true : false, 
            image: imagesUrl,
            sizes: JSON.parse(sizes),
            date: Date.now()
        });

        const addedImage = await productData.save();
        if (!addedImage) {
            return res.json({ message: 'Failed to add product' });
        }
        
        res.json({ success: true, message: "Product added successfully", addedImage});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Function for list products
const listProducts = async (req, res) => {
    try {
        // Find product
        const products = await productModel.find({});
        if (!products) {
            return res.json({ success: false, message: 'No products found' });
        }
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function for removing product
const removeProduct = async (req, res) => {
    try {
        // Find by id and delete
        const product = await productModel.findByIdAndDelete(req.body.id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Function for single product info
const singleProduct = async (req, res) => {
    try {
        // Find product by its id
        const product = await productModel.findById(req.body.id);
        if (!product) {
            return res.json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { addProducts, listProducts, removeProduct, singleProduct }