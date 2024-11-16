const express = require('express');
const {addToCart, updateCart, getUserCart} = require('../controllers/cartController');
const authUser = require('../middleware/auth');

const cartRouter = express.Router();

// Get user's cart
cartRouter.post('/get', authUser, getUserCart);
// Add item to the user's cart
cartRouter.post('/add', authUser, addToCart);
// Update item quantity in the user's cart  
cartRouter.post('/update', authUser, updateCart);


module.exports = cartRouter;