import mongoose from 'mongoose'

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required')
  }

  // Reuse existing connection in serverless environments (Vercel)
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  if (mongoose.connection.readyState === 1) {
    return
  }
  if (mongoose.connection.readyState === 2) {
    return
  }

  mongoose.set('strictQuery', true)

  console.log('[db] connecting...')

  mongoose.connection.on('connected', () => {
    console.log('[db] connected')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[db] error', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('[db] disconnected')
  })

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10_000,
    connectTimeoutMS: 10_000,
  })
}
