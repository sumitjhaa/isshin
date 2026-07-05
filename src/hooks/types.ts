import type { Phase } from '@/lib/types'

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
