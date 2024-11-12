require('dotenv').config();
const express = require('express')
const cors = require('cors');
const connectDB = require('./config/mongodb.js');
const connectCloudinary = require('./config/cloudinary')
const userRouter = require('./routes/userRoute')
const productRouter = require('./routes/productRoute.js')

// App config
const app = express()
const port = process.env.PORT || 5000

//Middlewares
app.use(express.json())
app.use(cors())
connectDB()
connectCloudinary()

// API Endpoints
app.get('/', (req, res) => {
    res.send('You are in the root file of the web!')
})

app.use('/user', userRouter)
app.use('/product', productRouter)

app.listen(port, () => {
    console.log(`✔️  Server is running on port ${port}`)
})