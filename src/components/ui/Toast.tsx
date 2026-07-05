'use client'

import { CloseIcon, InfoIcon, SuccessIcon, ErrorIcon, WarningIcon, TipIcon } from '@/components/icons'
import type { ToastType } from '@/lib/types'

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  tip: <TipIcon />,
}

export function ToastContainer({ toasts, onClose }: { toasts: Array<{ id: number; type: ToastType; message: string }>; onClose: (id: number) => void }) {
  return (
    <div className="toast-container">
      {toasts.map((t, i) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          style={{ zIndex: toasts.length - i }}
        >
          <span className={`toast-icon ${t.type}`}>{TOAST_ICONS[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => onClose(t.id)} aria-label="Dismiss">
            <CloseIcon />
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  )
}
