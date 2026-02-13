import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '../context/UserProfileContext'
import { useTheme } from '../context/ThemeContext'
import type { UserProfile, Profession, ScheduleItem } from '../types'
import { MessageCircle, User, Moon, Droplets, ListTodo, Calendar, Palette } from 'lucide-react'

const PROFESSIONS: { value: Profession; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'graduate', label: 'Graduate' },
  { value: 'working', label: 'Working' },
  { value: 'homemaker', label: 'Homemaker' },
]

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: '1', label: 'Wake up & hydrate', time: '06:00', enabled: true },
  { id: '2', label: 'Morning routine', time: '06:30', enabled: true },
  { id: '3', label: 'Breakfast', time: '07:30', enabled: true },
  { id: '4', label: 'Focus block', time: '09:00', enabled: true },
  { id: '5', label: 'Hydration check', time: '11:00', enabled: true },
  { id: '6', label: 'Lunch', time: '13:00', enabled: true },
  { id: '7', label: 'Afternoon break', time: '15:30', enabled: true },
  { id: '8', label: 'Evening wind-down', time: '20:00', enabled: true },
  { id: '9', label: 'Sleep', time: '22:00', enabled: true },
]

const STEPS = [
  { id: 'welcome', title: 'Welcome', icon: MessageCircle },
  { id: 'basics', title: 'About you', icon: User },
  { id: 'sleep', title: 'Sleep', icon: Moon },
  { id: 'hydration', title: 'Hydration', icon: Droplets },
  { id: 'routines', title: 'Routines', icon: ListTodo },
  { id: 'schedule', title: 'Schedule', icon: Calendar },
  { id: 'theme', title: 'Theme', icon: Palette },
]

