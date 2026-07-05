'use client'

import { ToastProvider } from '@/providers/ToastProvider'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
