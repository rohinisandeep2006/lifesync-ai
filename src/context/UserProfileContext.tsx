import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { UserProfile, StreakDay, PlannerTask } from '@/types'

const STORAGE_KEY = 'lifesync_profile'
const STREAK_KEY = 'lifesync_streak'
const PLANNER_KEY = 'lifesync_planner'

const defaultProfile: UserProfile = {
  name: '',
  age: 0,
  sex: 'other',
  profession: 'student',
  sleepSchedule: { bedtime: '22:00', wakeTime: '06:00' },
  hydrationGoalGlasses: 8,
  routines: [],
  schedule: [],
  themeId: 'mint',
  onboardingComplete: false,
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

function saveJson(key: string, data: object) {
  localStorage.setItem(key, JSON.stringify(data))
}

const UserProfileContext = createContext<{
  profile: UserProfile
  setProfile: (p: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => void
  streakDays: StreakDay[]
  markDayComplete: (date: string, tasksDone: number) => void
  plannerTasks: PlannerTask[]
  setPlannerTasks: React.Dispatch<React.SetStateAction<PlannerTask[]>>
} | null>(null)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(() => loadJson(STORAGE_KEY, defaultProfile))
  const [streakDays, setStreakDays] = useState<StreakDay[]>(() => loadJson(STREAK_KEY, []))
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>(() => loadJson(PLANNER_KEY, []))

  const setProfile = useCallback((p: Partial<UserProfile> | ((prev: UserProfile) => UserProfile)) => {
    setProfileState((prev) => {
      const next = typeof p === 'function' ? p(prev) : { ...prev, ...p }
      saveJson(STORAGE_KEY, next)
      return next
    })
  }, [])

  useEffect(() => {
    saveJson(STREAK_KEY, streakDays)
  }, [streakDays])

  useEffect(() => {
    saveJson(PLANNER_KEY, plannerTasks)
  }, [plannerTasks])

  const markDayComplete = useCallback((date: string, tasksDone: number) => {
    setStreakDays((prev) => {
      const i = prev.findIndex((d) => d.date === date)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { date, completed: true, tasksDone }
        return next
      }
      return [...prev, { date, completed: true, tasksDone }]
    })
  }, [])

  return (
    <UserProfileContext.Provider
      value={{ profile, setProfile, streakDays, markDayComplete, plannerTasks, setPlannerTasks }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider')
  return ctx
}
