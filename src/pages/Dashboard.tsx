import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { useUserProfile } from '../context/UserProfileContext'
import { useTheme } from '../context/ThemeContext'
import {
  Lock,
  Unlock,
  Calendar as CalendarIcon,
  ListTodo,
  Target,
  LogOut,
  Droplets,
  Flame,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const LOCK_PIN = '1234'
const LOCK_KEY = 'lifesync_lock_enabled'

export default function Dashboard() {
  const navigate = useNavigate()
  const { logout, isAuthenticated } = useAuth()
  const { profile, streakDays, markDayComplete, plannerTasks, setPlannerTasks } = useUserProfile()
  const { theme } = useTheme()
  const [lockEnabled, setLockEnabled] = useState(() => localStorage.getItem(LOCK_KEY) === 'true')
  const [locked, setLocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [focusMinutes, setFocusMinutes] = useState(25)
  const [focusRunning, setFocusRunning] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    if (lockEnabled && !locked) setLocked(true)
  }, [lockEnabled])

  const unlock = () => {
    if (pinInput === LOCK_PIN) {
      setLocked(false)
      setPinInput('')
    }
  }

  const toggleLock = () => {
    const next = !lockEnabled
    setLockEnabled(next)
    localStorage.setItem(LOCK_KEY, String(next))
    if (next) setLocked(true)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const monthStart = startOfMonth(calendarMonth)
  const monthEnd = endOfMonth(calendarMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getStreakForDate = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return streakDays.find((s) => s.date === key)
  }

  const addPlannerTask = () => {
    if (!newTaskTitle.trim()) return
    setPlannerTasks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        completed: false,
        priority: 'medium',
      },
    ])
    setNewTaskTitle('')
  }

  const toggleTask = (id: string) => {
    setPlannerTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  const currentStreak = streakDays.filter((s) => s.completed).length

  if (locked) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6 text-white"
        style={{ backgroundColor: 'var(--theme-bg)' }}
      >
        <Lock className="w-16 h-16 mb-6 opacity-60" style={{ color: 'var(--theme-primary)' }} />
        <h2 className="text-xl font-semibold mb-2">App locked</h2>
        <p className="text-white/60 text-sm mb-6">Enter your PIN</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && unlock()}
          placeholder="••••"
          className="w-32 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-center text-2xl tracking-widest focus:border-[var(--theme-primary)] focus:outline-none"
        />
        <button
          onClick={unlock}
          className="mt-4 px-6 py-2 rounded-xl font-medium"
          style={{ backgroundColor: 'var(--theme-primary)', color: theme.background }}
        >
          Unlock
        </button>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen text-white pb-24"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[var(--theme-bg)]/90 backdrop-blur">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--theme-primary)' }}>
              LifeSync AI
            </h1>
            <p className="text-sm text-white/60">Hi, {profile.name || 'there'}!</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLock}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title={lockEnabled ? 'Disable app lock' : 'Enable app lock'}
            >
              {lockEnabled ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Gamified streak */}
        <section className="rounded-2xl p-4 border border-white/10 bg-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
              <h2 className="font-semibold">Streak</h2>
            </div>
            <span className="font-mono text-lg" style={{ color: 'var(--theme-primary)' }}>
              {currentStreak} days
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setCalendarMonth((m) => subMonths(m, 1))}
              className="p-1 rounded-lg hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="flex-1 text-center font-medium text-sm">
              {format(calendarMonth, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={() => setCalendarMonth((m) => addMonths(m, 1))}
              className="p-1 rounded-lg hover:bg-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
              <span key={d} className="text-xs text-white/50 font-medium">
                {d}
              </span>
            ))}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <span key={`pad-${i}`} />
            ))}
            {days.map((d) => {
              const streak = getStreakForDate(d)
              const completed = !!streak?.completed
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => markDayComplete(format(d, 'yyyy-MM-dd'), (streak?.tasksDone ?? 0) + 1)}
                  className={`aspect-square rounded-lg text-xs font-medium transition ${
                    !isSameMonth(d, calendarMonth)
                      ? 'text-white/30'
                      : isToday(d)
                        ? 'ring-2 ring-[var(--theme-primary)]'
                        : ''
                  } ${completed ? 'bg-[var(--theme-primary)] text-[var(--theme-bg)]' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {format(d, 'd')}
                </button>
              )
            })}
          </div>
        </section>

        {/* Focus widget */}
        <section className="rounded-2xl p-4 border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            <h2 className="font-semibold">Focus</h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              min={1}
              max={120}
              value={focusMinutes}
              onChange={(e) => setFocusMinutes(Number(e.target.value) || 25)}
              disabled={focusRunning}
              className="w-16 px-2 py-2 rounded-lg bg-white/10 border border-white/10 text-center font-mono"
            />
            <span className="text-white/70">min</span>
            <button
              onClick={() => setFocusRunning(!focusRunning)}
              className="px-6 py-2 rounded-xl font-semibold"
              style={{
                backgroundColor: 'var(--theme-primary)',
                color: theme.background,
              }}
            >
              {focusRunning ? 'Stop' : 'Start'}
            </button>
          </div>
        </section>

        {/* Planner */}
        <section className="rounded-2xl p-4 border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            <h2 className="font-semibold">Planner</h2>
          </div>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlannerTask()}
              placeholder="Add a task..."
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none text-sm"
            />
            <button
              onClick={addPlannerTask}
              className="px-4 py-2 rounded-xl font-medium text-sm"
              style={{ backgroundColor: 'var(--theme-primary)', color: theme.background }}
            >
              Add
            </button>
          </div>
          <ul className="space-y-2 max-h-48 overflow-auto">
            {plannerTasks.slice(0, 10).map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10"
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                  className="rounded accent-[var(--theme-primary)]"
                />
                <span className={`flex-1 text-sm ${t.completed ? 'line-through text-white/50' : ''}`}>
                  {t.title}
                </span>
              </li>
            ))}
            {plannerTasks.length === 0 && (
              <li className="text-sm text-white/50 py-2">No tasks yet. Add one above.</li>
            )}
          </ul>
        </section>

        {/* Today's schedule (from bot) */}
        {profile.schedule?.length > 0 && (
          <section className="rounded-2xl p-4 border border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-3">
              <CalendarIcon className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
              <h2 className="font-semibold">Today's schedule</h2>
            </div>
            <ul className="space-y-2">
              {profile.schedule
                .filter((s) => s.enabled)
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((s) => (
                  <li key={s.id} className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-white/70 w-14">{s.time}</span>
                    <span>{s.label}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Hydration reminder */}
        <section className="rounded-2xl p-4 border border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            <span className="font-medium">Hydration goal</span>
          </div>
          <span className="font-mono">{profile.hydrationGoalGlasses || 8} glasses/day</span>
        </section>
      </main>
    </div>
  )
}
