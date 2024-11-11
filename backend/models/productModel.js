const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    image: { type: Array, required: true },
    sizes: { type: Array, required: true },
    bestSeller: { type: Boolean },
    date: { type: Date, default: Date.now, required: true }
});

const productModel = mongoose.models.product || mongoose.model('product', productSchema);
module.exports = productModel
