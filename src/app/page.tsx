'use client'

import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { useTimer } from './hooks/useTimer'
import { useWallpaper } from './hooks/useWallpaper'
import { useUI } from './hooks/useUI'
import { useMountTransition } from './hooks/useMountTransition'
import { PHASES, LABELS } from './hooks/types'
import { THEMES } from './data'
import type { ThemeKey } from './data'
import type { Theme, TabId } from './hooks/types'
import type { FontCategory, FontOption } from './hooks/useUI'

function GearIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path opacity="0.4" d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z" fill="currentColor"/><path d="M12 15.25C13.7949 15.25 15.25 13.7949 15.25 12C15.25 10.2051 13.7949 8.75 12 8.75C10.2051 8.75 8.75 10.2051 8.75 12C8.75 13.7949 10.2051 15.25 12 15.25Z" fill="currentColor"/></svg>
}

function ExpandIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
}
function CompressIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15h-6v6M3 9h6V3M21 21l-6-6M3 3l6 6"/></svg>
}

function CloseIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}

function ClockIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

function PaletteIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="10.5" r="1.5"/><circle cx="12" cy="17.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.4-.15-.75-.41-1.02a1.48 1.48 0 010-2.11c.27-.27.62-.44 1.02-.44H16c4.42 0 6-2.93 6-6.5C22 4.5 17.5 2 12 2z"/></svg>
}

function ImageIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
}

function SearchIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}

function TrashIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
}



function BrushIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 2H4v4h16V2z"/><path d="M4 6v14a2 2 0 002 2h12a2 2 0 002-2V6"/><path d="M8 12h8"/><path d="M10 9h4"/><path d="M10 15h4"/></svg>
}

function AaIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
}

function ResetIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
}

function EmptyBoxIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
}

function ShimmerIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
}

function InfoIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
}
function SuccessIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 11 15 16 9"/></svg>
}
function ErrorIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
}
function WarningIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
}
function TipIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 006 8c0 1 .2 2.2 1.5 3.5C7.7 12.8 8 14.5 8 16"/><line x1="8" y1="18" x2="16" y2="18"/><line x1="10" y1="21" x2="14" y2="21"/><polyline points="9 12 12 10.5 13 12 14 10.5 15 12"/></svg>
}

