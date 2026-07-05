'use client'
import './TimerTab.css'

import { useEffect, useState, useMemo } from 'react'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Dropdown } from '@/components/ui/Dropdown'
import { FontPicker } from '@/components/ui/FontPicker'
import { Section } from '@/components/layout/Section'
import { ClockIcon, BrushIcon, AaIcon, ResetIcon } from '@/components/icons'
import { useUIContext } from '@/providers/AppProviders'
import { useTimerContext } from '@/providers/AppProviders'
import { useToast } from '@/providers/ToastProvider'
import type { FontCategory } from '@/lib/types'

const DEFAULTS = { work: 25, shortBreak: 5, longBreak: 15 }
const PRESETS = [
  { label: 'Pomodoro', work: 25, shortBreak: 5, longBreak: 15 },
  { label: 'Short', work: 15, shortBreak: 3, longBreak: 10 },
  { label: 'Long', work: 50, shortBreak: 10, longBreak: 20 },
]
const WEIGHT_OPTIONS = [100, 200, 300, 400, 500, 600, 700, 800, 900]

export function TimerTab() {
  const { customDurations, setCustomDurations, saveSettings } = useTimerContext()
  const { fonts, setFont, weights, setWeight, fontScale, setFontScale, roundness, setRoundness, sidebarOpacity, setSidebarOpacity, fontOptions } = useUIContext()
  const { addToast } = useToast()

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

      <Section key={`fonts-${allOpen}`} title="Fonts" icon={<AaIcon />} defaultOpen={allOpen}>
        {(['timer', 'ui'] as FontCategory[]).map((cat, i) => (
          <div key={cat} className="font-group-row" style={{ '--i': i } as React.CSSProperties}>
            <span className="font-group-label">{cat === 'timer' ? 'Timer' : 'UI'}</span>
            <FontPicker
              options={fontOptions[cat]}
              value={fonts[cat]}
              onChange={(idx) => setFont(cat, idx)}
            />
            <Dropdown
              value={String(weights[cat])}
              onChange={v => { setWeight(cat, Number(v)); addToast('info', `${v}`) }}
              items={WEIGHT_OPTIONS.map(w => ({ value: String(w), label: String(w) }))}
              className="weight-select"
            />
          </div>
        ))}
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

        <div className="roundness-row">
          <label>Size</label>
          <div className="roundness-value-wrap">
            <RangeSlider
              value={fontScale}
              onChange={setFontScale}
              min={0.5} max={2} step={0.1}
              showValue formatValue={v => `${v.toFixed(1)}×`}
            />
          </div>
        </div>
      </Section>

      <Section key={`durations-${allOpen}`} title="Durations" icon={<ClockIcon />} defaultOpen={allOpen}>
        <div className="presets-row">
          <span className="roundness-row-label">Preset</span>
          <div className="preset-toggle">
            {PRESETS.map(p => (
              <button key={p.label} className={`preset-toggle-btn${activePreset === p ? ' active' : ''}`} onClick={() => applyPreset(p)}>{p.label}</button>
            ))}
          </div>
          <span className="total-focus-time">≈ {Math.floor(totalFocus / 60)}h {totalFocus % 60}m per cycle</span>
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
      </Section>
    </div>
  )
}
