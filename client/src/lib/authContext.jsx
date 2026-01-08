import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from './api'
import { clearAuthToken, getAuthToken, setAuthToken } from './auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadMe() {
      const token = getAuthToken()
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await apiFetch('/api/auth/me', { signal: controller.signal })
        setUser(data?.user || null)
      } catch {
        clearAuthToken()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadMe()
    return () => controller.abort()
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      async loginWithToken(token) {
        setAuthToken(token)
        const data = await apiFetch('/api/auth/me')
        setUser(data?.user || null)
      },
      logout() {
        clearAuthToken()
        setUser(null)
      },
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