export default function OnboardingBot() {
  const navigate = useNavigate()
  const { profile, setProfile } = useUserProfile()
  const { themes, setThemeId, themeId } = useTheme()
  const [stepIndex, setStepIndex] = useState(0)
  const [name, setName] = useState(profile.name || '')
  const [age, setAge] = useState(profile.age || '')
  const [sex, setSex] = useState<UserProfile['sex']>(profile.sex)
  const [profession, setProfession] = useState<Profession>(profile.profession)
  const [bedtime, setBedtime] = useState(profile.sleepSchedule?.bedtime || '22:00')
  const [wakeTime, setWakeTime] = useState(profile.sleepSchedule?.wakeTime || '06:00')
  const [hydration, setHydration] = useState(profile.hydrationGoalGlasses || 8)
  const [routines, setRoutines] = useState(profile.routines?.join(', ') || '')
  const [schedule, setSchedule] = useState<ScheduleItem[]>(profile.schedule?.length ? profile.schedule : DEFAULT_SCHEDULE)

  const step = STEPS[stepIndex]
  const StepIcon = step?.icon

  const next = () => {
    if (stepIndex === 1) {
      setProfile({
        name: name.trim(),
        age: Number(age) || 0,
        sex,
        profession,
      })
    }
    if (stepIndex === 2) {
      setProfile({ sleepSchedule: { bedtime, wakeTime } })
    }
    if (stepIndex === 3) {
      setProfile({ hydrationGoalGlasses: hydration })
    }
    if (stepIndex === 4) {
      setProfile({
        routines: routines
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      })
    }
    if (stepIndex === 5) {
      setProfile({ schedule })
    }
    if (stepIndex === STEPS.length - 1) {
      setProfile({ onboardingComplete: true, themeId })
      navigate('/dashboard')
      return
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  }

  const back = () => setStepIndex((i) => Math.max(0, i - 1))

  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <header className="p-4 flex items-center gap-3 border-b border-white/10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          <MessageCircle className="text-lifesync-navy w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold">LifeSync Bot</h1>
          <p className="text-sm text-white/60">Step {stepIndex + 1} of {STEPS.length}</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 pb-24">
        <div className="flex items-center gap-2 mb-6">
          {StepIcon && <StepIcon className="w-6 h-6 opacity-80" style={{ color: 'var(--theme-primary)' }} />}
          <h2 className="text-xl font-semibold">{step?.title}</h2>
        </div>

        {step?.id === 'welcome' && (
          <div className="space-y-4 text-white/80">
            <p>I'll help you set up your personalized schedule. I need a few details so your plan fits your life.</p>
            <p>You can customize your schedule and theme at the end.</p>
          </div>
        )}

        {step?.id === 'basics' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="25"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Sex</label>
              <div className="flex gap-2">
                {(['male', 'female', 'other'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSex(s)}
                    className={`flex-1 py-2 rounded-lg capitalize border transition ${
                      sex === s
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/20 text-white'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Profession</label>
              <div className="grid grid-cols-2 gap-2">
                {PROFESSIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setProfession(value)}
                    className={`py-3 rounded-lg border transition ${
                      profession === value
                        ? 'border-[var(--theme-primary)] bg-[var(--theme-primary)]/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step?.id === 'sleep' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Wake time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none"
              />
            </div>
          </div>
        )}

        {step?.id === 'hydration' && (
          <div className="space-y-4">
            <label className="block text-sm text-white/70">Daily hydration goal (glasses of water)</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={4}
                max={16}
                value={hydration}
                onChange={(e) => setHydration(Number(e.target.value))}
                className="flex-1 accent-[var(--theme-primary)]"
              />
              <span className="font-mono w-8 text-right">{hydration}</span>
            </div>
          </div>
        )}

        {step?.id === 'routines' && (
          <div>
            <label className="block text-sm text-white/70 mb-1">Basic routines (comma-separated)</label>
            <input
              type="text"
              value={routines}
              onChange={(e) => setRoutines(e.target.value)}
              placeholder="e.g. Meditation, Exercise, Reading"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[var(--theme-primary)] focus:outline-none"
            />
          </div>
        )}

        {step?.id === 'schedule' && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">Toggle and edit times. This becomes your daily plan.</p>
            {schedule.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={(e) =>
                    setSchedule((s) =>
                      s.map((x) => (x.id === item.id ? { ...x, enabled: e.target.checked } : x))
                    )
                  }
                  className="rounded accent-[var(--theme-primary)]"
                />
                <input
                  type="time"
                  value={item.time}
                  onChange={(e) =>
                    setSchedule((s) => s.map((x) => (x.id === item.id ? { ...x, time: e.target.value } : x)))
                  }
                  className="w-24 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-mono"
                />
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) =>
                    setSchedule((s) => s.map((x) => (x.id === item.id ? { ...x, label: e.target.value } : x)))
                  }
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
              </div>
            ))}
          </div>
        )}

        {step?.id === 'theme' && (
          <div className="space-y-3">
            <p className="text-sm text-white/70">Choose your app theme.</p>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  className="p-4 rounded-xl border-2 text-left transition"
                  style={{
                    borderColor: themeId === t.id ? t.primary : 'rgba(255,255,255,0.1)',
                    backgroundColor: t.background + '40',
                  }}
                >
                  <span className="block w-4 h-4 rounded-full mb-2" style={{ backgroundColor: t.primary }} />
                  <span className="font-medium capitalize">{t.name}</span>
                </button>
              ))}
            </div>
            <p className="text-sm text-white/50 mt-4">You can change this later in settings.</p>
          </div>
        )}
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 bg-[var(--theme-bg)]/95 border-t border-white/10">
        {stepIndex > 0 && (
          <button
            type="button"
            onClick={back}
            className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
          >
            Back
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="flex-1 py-3 rounded-xl font-semibold text-navy transition opacity-90 hover:opacity-100"
          style={{ backgroundColor: 'var(--theme-primary)' }}
        >
          {stepIndex === STEPS.length - 1 ? 'Finish' : 'Next'}
        </button>
      </footer>
    </div>
  )
}
