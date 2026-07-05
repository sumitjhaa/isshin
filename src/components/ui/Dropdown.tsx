'use client'
import './Dropdown.css'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Item {
  value: string
  label: string
  style?: React.CSSProperties
}

export function Dropdown({ items, value, onChange, className, placeholder = 'Select…', search }: {
  items: Item[]
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
  search?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      const t = e.target as Node
      if (rootRef.current && !rootRef.current.contains(t) && menuRef.current && !menuRef.current.contains(t)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const filtered = search && q.trim() ? items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) : items
  const selected = items.find(i => i.value === value)

  return (
    <div className={`select-dropdown${open ? ' open' : ''}${className ? ` ${className}` : ''}`} ref={rootRef}>
      <button type="button" className="select-dropdown-trigger" onClick={() => {
        if (!open && rootRef.current) {
          const r = rootRef.current.getBoundingClientRect()
          setPos({ top: r.bottom + 4, left: r.left, width: r.width })
        }
        setQ('')
        setOpen(!open)
      }}>
        <span className="select-dropdown-selected">{selected?.label ?? placeholder}</span>
        <svg className="select-dropdown-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor"/></svg>
      </button>
      {open && createPortal(
        <div className="select-dropdown-menu" ref={menuRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 200 }}>
          {search && (
            <div className="select-dropdown-search">
              <input autoFocus placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} className="select-dropdown-input" />
            </div>
          )}
          <div className="select-dropdown-list">
            {filtered.map(i => (
              <button key={i.value} type="button" className={`select-dropdown-item${i.value === value ? ' active' : ''}`} onClick={() => { onChange(i.value); setOpen(false) }} style={i.style}>
                {i.label}
              </button>
            ))}
            {filtered.length === 0 && <div className="select-dropdown-empty">No results</div>}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
