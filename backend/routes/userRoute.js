const express = require('express')
const {loginUser, registerUser, adminLogin} = require('../controllers/userController')

const userRouter = express.Router()

// User registration
userRouter.post('/register', registerUser)

// User login
userRouter.post('/login', loginUser)

// Admin login
userRouter.post('/admin', adminLogin)

module.exports = userRouter