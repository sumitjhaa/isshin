'use client'
import './TimerDisplay.css'

import { useState } from 'react'
import { useTimerContext } from '@/providers/AppProviders'
import { useToast } from '@/providers/ToastProvider'
import { ConfirmTabModal } from '@/components/ui/ConfirmTabModal'
import { PHASES, LABELS } from '@/lib/types'
import type { Phase } from '@/lib/types'

export function TimerDisplay() {
  const { state, dispatch, toggle, mins, secs } = useTimerContext()
  const { addToast } = useToast()
  const [pendingPhase, setPendingPhase] = useState<Phase | null>(null)

  const handlePhaseClick = (p: Phase) => {
    if (state.running && p !== state.phase) {
      setPendingPhase(p)
    } else {
      dispatch({ type: 'SET_PHASE', phase: p })
      addToast('info', `Switched to ${LABELS[p]}`)
    }
  }

  return (
    <div className="content">
      {pendingPhase && (
        <ConfirmTabModal
          timeLeft={state.timeLeft}
          phase={state.phase}
          onReset={() => { dispatch({ type: 'RESET' }); dispatch({ type: 'SET_PHASE', phase: pendingPhase }); setPendingPhase(null); addToast('info', `Switched to ${LABELS[pendingPhase]}`) }}
          onAccept={() => { dispatch({ type: 'SET_PHASE', phase: pendingPhase }); setPendingPhase(null); addToast('info', `Switched to ${LABELS[pendingPhase]}`) }}
          onReject={() => setPendingPhase(null)}
        />
      )}
      <div className="phase-buttons">
        <div className="phase-btn-row">
          {PHASES.map((p) => (
            <button
              key={p}
              onClick={() => handlePhaseClick(p)}
              className={`phase-btn${state.phase === p ? ' active' : ''}`}
            >
              {LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="timer">
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <div className="controls">
        <button onClick={() => { toggle(); addToast('info', state.running ? 'Paused' : 'Started') }} className="btn">
          {state.running ? 'Pause' : 'Start'}
        </button>
        <button onClick={() => { dispatch({ type: 'RESET' }); addToast('info', 'Timer reset') }} className="btn-secondary">
          Reset
        </button>
      </div>

      <div className="sessions">
        Sessions: {state.sessions}
      </div>
    </div>
  )
}
