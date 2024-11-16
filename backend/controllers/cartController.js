const userModel = require('../models/userModel')

const addToCart = async (req, res) => {
    try {
     let { userId, itemId, size } = req.body;
  
      // Validate input
      if (!userId) {
        return res.json({ success: false, message: 'Missing userId' });
      }

      if (!itemId) {
        return res.json({ success: false, message: 'Missing itemId' });
      }

      if (!size) {
        return res.json({ success: false, message: 'Missing size' });
      }
  
      const userData = await userModel.findById(userId);
  
      // Check if user exists
      if (!userData) {
        return res.json({ success: false, message: 'User not found' });
      }
  
      let cartData = userData.cartData || {}; // Ensure cartData exists
  
      // Add item to cart
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = { [size]: 1 };
      }
  
      await userModel.findByIdAndUpdate(userId, { cartData });
  
      res.json({ success: true, message: 'Added to cart' });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  

// Add Products to user cart 
const updateCart = async (req, res) => {
    try {
        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData

        if (cartData[itemId]) {
            cartData[itemId][size] = quantity
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' })
        }

        await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({ success: true, message: 'Cart updated' })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

// Add Products to user cart 
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        const userData = await userModel.findById(userId);
        let cartData = await userData.cartData

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        res.json({ success: true, cartData })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports = {addToCart, updateCart, getUserCart}

