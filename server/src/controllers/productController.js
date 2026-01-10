import { Product } from '../models/Product.js'
import { Review } from '../models/Review.js'
import { normalizeImageSrc } from '../lib/image.js'

function withNormalizedImage(doc) {
  const obj = doc?.toObject ? doc.toObject() : doc
  if (!obj) return obj
  return { ...obj, image: normalizeImageSrc(obj.image) }
}

async function recalcProductAggregates(productId) {
  const agg = await Review.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avg: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ])

  const { avg = 0, count = 0 } = agg[0] || {}
  await Product.findByIdAndUpdate(productId, {
    ratingAvg: Math.round(avg * 10) / 10,
    reviewsCount: count,
  })
}

export async function listProducts(req, res, next) {
  try {
    const { category, q } = req.query

    const filter = {}
    // Public catalog: show only confirmed products
    filter.status = 'confirmed'
    if (category) {
      const raw = String(category).trim().toLowerCase()
      const normalized = raw === 'men' ? 'Men' : raw === 'women' ? 'Women' : raw === 'child' ? 'Child' : String(category).trim()
      filter.category = normalized
    }
    if (q) filter.name = { $regex: String(q), $options: 'i' }

    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ items: products.map(withNormalizedImage) })
  } catch (err) {
    next(err)
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }
    if (product.status !== 'confirmed') {
      res.status(404)
      throw new Error('Product not found')
    }
    res.json({ item: withNormalizedImage(product) })
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, price, image, category, description, status } = req.body || {}

    if (!name?.trim() || price == null || !category?.trim()) {
      res.status(400)
      throw new Error('name, price, category are required')
    }

    const rawCategory = String(category).trim().toLowerCase()
    const normalizedCategory =
      rawCategory === 'men' ? 'Men' : rawCategory === 'women' ? 'Women' : rawCategory === 'child' ? 'Child' : String(category).trim()

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      image: normalizeImageSrc(image || ''),
      category: normalizedCategory,
      description: description || '',
      status: status === 'confirmed' ? 'confirmed' : 'pending',
    })

    res.status(201).json({ item: product })
  } catch (err) {
    next(err)
  }
}

export async function listProductReviews(req, res, next) {
  try {
    const productId = req.params.id

    const reviews = await Review.find({ product: productId }).populate('user', 'name').sort({ createdAt: -1 })

    res.json({ items: reviews })
  } catch (err) {
    next(err)
  }
}

export async function createProductReview(req, res, next) {
  try {
    const productId = req.params.id
    const { rating, comment, name } = req.body || {}

    const product = await Product.findById(productId)
    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    const numericRating = Number(rating)
    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400)
      throw new Error('rating must be between 1 and 5')
    }

    try {
      const review = await Review.create({
        product: productId,
        user: req.user._id,
        displayName: name?.trim() ? String(name).trim() : '',
        rating: numericRating,
        comment: comment || '',
      })

      await recalcProductAggregates(product._id)

      res.status(201).json({ item: review })
    } catch (e) {
      // duplicate (unique index on product+user)
      if (e?.code === 11000) {
        res.status(409)
        throw new Error('You already reviewed this product')
      }
      throw e
    }
  } catch (err) {
    next(err)
  }
}

export async function updateProductReview(req, res, next) {
  try {
    const productId = req.params.id
    const reviewId = req.params.reviewId
    const { rating, comment, name } = req.body || {}

    const review = await Review.findOne({ _id: reviewId, product: productId })
    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    if (String(review.user) !== String(req.user._id)) {
      res.status(403)
      throw new Error('Forbidden')
    }

    if (rating !== undefined) {
      const numericRating = Number(rating)
      if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
        res.status(400)
        throw new Error('rating must be between 1 and 5')
      }
      review.rating = numericRating
    }

    if (comment !== undefined) {
      review.comment = String(comment)
    }

    if (name !== undefined) {
      review.displayName = String(name).trim()
    }

    await review.save()
    await recalcProductAggregates(review.product)

    res.json({ item: review })
  } catch (err) {
    next(err)
  }
}

export async function deleteProductReview(req, res, next) {
  try {
    const productId = req.params.id
    const reviewId = req.params.reviewId

    const review = await Review.findOne({ _id: reviewId, product: productId })
    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    if (String(review.user) !== String(req.user._id)) {
      res.status(403)
      throw new Error('Forbidden')
    }

    await review.deleteOne()
    await recalcProductAggregates(productId)

    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
}
