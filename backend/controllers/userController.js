require('dotenv').config();
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
  };
  

// User login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// User registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email' });
        }

        // Validate password
        if (!validator.isLength(password, { min: 7 })) {
            return res.status(400).json({ success: false, message: 'Password must be at least 7 characters long' });
        }

        // Hash password and save user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Admin login
const generateToken = (email) => jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = generateToken(email);
        return res.status(200).json({ success: true, token });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

module.exports = { loginUser, registerUser, adminLogin };
