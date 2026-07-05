'use client'

import { useState, useCallback, useRef, useMemo, memo } from 'react'
import { useUIContext, useTimerContext } from '@/providers/AppProviders'
import { useFullscreen } from '@/hooks/useFullscreen'
import { GearIcon, CloseIcon, ExpandIcon, CompressIcon } from '@/components/icons'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ConfirmTabModal } from '@/components/ui/ConfirmTabModal'
import { Sidebar } from '@/components/layout/Sidebar'
import { TimerTab } from '@/components/settings/TimerTab'
import { ThemeTab } from '@/components/settings/ThemeTab'
import { WallpaperTab } from '@/components/settings/WallpaperTab'
import type { TabId } from '@/lib/types'

function PendingTabModal({ pendingTab, onDone }: {
  pendingTab: TabId
  onDone: () => void
}) {
  const { state, dispatch } = useTimerContext()
  const { setActiveTab } = useUIContext()

  return (
    <ConfirmTabModal
      timeLeft={state.timeLeft}
      phase={state.phase}
      onReset={() => { dispatch({ type: 'RESET' }); setActiveTab(pendingTab); onDone() }}
      onAccept={() => { setActiveTab(pendingTab); onDone() }}
      onReject={onDone}
    />
  )
}

const GearToggle = memo(function GearToggle() {
  const { settingsOpen, setSettingsOpen } = useUIContext()
  return (
    <button
      className="toolbar-btn"
      style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: settingsOpen ? 50 : 20 }}
      onClick={() => setSettingsOpen(!settingsOpen)}
      title={settingsOpen ? 'Close (Esc)' : 'Settings'}
    >
      {settingsOpen ? <CloseIcon /> : <GearIcon />}
    </button>
  )
})

const FullscreenToggle = memo(function FullscreenToggle() {
  const { isFullscreen, toggleFullscreen } = useFullscreen()
  const { settingsOpen } = useUIContext()
  if (settingsOpen) return null
  return (
    <button
      className="toolbar-btn"
      style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 20 }}
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
    >
      {isFullscreen ? <CompressIcon /> : <ExpandIcon />}
    </button>
  )
})

export function SettingsPanel() {
  const { settingsOpen, setSettingsOpen, activeTab, setActiveTab } = useUIContext()
  const { state } = useTimerContext()
  const runningRef = useRef(false)
  runningRef.current = state.running
  const [pendingTab, setPendingTab] = useState<TabId | null>(null)

  const handleSetActiveTab = useCallback((tab: TabId) => {
    if (runningRef.current && tab !== activeTab) {
      setPendingTab(tab)
    } else {
      setActiveTab(tab)
    }
  }, [activeTab, setActiveTab])

  const onClose = useCallback(() => setSettingsOpen(false), [setSettingsOpen])
  const onDone = useCallback(() => setPendingTab(null), [])

  const tabContent = useMemo(() => ({
    timer: <ErrorBoundary key="timer"><TimerTab /></ErrorBoundary>,
    theme: <ErrorBoundary key="theme"><ThemeTab /></ErrorBoundary>,
    wallpaper: <ErrorBoundary key="wallpaper"><WallpaperTab /></ErrorBoundary>,
  }), [])

  return (
    <>
      {pendingTab && (
        <PendingTabModal pendingTab={pendingTab} onDone={onDone} />
      )}
      <GearToggle />
      <FullscreenToggle />
      <Sidebar
        open={settingsOpen}
        onClose={onClose}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
      >
        {tabContent[activeTab]}
      </Sidebar>
    </>
  )
}
