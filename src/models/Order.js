const mongoose = require('mongoose');

const orderItemSchema= mongoose.Schema({
    productId: {type: mongoose.Types.ObjectId, ref:'Product', required: true},
    quantity:{ type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  totalPrice: { type: Number, required: true },

  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'COD' },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  deliveredAt: { type: Date }
}, {timestamps: true});

module.exports= mongoose.model('Order', orderSchema)