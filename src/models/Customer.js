const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
  
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
  }, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);