const express = require('express');
const { addProducts, listProducts, removeProduct, singleProduct } = require('../controllers/productController');
const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');

const productRouter = express.Router();

// Route to add a new product with up to 4 images
productRouter.post(
    '/add',
    adminAuth,
    upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }, { name: 'image4' }]),
    addProducts
);

// Route to get a list of all products
productRouter.get('/list', listProducts);

// Route to get a single product by ID (use GET for retrieval)
productRouter.get('/single', singleProduct);

// Route to delete a product
productRouter.delete('/remove', adminAuth, removeProduct);

module.exports = productRouter;
