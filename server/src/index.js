import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

import { connectDb } from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

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

const port = Number(process.env.PORT || 5000)

try {
  await connectDb(process.env.MONGO_URI)
} catch (err) {
  const msg = err?.message || String(err)
  console.error('[db] failed to connect:', msg)

  if (/queryTxt\s+(ETIMEOUT|EREFUSED)/i.test(msg) || /queryTxt/i.test(msg)) {
    console.error(
      '[db] Your network/DNS is blocking MongoDB Atlas SRV/TXT lookup. Use the Atlas "Standard connection string" (mongodb://...) instead of mongodb+srv://.'
    )
  }
  process.exit(1)
}

const server = app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`)
})

server.on('error', (err) => {
  if (err?.code === 'EADDRINUSE') {
    console.error(`[api] Port ${port} is already in use.`)
    console.error(
      '[api] Stop the process using it, or set a different PORT in server/.env (and update the Vite proxy if needed).'
    )
    process.exit(1)
  }

  console.error('[api] Server error:', err)
  process.exit(1)
})
