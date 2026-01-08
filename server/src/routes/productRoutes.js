import express from 'express'
import {
  createProduct,
  getProductById,
  listProducts,
  listProductReviews,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '../controllers/productController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', listProducts)
router.post('/', requireAuth, createProduct)

router.get('/:id', getProductById)

router.get('/:id/reviews', listProductReviews)
router.post('/:id/reviews', requireAuth, createProductReview)
router.put('/:id/reviews/:reviewId', requireAuth, updateProductReview)
router.delete('/:id/reviews/:reviewId', requireAuth, deleteProductReview)

export default router
