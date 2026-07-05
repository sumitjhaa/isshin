'use client'
import './ColorPicker.css'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { COLORS } from '@/data/wallhaven'

export function ColorPicker({ value, onChange }: {
  value: string
  onChange: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, right: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      const t = e.target as Node
      if (triggerRef.current && !triggerRef.current.contains(t) && menuRef.current && !menuRef.current.contains(t)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const selected = COLORS.find(c => c.value === value)

  return (
    <div className="cp-wrap" ref={triggerRef}>
      <button type="button" className="cp-trigger" onClick={() => {
        if (triggerRef.current) {
          const r = triggerRef.current.getBoundingClientRect()
          setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
        }
        setOpen(o => !o)
      }}>
        {selected && <span className="cp-swatch" style={{ background: `#${selected.value}` }} />}
        <span className="cp-trigger-label">{selected ? selected.label : 'Color'}</span>
        {value && (
          <span className="cp-trigger-clear" onClick={(e) => { e.stopPropagation(); onChange('') }}>✕</span>
        )}
        <svg className="cp-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor" /></svg>
      </button>
      {open && typeof document === 'object' && createPortal(
        <div className="cp-menu" ref={menuRef} style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 200 }}>
          <div className="cp-list">
            {COLORS.map(c => (
              <button key={c.value} type="button" className={`cp-item${c.value === value ? ' active' : ''}`}
                onClick={() => { onChange(c.value); setOpen(false) }}>
                <span className="cp-swatch" style={{ background: `#${c.value}` }} />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
