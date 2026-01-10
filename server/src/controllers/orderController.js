import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'

export async function createOrder(req, res, next) {
  try {
    const { productId, qty, paymentMethod, shippingAddress } = req.body || {}

    if (!productId) {
      res.status(400)
      throw new Error('productId is required')
    }

    const product = await Product.findById(productId)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }
    if (product.status !== 'confirmed') {
      res.status(400)
      throw new Error('Product is not available')
    }

    const quantity = Number(qty || 1)
    if (!Number.isFinite(quantity) || quantity < 1) {
      res.status(400)
      throw new Error('qty must be >= 1')
    }

    const order = await Order.create({
      user: req.user._id,
      items: [
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: quantity,
        },
      ],
      paymentMethod: paymentMethod || 'card',
      shippingAddress: {
        fullName: shippingAddress?.fullName || '',
        email: shippingAddress?.email || '',
        address: shippingAddress?.address || '',
      },
      totalPrice: product.price * quantity,
      status: 'created',
    })

    res.status(201).json({ item: order })
  } catch (err) {
    next(err)
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json({ items: orders })
  } catch (err) {
    next(err)
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    if (String(order.user) !== String(req.user._id)) {
      res.status(403)
      throw new Error('Forbidden')
    }

    res.json({ item: order })
  } catch (err) {
    next(err)
  }
}
