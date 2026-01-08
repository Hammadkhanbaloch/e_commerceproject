import mongoose from 'mongoose'

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required')
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
