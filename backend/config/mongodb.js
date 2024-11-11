require('dotenv').config();
const mongoose = require('mongoose')
const mongodbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(`${mongodbURI}/e-commerce`)
        console.log('✔️  Connected to Database Successfully!')
    } catch (error) {
        console.log('Database connection error', error)
    }
}

module.exports = connectDB;