import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [orderItemSchema], default: [] },
    shippingAddress: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
    },
    paymentMethod: { type: String, default: 'card', enum: ['card', 'cod'] },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'created', enum: ['created', 'paid', 'shipped', 'delivered', 'cancelled'] },
  },
  { timestamps: true }
)

export const Order = mongoose.model('Order', orderSchema)
