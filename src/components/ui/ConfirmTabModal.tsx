'use client'
import './ConfirmTabModal.css'
import { LABELS, formatTime } from '@/lib/types'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import type { Phase } from '@/lib/types'

export function ConfirmTabModal({
  timeLeft, phase, onReset, onAccept, onReject,
}: {
  timeLeft: number
  phase: Phase
  onReset: () => void
  onAccept: () => void
  onReject: () => void
}) {
  useEscapeKey(onReject)

  return (
    <div className="confirm-tab-overlay" onClick={onReject}>
      <div className="confirm-tab-modal" onClick={e => e.stopPropagation()}>
        <div className="confirm-tab-header">
          <h3>Timer is running</h3>
          <button className="confirm-tab-cross" onClick={onReject} aria-label="Close">&times;</button>
        </div>
        <p>
          Currently in <strong>{LABELS[phase]}</strong> —{' '}
          <strong>{formatTime(timeLeft)}</strong> remaining
        </p>
        <div className="confirm-tab-actions">
          <button className="confirm-tab-btn reset" onClick={onReset}>Reset &amp; switch</button>
          <button className="confirm-tab-btn accept" onClick={onAccept}>Keep timer &amp; switch</button>
        </div>
      </div>
    </div>
  )
}
