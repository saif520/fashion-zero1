import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true },
      size: String,
      color: String,
    },
  ],
  shippingInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    altPhone: { type: String },
    pincode: { type: String, required: true },
    locality: { type: String },
    address: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    addressType: { type: String, enum: ['Home', 'Work'], default: 'Home' },
  },
  paymentInfo: {
    method: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    id: String,
  },
  totalAmount: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: Date,
});

const Order = mongoose.model('Order', orderSchema);
export default Order; 