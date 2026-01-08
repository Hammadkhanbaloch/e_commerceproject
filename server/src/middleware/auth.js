import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null

    if (!token) {
      res.status(401)
      throw new Error('Not authorized')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.sub).select('-passwordHash')

    if (!user) {
      res.status(401)
      throw new Error('Not authorized')
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401)
    next(err)
  }
}