export default function Page() {
  const timer = useTimer()
  const wp = useWallpaper()
  const ui = useUI()

  const { state, dispatch, toggle, mins, secs, customDurations, setCustomDurations, saveSettings } = timer
  const { searchQuery, setSearchQuery, categories, toggleCategory, purity, togglePurity, searchResults, searchLoading, doSearch, wallpaper, setWallpaper, wallpaperLoading, fetchWallpaper, loadMore, hasMore, searchError } = wp
  const { settingsOpen, setSettingsOpen, activeTab, setActiveTab, currentTheme, setCurrentTheme, roundness, setRoundness, theme, sidebarRgb, fonts, setFont, weights, setWeight, fontScale, setFontScale, sidebarOpacity, setSidebarOpacity, computedSizes, currentFonts, fontOptions } = ui

  /* ---------- Global Toast ---------- */
  const [toasts, setToasts] = useState<Array<{ id: number; type: ToastType; message: string }>>([])
  const toastIdRef = useRef(0)

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  /* ---------- Fullscreen ---------- */
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

  return (
    <div
      className={`page${wallpaper ? ' has-wallpaper' : ''}`}
      data-theme={currentTheme}
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
        '--roundness': `${roundness}px`,
        '--sidebar-bg': `${sidebarRgb.r}, ${sidebarRgb.g}, ${sidebarRgb.b}`,
        '--sidebar-opacity': String(sidebarOpacity),
        '--font-timer': currentFonts.timer.value,
        '--font-ui': currentFonts.ui.value,
        '--font-mono': currentFonts.mono.value,
        '--weight-timer': String(weights.timer),
        '--weight-ui': String(weights.ui),
        '--weight-mono': String(weights.mono),
        '--size-timer': `${computedSizes.timer}rem`,
        '--size-ui': `${computedSizes.ui}rem`,
        '--size-mono': `${computedSizes.mono}rem`,
      } as React.CSSProperties}
    >
      {wallpaper && (
        <div
          className="wallpaper-overlay"
          style={{ backgroundColor: theme.bg, opacity: 0.6 }}
        />
      )}

      <div className="content">
        <div className="phase-buttons">
          <div className="phase-btn-row">
            {PHASES.map((p) => (
              <button
                key={p}
                onClick={() => dispatch({ type: 'SET_PHASE', phase: p })}
                className={`phase-btn${state.phase === p ? ' active' : ''}`}
              >
                {LABELS[p]}
              </button>
            ))}
          </div>
          <div className="durations">
            <span>{Math.round(state.config.work / 60)}m focus</span>
            <span>·</span>
            <span>{Math.round(state.config.shortBreak / 60)}m short</span>
            <span>·</span>
            <span>{Math.round(state.config.longBreak / 60)}m long</span>
          </div>
        </div>

        <div
          className={`timer${state.running ? ' pulse' : ''}`}
        >
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </div>

        <div className="controls">
          <button onClick={toggle} className="btn">
            {state.running ? 'Pause' : 'Start'}
          </button>
          <button onClick={() => dispatch({ type: 'RESET' })} className="btn-secondary">
            Reset
          </button>
        </div>

        <div className="sessions">
          Sessions: {state.sessions}
        </div>
      </div>

      <button
        className="toolbar-btn"
        style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: settingsOpen ? 50 : 20 }}
        onClick={() => setSettingsOpen(!settingsOpen)}
        title={settingsOpen ? 'Close (Esc)' : 'Settings'}
      >
        {settingsOpen ? <CloseIcon /> : <GearIcon />}
      </button>

      {!settingsOpen && (
        <button
          className="toolbar-btn"
          style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 20 }}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
        </button>
      )}

      <ToastContainer toasts={toasts} onClose={removeToast} />

      <Sidebar
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'timer' && (
          <TimerTab
            customDurations={customDurations}
            setCustomDurations={setCustomDurations}
            saveSettings={saveSettings}
            roundness={roundness}
            setRoundness={setRoundness}
            fonts={fonts}
            setFont={setFont}
            weights={weights}
            setWeight={setWeight}
            fontScale={fontScale}
            setFontScale={setFontScale}
            sidebarOpacity={sidebarOpacity}
            setSidebarOpacity={setSidebarOpacity}
            fontOptions={fontOptions}
            addToast={addToast}
          />
        )}
        {activeTab === 'theme' && (
          <ThemeTab
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
            addToast={addToast}
          />
        )}
        {activeTab === 'wallpaper' && (
          <WallpaperTab
            fetchWallpaper={fetchWallpaper}
            wallpaperLoading={wallpaperLoading}
            wallpaper={wallpaper}
            setWallpaper={setWallpaper}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            doSearch={doSearch}
            searchLoading={searchLoading}
            searchError={searchError}
            categories={categories}
            toggleCategory={toggleCategory}
            purity={purity}
            togglePurity={togglePurity}
            searchResults={searchResults}
            loadMore={loadMore}
            hasMore={hasMore}
            addToast={addToast}
          />
        )}
      </Sidebar>
    </div>
  )
}

/* ---------- Sidebar ---------- */

/* Store scroll positions per tab on the DOM element itself */
function saveScroll(el: HTMLDivElement | null, tab: TabId) {
  if (el) el.dataset[`scroll${tab}`] = String(el.scrollTop)
}
function getScroll(el: HTMLDivElement | null, tab: TabId): number {
  if (!el) return 0
  return Number(el.dataset[`scroll${tab}`] || '0')
}

