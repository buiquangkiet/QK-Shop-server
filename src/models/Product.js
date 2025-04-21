const mongoose = require('mongoose');
const { applyTimestamps } = require('./User');

const productSchema = new mongoose.Schema({
    name : {type: String, required: true},
    price : {type: Number, required: true},
    image: {type: String},
    description: String,
    stock: {
        type: Number, 
        default: 0
    },
    category:{},
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema);
