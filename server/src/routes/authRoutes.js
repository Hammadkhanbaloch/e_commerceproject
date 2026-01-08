import express from 'express'
import passport from 'passport'
import { login, register, me, oauthFailure, oauthSuccess } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

function redirectNotConfigured(res, provider) {
	const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
	res.redirect(`${clientUrl}/signin#error=${encodeURIComponent(`${provider} login is not configured`)}`)
}

router.post('/register', register)
router.post('/login', login)
router.get('/me', requireAuth, me)

router.get('/google', (req, res, next) => {
	if (!passport._strategy('google')) return redirectNotConfigured(res, 'Google')
	next()
}, passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get(
	'/google/callback',
	(req, res, next) => {
		if (!passport._strategy('google')) return redirectNotConfigured(res, 'Google')
		next()
	},
	passport.authenticate('google', { failureRedirect: '/api/auth/oauth/failure' }),
	oauthSuccess
)

router.get('/oauth/failure', oauthFailure)

export default router
