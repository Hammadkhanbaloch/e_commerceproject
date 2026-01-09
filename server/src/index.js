import dotenv from 'dotenv'

import { connectDb } from './config/db.js'
import app from './app.js'

dotenv.config()

const port = Number(process.env.PORT || 5000)
process.env.API_URL = process.env.API_URL || `http://localhost:${port}`

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
