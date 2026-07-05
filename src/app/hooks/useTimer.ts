'use client'

import { useReducer, useEffect, useState } from 'react'
import type { Phase, State, Action } from './types'

const DEFAULT_CONFIG: Record<Phase, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const INITIAL: State = {
  phase: 'work',
  timeLeft: DEFAULT_CONFIG.work,
  running: false,
  sessions: 0,
  config: DEFAULT_CONFIG,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TICK': {
      if (!state.running) return state
      const t = state.timeLeft - 1
      if (t > 0) return { ...state, timeLeft: t }
      if (state.phase === 'work') {
        const s = state.sessions + 1
        const next: Phase = s % 4 === 0 ? 'longBreak' : 'shortBreak'
        return { phase: next, timeLeft: state.config[next], sessions: s, running: false, config: state.config }
      }
      return { phase: 'work', timeLeft: state.config.work, sessions: state.sessions, running: false, config: state.config }
    }
    case 'START':
      return { ...state, running: true }
    case 'PAUSE':
      return { ...state, running: false }
    case 'RESET':
      return { phase: 'work', timeLeft: state.config.work, running: false, sessions: 0, config: state.config }
    case 'SET_PHASE':
      return { ...state, phase: action.phase, timeLeft: state.config[action.phase], running: false }
    case 'SET_CONFIG':
      return { ...state, config: action.config, timeLeft: action.config[state.phase], running: false }
  }
}

export function useTimer() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const [customDurations, setCustomDurations] = useState({ work: 25, shortBreak: 5, longBreak: 15 })

  useEffect(() => {
    if (!state.running) return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.running])

  const toggle = () => dispatch({ type: state.running ? 'PAUSE' : 'START' })
  const mins = Math.floor(state.timeLeft / 60)
  const secs = state.timeLeft % 60

  const saveSettings = () => {
    dispatch({
      type: 'SET_CONFIG',
      config: {
        work: customDurations.work * 60,
        shortBreak: customDurations.shortBreak * 60,
        longBreak: customDurations.longBreak * 60,
      },
    })
  }

  return { state, dispatch, toggle, mins, secs, customDurations, setCustomDurations, saveSettings }
}
