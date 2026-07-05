'use client'

import { createContext, useContext } from 'react'
import { useTimer } from '@/hooks/useTimer'
import { useWallpaper } from '@/hooks/useWallpaper'
import { useUI } from '@/hooks/useUI'

const TimerCtx = createContext<ReturnType<typeof useTimer> | null>(null)
const WallpaperCtx = createContext<ReturnType<typeof useWallpaper> | null>(null)
const UICtx = createContext<ReturnType<typeof useUI> | null>(null)

export function AppProviders({ children }: { children: React.ReactNode }) {
  const timer = useTimer()
  const wp = useWallpaper()
  const ui = useUI()

  return (
    <TimerCtx.Provider value={timer}>
      <WallpaperCtx.Provider value={wp}>
        <UICtx.Provider value={ui}>
          {children}
        </UICtx.Provider>
      </WallpaperCtx.Provider>
    </TimerCtx.Provider>
  )
}

export function useTimerContext() {
  const ctx = useContext(TimerCtx)
  if (!ctx) throw new Error('useTimerContext must be used within AppProviders')
  return ctx
}

export function useWallpaperContext() {
  const ctx = useContext(WallpaperCtx)
  if (!ctx) throw new Error('useWallpaperContext must be used within AppProviders')
  return ctx
}

export function useUIContext() {
  const ctx = useContext(UICtx)
  if (!ctx) throw new Error('useUIContext must be used within AppProviders')
  return ctx
}
