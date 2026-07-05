'use client'
import './ColorPicker.css'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  }
  const r = Math.round(f(5) * 255)
  const g = Math.round(f(3) * 255)
  const b = Math.round(f(1) * 255)
  return ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const d = mx - mn
  let h = 0
  if (d !== 0) {
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60
    else if (mx === g) h = ((b - r) / d + 2) * 60
    else h = ((r - g) / d + 4) * 60
  }
  return { h, s: mx === 0 ? 0 : d / mx, v: mx }
}

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

  const init = value && /^[0-9a-f]{6}$/i.test(value) ? hexToHsv(value) : { h: 0, s: 0, v: 1 }
  const [hue, setHue] = useState(init.h)
  const [sv, setSv] = useState({ s: init.s, v: init.v })
  const [hexInput, setHexInput] = useState(value || 'ffffff')
  const fieldRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const dragging = useRef<{ type: 'hue' | 'sv' } | null>(null)

  const emitHex = useCallback((h: number, s: number, v: number) => {
    const hex = hsvToHex(h, s, v)
    setHexInput(hex)
    onChange(hex)
  }, [onChange])

  const handleSvDown = useCallback((e: React.MouseEvent) => {
    const el = fieldRef.current
    if (!el) return
    dragging.current = { type: 'sv' }
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    setSv({ s: x, v: 1 - y })
    emitHex(hue, x, 1 - y)
  }, [hue, emitHex])

  const handleHueDown = useCallback((e: React.MouseEvent) => {
    const el = hueRef.current
    if (!el) return
    dragging.current = { type: 'hue' }
    const rect = el.getBoundingClientRect()
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const h = y * 360
    setHue(h)
    emitHex(h, sv.s, sv.v)
  }, [sv, emitHex])

  useEffect(() => {
    if (!dragging.current) return
    const onMove = (e: MouseEvent) => {
      if (dragging.current?.type === 'sv') {
        const el = fieldRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
        setSv({ s: x, v: 1 - y })
        emitHex(hue, x, 1 - y)
      } else if (dragging.current?.type === 'hue') {
        const el = hueRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
        const h = y * 360
        setHue(h)
        emitHex(h, sv.s, sv.v)
      }
    }
    const onUp = () => { dragging.current = null }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [hue, sv, emitHex])

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 6)
    setHexInput(v)
    if (v.length === 6) {
      const hsv = hexToHsv(v)
      setHue(hsv.h)
      setSv({ s: hsv.s, v: hsv.v })
      onChange(v)
    }
  }

  const hex = hsvToHex(hue, sv.s, sv.v)
  const svBase = `hsl(${hue}, 100%, 50%)`

  const handleTriggerClick = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right })
    }
    if (!open) {
      const cur = value && /^[0-9a-f]{6}$/i.test(value) ? hexToHsv(value) : { h: 0, s: 0, v: 1 }
      setHue(cur.h)
      setSv({ s: cur.s, v: cur.v })
      setHexInput(value || 'ffffff')
    }
    setOpen(!open)
  }

  return (
    <div className="cp-wrap" ref={triggerRef}>
      <button type="button" className="cp-trigger" onClick={handleTriggerClick}>
        <span className="cp-swatch" style={{ background: value ? `#${value}` : 'transparent' }} />
        <span className="cp-trigger-label">{value ? `#${value}` : 'Color'}</span>
        {value && (
          <span className="cp-trigger-clear" onClick={(e) => { e.stopPropagation(); onChange(''); setHexInput('ffffff'); setHue(0); setSv({ s: 0, v: 1 }) }}>✕</span>
        )}
        <svg className="cp-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor" /></svg>
      </button>
      {open && typeof document === 'object' && createPortal(
        <div className="cp-menu" ref={menuRef} style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 200 }}>
          <div className="cp">
            <div className="cp-body">
              <div className="cp-hue" ref={hueRef} onMouseDown={handleHueDown}>
                <div className="cp-hue-drag" style={{ top: `${(hue / 360) * 100}%` }} />
              </div>
              <div className="cp-field" ref={fieldRef} onMouseDown={handleSvDown}>
                <div className="cp-field-bg" style={{ background: svBase }} />
                <div className="cp-field-overlay" />
                <div className="cp-field-drag" style={{ left: `${sv.s * 100}%`, top: `${(1 - sv.v) * 100}%` }} />
              </div>
            </div>
            <div className="cp-footer">
              <div className="cp-preview" style={{ background: `#${hex}` }} />
              <span className="cp-hash">#</span>
              <input className="cp-input" value={hexInput} onChange={handleHexChange} spellCheck={false} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
