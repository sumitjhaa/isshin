'use client'
import './ThemeTab.css'

import { useState, useMemo } from 'react'
import { THEMES } from '@/data/themes'
import type { ThemeKey } from '@/data/themes'
import type { Theme } from '@/lib/types'
import { EmptyBoxIcon } from '@/components/icons'
import { useUIContext } from '@/providers/AppProviders'
import { useToast } from '@/providers/ToastProvider'

export function ThemeTab() {
  const { currentTheme, setCurrentTheme } = useUIContext()
  const { addToast } = useToast()
  const [themeQuery, setThemeQuery] = useState('')
  const entries = Object.entries(THEMES) as [ThemeKey, Theme][]
  const filtered = useMemo(() => {
    if (!themeQuery.trim()) return entries
    const q = themeQuery.toLowerCase()
    return entries.filter(([, t]) => t.name.toLowerCase().includes(q))
  }, [entries, themeQuery])

  return (
    <div>
      <div className="theme-search">
        <input
          className="theme-search-input"
          placeholder="Search themes…"
          value={themeQuery}
          onChange={(e) => setThemeQuery(e.target.value)}
        />
        <span className="theme-count-badge">{filtered.length}/{entries.length}</span>
      </div>
      <div className="theme-grid">
        {filtered.map(([key, t], i) => (
          <button
            key={key}
            className={`theme-card${currentTheme === key ? ' active' : ''}`}
            onClick={() => { setCurrentTheme(key); addToast('success', `Theme: ${t.name}`) }}
            style={{ '--i': i } as React.CSSProperties}
          >
            <div className="theme-card-preview" style={{ backgroundColor: t.bg }}>
              <span className="theme-card-squares">
                <span style={{ backgroundColor: t.primary }} />
                <span style={{ backgroundColor: t.secondary }} />
                <span style={{ backgroundColor: t.accent }} />
              </span>
              <span className="theme-card-preview-text" style={{ color: t.primary }}>{t.name}</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="theme-search-empty">
            <EmptyBoxIcon />
            <span>No themes match</span>
          </div>
        )}
      </div>
    </div>
  )
}