function Sidebar({
  open, onClose, activeTab, setActiveTab, children,
}: {
  open: boolean
  onClose: () => void
  activeTab: TabId
  setActiveTab: (t: TabId) => void
  children: React.ReactNode
}) {
  const { mounted, visible } = useMountTransition(open, 200)
  const bodyRef = useRef<HTMLDivElement>(null)
  const prevTabRef = useRef(activeTab)

  useEffect(() => {
    if (!visible || !bodyRef.current) return
    bodyRef.current.scrollTop = getScroll(bodyRef.current, activeTab)
    prevTabRef.current = activeTab
  }, [activeTab, visible])

  useEffect(() => {
    const el = bodyRef.current
    if (el) saveScroll(el, prevTabRef.current)
  })

  useEffect(() => {
    if (!mounted) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <>
      <div
        className={`sidebar-overlay${visible ? ' entered' : ' exiting'}`}
        onClick={onClose}
      />
      <div
        className={`sidebar${visible ? ' entered' : ' exiting'}`}
      >
        <div className="sidebar-header">
          <h2>Settings</h2>
        </div>

        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="sidebar-body" ref={bodyRef}>
          <div className="tab-content">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

function TabBar({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (t: TabId) => void }) {
  return (
    <div className="tab-bar">
      {(['timer', 'theme', 'wallpaper'] as TabId[]).map((tab) => (
        <button
          key={tab}
          className={`tab-btn${activeTab === tab ? ' active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab === 'timer' ? <ClockIcon /> : tab === 'theme' ? <PaletteIcon /> : <ImageIcon />}
          {tab === 'timer' ? 'Timer' : tab === 'theme' ? 'Theme' : 'Wallpaper'}
        </button>
      ))}
    </div>
  )
}

/* ---------- Collapsible Section ---------- */

function Section({ title, icon, defaultOpen = false, children }: { title: string; icon?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="sidebar-section">
      <button className="sidebar-section-header" onClick={() => setOpen(!open)}>
        <span className="sidebar-section-header-label">
          {icon && <span className="sidebar-section-header-icon">{icon}</span>}
          {title}
        </span>
        <svg className={`sidebar-section-arrow${open ? ' open' : ''}`} width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor"/></svg>
      </button>
      {open && <div className="sidebar-section-body">{children}</div>}
    </div>
  )
}

/* ---------- Font Picker ---------- */

function FontPicker({
  options, value, onChange,
}: {
  options: FontOption[]
  value: number
  onChange: (idx: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 100,
      })
    }
  }, [open])

  const filtered = query.trim()
    ? options.filter(o => o.name.toLowerCase().includes(query.toLowerCase()))
    : options

  const selected = options[value]

  return (
    <div className={`font-picker${open ? ' open' : ''}`} ref={ref}>
      <div ref={triggerRef} className="font-picker-trigger" onClick={() => { setOpen(!open); setQuery('') }}>
        <span className="font-picker-selected">{selected?.name || 'Select…'}</span>
        <svg className="font-picker-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor"/></svg>
      </div>
      {open && (
        <div className="font-picker-dropdown" style={menuStyle}>
          <div className="font-picker-search">
            <input
              autoFocus
              placeholder="Search fonts…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="font-picker-input"
            />
          </div>
          <div className="font-picker-list">
            {filtered.map((opt) => (
              <button
                key={opt.name}
                className={`font-picker-item${options.indexOf(opt) === value ? ' active' : ''}`}
                onClick={() => { onChange(options.indexOf(opt)); setOpen(false) }}
                style={{ fontFamily: opt.value }}
              >
                {opt.name}
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="font-picker-empty">No fonts found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- RangeSlider ---------- */

function RangeSlider({ value, onChange, min, max, step, className, showValue, formatValue }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; className?: string
  showValue?: boolean; formatValue?: (v: number) => string
}) {
  const pct = min < max ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className={`range-slider${className ? ` ${className}` : ''}`}>
      <input
        type="range" min={min} max={max} step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="range-slider-input"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
      {showValue && (
        <span className="range-slider-value">{formatValue ? formatValue(value) : String(value)}</span>
      )}
    </div>
  )
}

/* ---------- Select Dropdown ---------- */

function SelectDropdown({ value, onChange, options, searchable = false, className, placeholder = 'Select…' }: {
  value: string | number
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
  searchable?: boolean
  className?: string
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({})
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options
    const q = query.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [options, query, searchable])

  const selected = options.find(o => String(o.value) === String(value))

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 100,
      })
    }
  }, [open])

  return (
    <div className={`select-dropdown${open ? ' open' : ''}${className ? ` ${className}` : ''}`} ref={ref}>
      <button ref={triggerRef} className="select-dropdown-trigger" onClick={() => { if (open) setQuery(''); setOpen(!open) }} type="button">
        <span className="select-dropdown-selected">{selected?.label ?? placeholder}</span>
        <svg className="select-dropdown-arrow" width="10" height="6" viewBox="0 0 10 6"><path d="M0 0l5 6 5-6z" fill="currentColor"/></svg>
      </button>
      {open && (
        <div className="select-dropdown-menu" style={menuStyle}>
          {searchable && (
            <div className="select-dropdown-search">
              <input autoFocus placeholder="Search…" value={query} onChange={e => setQuery(e.target.value)} className="select-dropdown-input" />
            </div>
          )}
          <div className="select-dropdown-list">
            {filtered.map(o => (
              <button
                key={o.value}
                className={`select-dropdown-item${String(o.value) === String(value) ? ' active' : ''}`}
                onClick={() => { onChange(o.value); setOpen(false) }}
                type="button"
              >
                {o.label}
              </button>
            ))}
            {filtered.length === 0 && <div className="select-dropdown-empty">No results</div>}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- Toast ---------- */

type ToastType = 'info' | 'success' | 'error' | 'warning' | 'tip'

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  tip: <TipIcon />,
}

function ToastContainer({ toasts, onClose }: { toasts: Array<{ id: number; type: ToastType; message: string }>; onClose: (id: number) => void }) {
  return (
    <div className="toast-container">
      {toasts.map((t, i) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          style={{ zIndex: toasts.length - i }}
        >
          <span className={`toast-icon ${t.type}`}>{TOAST_ICONS[t.type]}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => onClose(t.id)} aria-label="Dismiss">
            <CloseIcon />
          </button>
          <div className="toast-progress" />
        </div>
      ))}
    </div>
  )
}

/* ---------- Timer Tab ---------- */

const DEFAULTS = { work: 25, shortBreak: 5, longBreak: 15 }
const PRESETS = [
  { label: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Short', work: 15, shortBreak: 3, longBreak: 10 },
  { label: 'Long', work: 50, shortBreak: 10, longBreak: 20 },
]

function TimerTab({
  customDurations, setCustomDurations, saveSettings, roundness, setRoundness, fonts, setFont, weights, setWeight, fontScale, setFontScale, sidebarOpacity, setSidebarOpacity, fontOptions, addToast,
}: {
  customDurations: { work: number; shortBreak: number; longBreak: number }
  setCustomDurations: (d: { work: number; shortBreak: number; longBreak: number }) => void
  saveSettings: () => void
  roundness: number
  setRoundness: (v: number) => void
  fonts: Record<string, number>
  setFont: (cat: FontCategory, idx: number) => void
  weights: Record<string, number>
  setWeight: (cat: FontCategory, w: number) => void
  fontScale: number
  setFontScale: (v: number) => void
  sidebarOpacity: number
  setSidebarOpacity: (v: number) => void
  fontOptions: Record<string, FontOption[]>
  addToast: (type: ToastType, msg: string) => void
}) {
  // Auto-save on duration change
  useEffect(() => { saveSettings() }, [customDurations, saveSettings])

  const [allOpen, setAllOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem('timer-collapsed') !== 'true'
  })
  useEffect(() => { localStorage.setItem('timer-collapsed', String(!allOpen)) }, [allOpen])

  const step = (key: 'work' | 'shortBreak' | 'longBreak', delta: number) => {
    setCustomDurations({
      ...customDurations,
      [key]: Math.max(1, customDurations[key] + delta),
    })
  }

  const resetDuration = (key: 'work' | 'shortBreak' | 'longBreak') => {
    setCustomDurations({ ...customDurations, [key]: DEFAULTS[key] })
    addToast('info', `Reset to ${DEFAULTS[key]} min`)
  }

  const activePreset = useMemo(() => {
    const c = customDurations
    return PRESETS.find(p => p.work === c.work && p.shortBreak === c.shortBreak && p.longBreak === c.longBreak) ?? null
  }, [customDurations])

  const applyPreset = (p: typeof PRESETS[0]) => {
    setCustomDurations({ work: p.work, shortBreak: p.shortBreak, longBreak: p.longBreak })
    addToast('success', `Applied "${p.label}" preset`)
  }

  const totalFocus = customDurations.work * 4 + customDurations.shortBreak * 3 + customDurations.longBreak

  const [shiftHeld, setShiftHeld] = useState(false)
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'Shift') setShiftHeld(true) }
    const up = (e: KeyboardEvent) => { if (e.key === 'Shift') setShiftHeld(false) }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  return (
    <div>
      <div className="collapse-row">
        <button className="collapse-btn" onClick={() => setAllOpen(!allOpen)}>
          {allOpen ? 'Collapse all' : 'Expand all'}
        </button>
      </div>

      <Section key={`durations-${allOpen}`} title="Durations" icon={<ClockIcon />} defaultOpen={allOpen}>
        <div className="presets-row">
          {PRESETS.map((p, i) => (
            <button key={p.label} className={`preset-btn${activePreset === p ? ' active' : ''}`} onClick={() => applyPreset(p)} style={{ '--i': i } as React.CSSProperties}>{p.label}</button>
          ))}
        </div>
        {(['work', 'shortBreak', 'longBreak'] as const).map((key, i) => (
          <div key={key} className={`config-row config-${key}`} style={{ '--i': i + 3 } as React.CSSProperties}>
            <label>{key === 'work' ? 'Focus' : key === 'shortBreak' ? 'Short Break' : 'Long Break'}</label>
            <div className="config-input-group">
              <button className="step-btn" onClick={() => step(key, -1)} title="−1 min (Alt+↓)">−</button>
              <input
                type="number" min={1} max={key === 'shortBreak' ? 60 : 120}
                value={customDurations[key]}
                onChange={(e) => setCustomDurations({ ...customDurations, [key]: Number(e.target.value) })}
                className="config-input"
              />
              <button className="step-btn" onClick={() => step(key, 1)} title="+1 min (Alt+↑)">+</button>
              <span className="config-unit">min</span>
              <button className="reset-btn" onClick={() => resetDuration(key)} title="Reset to default (Alt+R)"><ResetIcon /></button>
            </div>
          </div>
        ))}
        <div className="total-focus-time">
          ≈ {Math.floor(totalFocus / 60)}h {totalFocus % 60}m per cycle
        </div>
      </Section>

      <Section key={`appearance-${allOpen}`} title="Appearance" icon={<BrushIcon />} defaultOpen={allOpen}>
        <div className="roundness-row">
          <label>Roundness</label>
          <div className="roundness-value-wrap">
            <RangeSlider
              value={roundness} onChange={setRoundness}
              min={0} max={24}
              showValue formatValue={v => `${v}px`}
            />
          </div>
        </div>

        <div className="roundness-row">
          <label>Opacity</label>
          <div className="roundness-value-wrap">
            <RangeSlider
              value={sidebarOpacity} onChange={setSidebarOpacity}
              min={0.3} max={0.95} step={0.05}
              showValue formatValue={v => `${Math.round(v * 100)}%`}
            />
          </div>
        </div>
      </Section>

      <Section key={`fonts-${allOpen}`} title="Fonts" icon={<AaIcon />} defaultOpen={allOpen}>
        {(['timer', 'ui', 'mono'] as FontCategory[]).map((cat, i) => (
          <div key={cat} className="font-group-row" style={{ '--i': i } as React.CSSProperties}>
            <span className="font-group-label">{cat === 'timer' ? 'Timer' : cat === 'ui' ? 'UI' : 'Mono'}</span>
            <FontPicker
              options={fontOptions[cat]}
              value={fonts[cat]}
              onChange={(idx) => setFont(cat, idx)}
            />
            <SelectDropdown
              value={weights[cat]}
              onChange={v => { setWeight(cat, Number(v)); addToast('info', `${v}`) }}
              options={[100, 200, 300, 400, 500, 600, 700, 800, 900].map(w => ({ value: String(w), label: String(w) }))}
              className="weight-select"
            />
          </div>
        ))}
        <div className="font-scale-row">
          <label>Size</label>
          <div className="font-scale-control">
            <RangeSlider
              value={fontScale} onChange={setFontScale}
              min={0.5} max={2} step={shiftHeld ? 0.01 : 0.1}
              showValue formatValue={v => `${v.toFixed(shiftHeld ? 2 : 1)}×`}
            />
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ---------- Theme Tab ---------- */

function ThemeTab({
  currentTheme, setCurrentTheme, addToast,
}: {
  currentTheme: ThemeKey
  setCurrentTheme: (k: ThemeKey) => void
  addToast: (type: ToastType, msg: string) => void
}) {
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

/* ---------- Wallpaper Tab ---------- */

function WallpaperTab({
  fetchWallpaper, wallpaperLoading, wallpaper, setWallpaper,
  searchQuery, setSearchQuery, doSearch, searchLoading,
  searchError,
  categories, toggleCategory, purity, togglePurity, searchResults,
  loadMore, hasMore, addToast,
}: {
  fetchWallpaper: () => void
  wallpaperLoading: boolean
  wallpaper: string
  setWallpaper: (v: string) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  doSearch: (sorting?: string) => void
  searchLoading: boolean
  searchError: string
  categories: string
  toggleCategory: (i: number) => void
  purity: string
  togglePurity: (i: number) => void
  searchResults: Array<{ id: string; thumb: string; full: string }>
  loadMore: () => void
  hasMore: boolean
  addToast: (type: ToastType, msg: string) => void
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState('relevance')
  const [loadThreshold, setLoadThreshold] = useState(200)

  const handleSetWallpaper = (url: string) => {
    setWallpaper(url)
    addToast('success', 'Wallpaper set')
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !searchLoading) {
          loadMore()
        }
      },
      { rootMargin: `${loadThreshold}px` }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, searchLoading, loadMore, loadThreshold])

  const handleSearch = () => doSearch(sorting)

  return (
    <div className="wallpaper-body">
      <div className="wallpaper-actions-bar">
        <button
          className="wallpaper-btn"
          onClick={fetchWallpaper}
          disabled={wallpaperLoading}
        >
          <ShimmerIcon />
          {wallpaperLoading ? 'Loading...' : 'Random'}
        </button>
        <RemoveWallpaperBtn visible={!!wallpaper} onRemove={() => { setWallpaper(''); addToast('info', 'Wallpaper removed') }} />
      </div>

      <div className="search-row">
        <input
          className="search-input"
          placeholder="Search wallpapers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <SelectDropdown
          value={sorting}
          onChange={setSorting}
          options={[
            { value: 'relevance', label: 'Relevance' },
            { value: 'date_added', label: 'Newest' },
            { value: 'random', label: 'Random' },
            { value: 'views', label: 'Top viewed' },
            { value: 'favorites', label: 'Top faved' },
            { value: 'toplist', label: 'Top list' },
          ]}
          className="sorting-select"
        />
        <button
          className="search-btn"
          onClick={handleSearch}
          disabled={searchLoading}
        >
          <SearchIcon />
        </button>
      </div>

      <div className="sidebar-section-title" style={{ marginBottom: '0.5rem' }}>Categories</div>
      <div className="cat-toggles">
        {['General', 'Anime', 'People'].map((label, i) => (
          <button
            key={label}
            className={`cat-toggle${categories[i] === '1' ? ' on' : ' off'}`}
            onClick={() => toggleCategory(i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sidebar-section-title" style={{ marginBottom: '0.5rem' }}>Purity</div>
      <div className="purity-toggles">
        {['SFW', 'Sketchy', 'NSFW'].map((label, i) => (
          <button
            key={label}
            className={`purity-toggle${purity[i] === '1' ? ' on' : ' off'}`}
            onClick={() => togglePurity(i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="sidebar-section-title" style={{ marginBottom: '0.5rem', marginTop: '0.25rem' }}>
        Auto-load threshold
        <span className="threshold-value">{loadThreshold}px</span>
      </div>
      <RangeSlider
        value={loadThreshold} onChange={setLoadThreshold}
        min={100} max={800} step={50}
      />

      <div className="sidebar-divider" />

      {searchError && <div className="wallpaper-error">{searchError}</div>}

      {searchResults.length > 0 && (
        <div>
          <div className="result-count">{searchResults.length} results</div>
          <div className="results-grid">
            {searchResults.map((r, i) => (
              <div
                key={r.id}
                className={`result-thumb${r.full === wallpaper ? ' selected' : ''}`}
                style={{ backgroundImage: `url(${r.thumb})`, '--i': i } as React.CSSProperties}
                onClick={() => handleSetWallpaper(r.full)}
                title="Set as wallpaper"
              >
                <span className="result-source">wallhaven</span>
              </div>
            ))}
            {searchLoading && (
              <>
                {[1, 2, 3, 4].map(i => (
                  <div key={`skeleton-${i}`} className="result-thumb result-skeleton" style={{ '--i': i } as React.CSSProperties} />
                ))}
              </>
            )}
            {hasMore && (
              <button
                className="load-more-btn"
                onClick={loadMore}
                disabled={searchLoading}
              >
                {searchLoading ? 'Loading…' : 'Load more'}
              </button>
            )}
            <div ref={sentinelRef} style={{ height: 1 }} />
          </div>
        </div>
      )}
      {searchResults.length === 0 && searchLoading && (
        <div className="results-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={`skeleton-init-${i}`} className="result-thumb result-skeleton" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      )}
      {searchResults.length === 0 && !searchLoading && !searchError && (
        <div className="results-empty">
          <SearchIcon />
          <span>Search for wallpapers above</span>
        </div>
      )}
    </div>
  )
}

function RemoveWallpaperBtn({ visible, onRemove }: { visible: boolean; onRemove: () => void }) {
  const { mounted, visible: animVisible } = useMountTransition(visible, 150)

  if (!mounted) return null

  return (
    <button
      className={`remove-thumb-btn${animVisible ? ' entering' : ''}`}
      onClick={onRemove}
      title="Remove wallpaper"
    >
      <TrashIcon />
    </button>
  )
}
