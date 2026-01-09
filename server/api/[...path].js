import app from '../src/app.js'
import { connectDb } from '../src/config/db.js'

let dbPromise

async function ensureDb() {
  if (!dbPromise) {
    dbPromise = connectDb(process.env.MONGO_URI)
  }
  return dbPromise
}

export default async function handler(req, res) {
  try {
    if (!process.env.API_URL) {
      // Needed for OAuth callback URL generation.
      // On Vercel, API_URL can be inferred from the request host.
      const host = req.headers['x-forwarded-host'] || req.headers.host
      process.env.API_URL = `https://${host}`
    }

    if (!process.env.MONGO_URI) {
      res.status(500).json({
        ok: false,
        message: 'Server is not configured (missing MONGO_URI). Set it in Vercel Environment Variables and redeploy.',
      })
      return
    }

    await ensureDb()
    return app(req, res)
  } catch (err) {
    const message = err?.message || String(err)
    console.error('[api] function error:', message)

    res.status(500).json({
      ok: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? message : undefined,
    })
  }
}
