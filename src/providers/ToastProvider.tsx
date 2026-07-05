'use client'

import '@/components/ui/Toast.css'
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import type { ToastType } from '@/lib/types'
import { ToastContainer } from '@/components/ui/Toast'

interface Toast {
  id: number
  type: ToastType
  message: string
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
