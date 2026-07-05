'use client'
import './ConfirmTabModal.css'
import { useEffect } from 'react'
import { LABELS } from '@/lib/types'

export function ConfirmTabModal({
  timeLeft, phase, onReset, onAccept, onReject,
}: {
  timeLeft: number
  phase: string
  onReset: () => void
  onAccept: () => void
  onReject: () => void
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onReject()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onReject])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="confirm-tab-overlay" onClick={onReject}>
      <div className="confirm-tab-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-tab-header">
          <h3>Timer is running</h3>
          <button className="confirm-tab-cross" onClick={onReject} aria-label="Close">&times;</button>
        </div>
        <p>
          Currently in <strong>{LABELS[phase as keyof typeof LABELS]}</strong> —{' '}
          <strong>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</strong> remaining
        </p>
        <div className="confirm-tab-actions">
          <button className="confirm-tab-btn reset" onClick={onReset}>Reset &amp; switch</button>
          <button className="confirm-tab-btn accept" onClick={onAccept}>Keep timer &amp; switch</button>
        </div>
      </div>
    </div>
  )
}
