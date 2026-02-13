import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Theme } from '@/types'

const THEMES: Theme[] = [
  { id: 'mint', name: 'Mint', primary: '#a7f3d0', secondary: '#2dd4bf', background: '#0f172a', accent: '#fefce8' },
  { id: 'coral', name: 'Coral', primary: '#fda4af', secondary: '#fb7185', background: '#1c1917', accent: '#fef3c7' },
  { id: 'violet', name: 'Violet', primary: '#c4b5fd', secondary: '#a78bfa', background: '#1e1b4b', accent: '#e0e7ff' },
  { id: 'ocean', name: 'Ocean', primary: '#7dd3fc', secondary: '#0ea5e9', background: '#0c4a6e', accent: '#e0f2fe' },
  { id: 'forest', name: 'Forest', primary: '#86efac', secondary: '#22c55e', background: '#14532d', accent: '#dcfce7' },
]

const STORAGE_KEY = 'lifesync_theme'

const ThemeContext = createContext<{
  theme: Theme
  themeId: string
  setThemeId: (id: string) => void
  themes: Theme[]
} | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'mint'
    } catch {
      return 'mint'
    }
  })

  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId)
    document.documentElement.style.setProperty('--theme-primary', theme.primary)
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary)
    document.documentElement.style.setProperty('--theme-bg', theme.background)
    document.documentElement.style.setProperty('--theme-accent', theme.accent)
  }, [themeId, theme])

  const setThemeId = (id: string) => {
    if (THEMES.some((t) => t.id === id)) setThemeIdState(id)
  }

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
