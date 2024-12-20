const express = require('express');
const { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe } = require('../controllers/orderController')
const authUser = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth');

const orderRouter = express.Router();

// Admin feature //
orderRouter.post('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateStatus);

// Payment features
orderRouter.post('/place', authUser ,placeOrder);
orderRouter.post('/stripe', authUser ,placeOrderStripe);

// Verify stripe
orderRouter.post('/verifyStripe', authUser, verifyStripe)

// User feature //
orderRouter.post('/userOrders', authUser, userOrders);

module.exports = orderRouter;



