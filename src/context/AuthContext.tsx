import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  userId: string | null
  login: (email: string, password: string) => boolean
  signup: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'lifesync_auth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw).userId : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (userId) localStorage.setItem(STORAGE_KEY, JSON.stringify({ userId }))
    else localStorage.removeItem(STORAGE_KEY)
  }, [userId])

  const login = (email: string, password: string) => {
    // Demo: accept any non-empty; in production use real auth
    if (!email.trim() || !password.trim()) return false
    setUserId(email.toLowerCase().trim() + '_' + Date.now())
    return true
  }

  const signup = (email: string, password: string) => {
    if (!email.trim() || !password.trim()) return false
    setUserId(email.toLowerCase().trim() + '_' + Date.now())
    return true
  }

  const logout = () => setUserId(null)

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!userId,
        userId,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
