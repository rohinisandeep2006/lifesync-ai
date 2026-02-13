import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useUserProfile } from './context/UserProfileContext'
import Splash from './pages/Splash'
import Login from './pages/Login'
import OnboardingBot from './pages/OnboardingBot'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { isAuthenticated } = useAuth()
  const { profile } = useUserProfile()
  const [splashDone, setSplashDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2200)
    return () => clearTimeout(t)
  }, [])

  if (!splashDone) return <Splash />

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route
        path="/onboarding"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : profile.onboardingComplete ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <OnboardingBot />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : !profile.onboardingComplete ? (
            <Navigate to="/onboarding" replace />
          ) : (
            <Dashboard />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
