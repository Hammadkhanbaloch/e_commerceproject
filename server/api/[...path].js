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
  if (!process.env.API_URL) {
    // Needed for OAuth callback URL generation.
    // On Vercel, set API_URL to your backend deployment URL.
    process.env.API_URL = `https://${req.headers.host}`
  }

  await ensureDb()
  return app(req, res)
}
