import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {}

    if (!name?.trim() || !email?.trim() || !password) {
      res.status(400)
      throw new Error('name, email, password are required')
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const existing = await User.findOne({ email: normalizedEmail })
    if (existing) {
      res.status(409)
      throw new Error('Email already registered')
    }

    const passwordHash = await bcrypt.hash(String(password), 10)
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash })

    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {}

    if (!email?.trim() || !password) {
      res.status(400)
      throw new Error('email and password are required')
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash)
    if (!ok) {
      res.status(401)
      throw new Error('Invalid credentials')
    }

    const token = signToken(user._id)

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}
