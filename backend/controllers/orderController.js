const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel');

// Place orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            status: 'Order Placed',
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: 'Order placed successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
        console.error('Error:', error)
    }
}

// Place orders using Stripe Method

const placeOrderStripe = async (req, res) => {

}

// All order for Admin Panel

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ success: true, orders })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
        console.error(error);
    }
}

// user order data for frontend
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body; // Extract userId from the request body

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is missing' });
        }

        // Find all orders for the given userId
        const orders = await orderModel.find({ userId });

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
        console.error('Error:', error);
    }
};


// Order status update from Admin Panel
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body

        if (!orderId) {
            return res.status(400).json({ success: false, message: 'Missing user ID' });
        }

        if (!status) {
            return res.status(400).json({ success: false, message: 'Missing status' });
        }

        await orderModel.findByIdAndUpdate(orderId, {status})
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
        console.error('Error:', error);
    }
}

module.exports = { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus };
