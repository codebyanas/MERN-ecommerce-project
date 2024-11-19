const orderModel = require('../models/orderModel')
const userModel = require('../models/userModel');
const Stripe = require('stripe')

// Gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Global Variables
const deliveryCharge = 10

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
  try {
    const { userId, items, amount, address, origin } = req.body;

    // Create a new order in the database with "Pending Payment" status
    const orderData = {
      userId,
      items,
      amount: amount + deliveryCharge,
      address,
      status: "Pending Payment", // Initial status for Stripe orders
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Generate Stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd", // Update your currency code as needed
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amount in the smallest currency unit
      },
      quantity: item.quantity, // Ensure quantity is passed correctly
    }));

    // Add delivery charge as a separate line item (no quantity shown)
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1, // Quantity is always 1 internally but can be hidden in Stripe UI
      adjustable_quantity: {
        enabled: false, // Ensures no quantity adjustment UI is displayed
      },
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//verify stripe
// Verify Stripe payment and update order status
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      // Update the order payment status and set the status to "Order Placed"
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: 'Order Placed',  // Update the order status to 'Order Placed' upon successful payment
      });

      // Clear the user's cart after the order is placed
      await userModel.findByIdAndUpdate(userId, { cartData: {} });

      res.json({ success: true, message: 'Order placed successfully' });
    } else {
      // If payment fails, delete the order
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


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

    await orderModel.findByIdAndUpdate(orderId, { status })
    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
    console.error('Error:', error);
  }
}

module.exports = { placeOrder, placeOrderStripe, verifyStripe, allOrders, userOrders, updateStatus };
