import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { connectDb } from '../config/db.js'
import { User } from '../models/User.js'

dotenv.config()

async function main() {
  const email = String(process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const password = String(process.env.ADMIN_PASSWORD || '')
  const name = String(process.env.ADMIN_NAME || 'Admin').trim()

  if (!email || !password) {
    console.error('[seed:admin] ADMIN_EMAIL and ADMIN_PASSWORD are required in server/.env')
    process.exit(1)
  }

  await connectDb(process.env.MONGO_URI)

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name,
        email,
        passwordHash,
        role: 'admin',
      },
    },
    { new: true, upsert: true }
  )

  console.log(`[seed:admin] admin ready: ${user.email} (role=${user.role})`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed:admin] failed', err)
  process.exit(1)
})
