import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const ok = isSignUp ? signup(email, password) : login(email, password)
    if (ok) navigate('/onboarding')
    else setError('Please enter a valid email and password.')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 text-white"
      style={{ backgroundColor: 'var(--theme-bg, #0f172a)' }}
    >
      <div className="w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>
            LifeSync AI
          </h1>
          <p className="text-slate-400 mt-1">{isSignUp ? 'Create your account' : 'Welcome back'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none transition"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-navy transition opacity-90 hover:opacity-100"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            {isSignUp ? 'Sign up' : 'Log in'}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="font-medium text-[var(--theme-primary)] hover:underline"
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
