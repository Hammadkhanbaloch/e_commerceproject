import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { createOrder, listMyOrders, getOrderById } from '../controllers/orderController.js'

const router = express.Router()

router.post('/', requireAuth, createOrder)
router.get('/mine', requireAuth, listMyOrders)
router.get('/:id', requireAuth, getOrderById)

export default router
