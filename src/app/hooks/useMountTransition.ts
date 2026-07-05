'use client'

import { useReducer, useEffect, useRef } from 'react'

type Phase = 'hidden' | 'entering' | 'entered' | 'exiting'

function reducer(state: Phase, action: 'show' | 'hide' | 'enter-done' | 'exit-done'): Phase {
  switch (action) {
    case 'show':
      return state === 'hidden' ? 'entering' : state
    case 'enter-done':
      return state === 'entering' ? 'entered' : state
    case 'hide':
      return state === 'entered' || state === 'entering' ? 'exiting' : state
    case 'exit-done':
      return state === 'exiting' ? 'hidden' : state
    default:
      return state
  }
}

export function useMountTransition(show: boolean, duration = 200) {
  const [phase, dispatch] = useReducer(reducer, show ? 'entered' : 'hidden')
  const prevShow = useRef(show)

  useEffect(() => {
    if (prevShow.current === show) return
    prevShow.current = show

    if (show) {
      dispatch('show')
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => dispatch('enter-done'))
      })
      return () => cancelAnimationFrame(raf)
    } else {
      dispatch('hide')
      const timer = setTimeout(() => dispatch('exit-done'), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  return {
    mounted: phase !== 'hidden',
    visible: phase === 'entered' || phase === 'entering',
  }
}
