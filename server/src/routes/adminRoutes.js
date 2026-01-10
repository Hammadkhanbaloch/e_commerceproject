import express from 'express'
import {
  adminSummary,
  adminListProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminListOrders,
  adminUpdateOrderStatus,
  adminListUsers,
  adminSetUserRole,
  adminSetUserPassword,
} from '../controllers/adminController.js'
import { requireAdmin, requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.use(requireAuth, requireAdmin)

router.get('/summary', adminSummary)

router.get('/products', adminListProducts)
router.post('/products', adminCreateProduct)
router.put('/products/:id', adminUpdateProduct)
router.delete('/products/:id', adminDeleteProduct)

router.get('/orders', adminListOrders)
router.put('/orders/:id/status', adminUpdateOrderStatus)

router.get('/users', adminListUsers)
router.put('/users/:id/role', adminSetUserRole)
router.put('/users/:id/password', adminSetUserPassword)

export default router
