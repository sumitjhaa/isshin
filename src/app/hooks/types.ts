export type Phase = 'work' | 'shortBreak' | 'longBreak'

export const PHASES: Phase[] = ['work', 'shortBreak', 'longBreak']
export const LABELS: Record<Phase, string> = {
  work: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export interface Theme {
  name: string
  bg: string
  text: string
  primary: string
  secondary: string
  neutral: string
  surface: string
  border: string
  accent: string
}

export type TabId = 'timer' | 'theme' | 'wallpaper'

export type WallpaperResult = {
  id: string
  thumb: string
  full: string
}

export type State = {
  phase: Phase
  timeLeft: number
  running: boolean
  sessions: number
  config: Record<Phase, number>
}

export type Action =
  | { type: 'TICK' }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_CONFIG'; config: Record<Phase, number> }
