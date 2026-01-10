import bcrypt from 'bcryptjs'
import { Product } from '../models/Product.js'
import { Order } from '../models/Order.js'
import { User } from '../models/User.js'
import { normalizeImageSrc } from '../lib/image.js'

function normalizeCategory(category) {
  const raw = String(category || '').trim().toLowerCase()
  if (raw === 'men') return 'Men'
  if (raw === 'women') return 'Women'
  if (raw === 'child') return 'Child'
  return String(category || '').trim()
}

export async function adminSummary(req, res, next) {
  try {
    const [
      productsPending,
      productsConfirmed,
      ordersCreated,
      ordersPaid,
      ordersShipped,
      ordersDelivered,
      ordersCancelled,
      usersTotal,
      adminsTotal,
    ] = await Promise.all([
      Product.countDocuments({ status: 'pending' }),
      Product.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'created' }),
      Order.countDocuments({ status: 'paid' }),
      Order.countDocuments({ status: 'shipped' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      User.countDocuments({}),
      User.countDocuments({ role: 'admin' }),
    ])

    res.json({
      products: {
        pending: productsPending,
        confirmed: productsConfirmed,
      },
      orders: {
        created: ordersCreated,
        paid: ordersPaid,
        shipped: ordersShipped,
        delivered: ordersDelivered,
        cancelled: ordersCancelled,
      },
      users: {
        total: usersTotal,
        admins: adminsTotal,
        normal: Math.max(0, usersTotal - adminsTotal),
      },
    })
  } catch (err) {
    next(err)
  }
}

export async function adminListProducts(req, res, next) {
  try {
    const { status, category, q } = req.query

    const filter = {}
    if (status && status !== 'all') filter.status = String(status)
    if (category) filter.category = normalizeCategory(category)
    if (q) filter.name = { $regex: String(q), $options: 'i' }

    const items = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
}

export async function adminCreateProduct(req, res, next) {
  try {
    const { name, price, image, category, description, status } = req.body || {}

    if (!name?.trim() || price == null || !category?.trim()) {
      res.status(400)
      throw new Error('name, price, category are required')
    }

    const normalizedCategory = normalizeCategory(category)

    const item = await Product.create({
      name: String(name).trim(),
      price: Number(price),
      image: normalizeImageSrc(image || ''),
      category: normalizedCategory,
      description: description || '',
      status: status === 'confirmed' ? 'confirmed' : 'pending',
    })

    res.status(201).json({ item })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateProduct(req, res, next) {
  try {
    const { id } = req.params
    const { name, price, image, category, description, status } = req.body || {}

    const product = await Product.findById(id)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    if (name !== undefined) product.name = String(name).trim()
    if (price !== undefined) product.price = Number(price)
    if (image !== undefined) product.image = normalizeImageSrc(image)
    if (category !== undefined) product.category = normalizeCategory(category)
    if (description !== undefined) product.description = String(description)
    if (status !== undefined) product.status = status === 'confirmed' ? 'confirmed' : 'pending'

    await product.save()
    res.json({ item: product })
  } catch (err) {
    next(err)
  }
}

export async function adminDeleteProduct(req, res, next) {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    await product.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}

export async function adminListOrders(req, res, next) {
  try {
    const { status } = req.query
    const filter = {}
    if (status && status !== 'all') filter.status = String(status)

    const items = await Order.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })

    res.json({ items })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body || {}

    const order = await Order.findById(id)
    if (!order) {
      res.status(404)
      throw new Error('Order not found')
    }

    if (!status) {
      res.status(400)
      throw new Error('status is required')
    }

    order.status = String(status)
    await order.save()

    res.json({ item: order })
  } catch (err) {
    next(err)
  }
}

export async function adminListUsers(req, res, next) {
  try {
    const items = await User.find({}).select('-passwordHash').sort({ createdAt: -1 })
    res.json({ items })
  } catch (err) {
    next(err)
  }
}

export async function adminSetUserRole(req, res, next) {
  try {
    const { id } = req.params
    const { role } = req.body || {}

    if (!role || !['user', 'admin'].includes(String(role))) {
      res.status(400)
      throw new Error('role must be user or admin')
    }

    // prevent accidental self-demotion from admin panel (optional safety)
    if (String(req.user?._id) === String(id) && role !== 'admin') {
      res.status(400)
      throw new Error('You cannot remove your own admin role')
    }

    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    user.role = String(role)
    await user.save()

    res.json({ item: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

// Optional helper endpoint: reset a user's password (admin-only)
export async function adminSetUserPassword(req, res, next) {
  try {
    const { id } = req.params
    const { password } = req.body || {}

    if (!password) {
      res.status(400)
      throw new Error('password is required')
    }

    const user = await User.findById(id)
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    user.passwordHash = await bcrypt.hash(String(password), 10)
    await user.save()

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
