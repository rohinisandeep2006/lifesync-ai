export type Profession = 'student' | 'graduate' | 'working' | 'homemaker'

export interface SleepSchedule {
  bedtime: string
  wakeTime: string
  napMinutes?: number
}

export interface UserProfile {
  name: string
  age: number
  sex: 'male' | 'female' | 'other'
  profession: Profession
  sleepSchedule: SleepSchedule
  hydrationGoalGlasses: number
  routines: string[]
  schedule: ScheduleItem[]
  themeId: string
  onboardingComplete: boolean
}

export interface ScheduleItem {
  id: string
  label: string
  time: string
  enabled: boolean
  icon?: string
}

export interface Theme {
  id: string
  name: string
  primary: string
  secondary: string
  background: string
  accent: string
}

export interface StreakDay {
  date: string
  completed: boolean
  tasksDone: number
}

export interface PlannerTask {
  id: string
  title: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}
