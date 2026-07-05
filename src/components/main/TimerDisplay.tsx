'use client'
import './TimerDisplay.css'

import { useTimerContext } from '@/providers/AppProviders'
import { PHASES, LABELS } from '@/lib/types'

export function TimerDisplay() {
  const { state, dispatch, toggle, mins, secs } = useTimerContext()

  return (
    <div className="content">
      <div className="phase-buttons">
        <div className="phase-btn-row">
          {PHASES.map((p) => (
            <button
              key={p}
              onClick={() => dispatch({ type: 'SET_PHASE', phase: p })}
              className={`phase-btn${state.phase === p ? ' active' : ''}`}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>
        <div className="durations">
          <span>{Math.round(state.config.work / 60)}m focus</span>
          <span>·</span>
          <span>{Math.round(state.config.shortBreak / 60)}m short</span>
          <span>·</span>
          <span>{Math.round(state.config.longBreak / 60)}m long</span>
        </div>
      </div>

      <div className={`timer${state.running ? ' pulse' : ''}`}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <div className="controls">
        <button onClick={toggle} className="btn">
          {state.running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => dispatch({ type: 'RESET' })} className="btn-secondary">
          Reset
        </button>
      </div>

      <div className="sessions">
        Sessions: {state.sessions}
      </div>
    </div>
  )
}
