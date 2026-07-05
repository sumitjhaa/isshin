'use client'
import { useState, useEffect, useRef } from 'react'

export function useMountTransition(show: boolean, duration = 200) {
  const [mounted, setMounted] = useState(show)

  useEffect(() => {
    if (show) {
      setMounted(true)
    } else {
      const id = setTimeout(() => setMounted(false), duration)
      return () => clearTimeout(id)
    }
  }, [show, duration])

  return { mounted, visible: show }
}
