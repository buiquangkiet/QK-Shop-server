const mongoose = require('mongoose');

const cartItemSchame = mongoose.Schema({
    productId: {type: mongoose.Types.ObjectId, ref: 'Product'},
    name : {type: String, required: true},
    price: Number,
    quantity: Number,
    image: string
});

const cartSchame = mongoose.Schema({
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    item : [cartItemSchame],
    totalPrice: Number,
    totalQuantity: Number,
},{timestamps: true});

module.exports = mongoose.model('Cart', cartSchame);