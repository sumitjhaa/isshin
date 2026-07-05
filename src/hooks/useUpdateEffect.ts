'use client'
import { useEffect, useRef } from 'react'

export function useUpdateEffect(fn: () => void, deps: unknown[]) {
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    fn()
  }, deps)
}
