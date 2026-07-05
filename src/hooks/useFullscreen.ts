'use client'

import { useState, useEffect, useCallback } from 'react'

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const toggleFullscreen = useCallback(() => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    } catch { }
  }, [])

  return { isFullscreen, toggleFullscreen }
}
