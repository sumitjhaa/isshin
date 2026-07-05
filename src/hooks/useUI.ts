'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { hexToRgb } from '@/lib/color'
import type { ThemeKey } from '@/data/themes'
import { THEMES } from '@/data/themes'
import type { TabId, FontCategory, FontOption } from '@/lib/types'
import FONTS from '@/data/fonts'

function buildOptions(cat: FontCategory): FontOption[] {
  if (cat === 'timer') {
    return [
      { name: 'Caskaydia Mono Nerd Font', value: "'Caskaydia Mono Nerd Font', monospace", google: null },
      ...FONTS.filter(f => f.category === 'monospace').map(f => ({
        name: f.name,
        value: `'${f.name}', monospace`,
        google: f.google,
      })),
    ]
  }
  if (cat === 'mono') {
    return FONTS.filter(f => f.category === 'monospace').map(f => ({
      name: f.name,
      value: `'${f.name}', monospace`,
      google: f.google,
    }))
  }
  return [
    { name: 'Inter', value: "'Inter', sans-serif", google: 'Inter' },
    ...FONTS.filter(f => f.category === 'sans-serif' || f.category === 'serif').map(f => ({
      name: f.name,
      value: `'${f.name}', sans-serif`,
      google: f.google,
    })),
  ]
}

const FONT_OPTIONS: Record<FontCategory, FontOption[]> = {
  timer: buildOptions('timer'),
  ui: buildOptions('ui'),
  mono: buildOptions('mono'),
}

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900]
const BASE_SIZES = { timer: 10, ui: 0.875, mono: 0.8125 }

const WEIGHT_LABELS: Record<number, string> = {
  100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Normal',
  500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black',
}

function loadGoogleFont(family: string, weight: number) {
  if (!family || document.getElementById(`gf-${family}-${weight}`)) return
  const link = document.createElement('link')
  link.id = `gf-${family}-${weight}`
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`
  document.head.appendChild(link)
}

export function useUI() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId>('timer')
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'catppuccin'
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'catppuccin-latte' : 'catppuccin'
  })
  const [roundness, setRoundness] = useState(8)
  const [fonts, setFonts] = useState({ timer: 0, ui: 0, mono: 0 })
  const [weights, setWeights] = useState({ timer: 600, ui: 500, mono: 400 })
  const [fontScale, setFontScale] = useState(1)
  const [sidebarOpacity, setSidebarOpacity] = useState(0.65)

  const theme = THEMES[currentTheme]
  const sidebarRgb = useMemo(() => hexToRgb(theme.surface), [theme.surface])

  const currentFonts = {
    timer: FONT_OPTIONS.timer[fonts.timer] || FONT_OPTIONS.timer[0],
    ui: FONT_OPTIONS.ui[fonts.ui] || FONT_OPTIONS.ui[0],
    mono: FONT_OPTIONS.mono[fonts.mono] || FONT_OPTIONS.mono[0],
  }

  const setFont = useCallback((cat: FontCategory, idx: number) => {
    setFonts(prev => ({ ...prev, [cat]: idx }))
  }, [])

  const setWeight = useCallback((cat: FontCategory, w: number) => {
    setWeights(prev => ({ ...prev, [cat]: w }))
  }, [])

  const computedSizes = {
    timer: BASE_SIZES.timer * fontScale,
    ui: BASE_SIZES.ui * fontScale,
    mono: BASE_SIZES.mono * fontScale,
  }

  useEffect(() => {
    for (const cat of ['timer', 'ui', 'mono'] as FontCategory[]) {
      const opt = FONT_OPTIONS[cat][fonts[cat]]
      if (opt.google) loadGoogleFont(opt.google, weights[cat])
    }
  }, [fonts, weights])

  return useMemo(() => ({
    settingsOpen, setSettingsOpen,
    activeTab, setActiveTab,
    currentTheme, setCurrentTheme,
    roundness, setRoundness,
    theme, sidebarRgb,
    fonts, setFont,
    weights, setWeight,
    fontScale, setFontScale,
    sizes: computedSizes,
    sidebarOpacity, setSidebarOpacity,
    currentFonts,
    fontOptions: FONT_OPTIONS,
    weightOptions: WEIGHTS,
    weightLabels: WEIGHT_LABELS,
  }), [settingsOpen, activeTab, currentTheme, roundness, fonts, weights, fontScale, sidebarOpacity, setFont, setWeight])
}
