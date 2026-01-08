import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/User.js'

function normalizeEmail(email) {
  if (!email) return ''
  return String(email).toLowerCase().trim()
}

export function configurePassport({ apiBaseUrl }) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET

  // Sessions are used only to complete the OAuth handshake.
  passport.serializeUser((user, done) => done(null, String(user._id)))
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id)
      done(null, user || false)
    } catch (e) {
      done(e)
    }
  })

  if (googleClientId && googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL: process.env.GOOGLE_CALLBACK_URL || `${apiBaseUrl}/api/auth/google/callback`,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const googleId = String(profile?.id || '')
            const displayName = String(profile?.displayName || '').trim()
            const email = normalizeEmail(profile?.emails?.[0]?.value)

            let user = await User.findOne({ googleId })
            if (!user && email) user = await User.findOne({ email })

            if (!user) {
              user = await User.create({
                name: displayName || 'Google User',
                email: email || `google_${googleId}@example.invalid`,
                googleId,
              })
            } else if (!user.googleId) {
              user.googleId = googleId
              if (!user.name && displayName) user.name = displayName
              await user.save()
            }

            done(null, user)
          } catch (e) {
            done(e)
          }
        }
      )
    )
  }

  return passport
}
