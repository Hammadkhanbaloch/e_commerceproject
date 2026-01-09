import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import passport from 'passport'

import { configurePassport } from './config/passport.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use(passport.initialize())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'readymade-api', date: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use(notFound)
app.use(errorHandler)

const apiBaseUrl = process.env.API_URL
if (apiBaseUrl) {
  configurePassport({ apiBaseUrl })
}

export default app
