'use client'

import '@/components/layout/PageLayout.css'
import { useEffect } from 'react'
import { AppProviders, useUIContext, useWallpaperContext } from '@/providers/AppProviders'
import { useFullscreen } from '@/hooks/useFullscreen'
import { useToast } from '@/providers/ToastProvider'
import { GearIcon, CloseIcon, ExpandIcon, CompressIcon } from '@/components/icons'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { Sidebar } from '@/components/layout/Sidebar'
import { TimerDisplay } from '@/components/main/TimerDisplay'
import { TimerTab } from '@/components/settings/TimerTab'
import { ThemeTab } from '@/components/settings/ThemeTab'
import { WallpaperTab } from '@/components/settings/WallpaperTab'

function MainContent() {
  const { wallpaper } = useWallpaperContext()

  return (
    <div
      className={`page${wallpaper ? ' has-wallpaper' : ''}`}
      style={{
        backgroundImage: wallpaper ? `url(${wallpaper})` : undefined,
      } as React.CSSProperties}
    >
      {wallpaper && (
        <div
          className="wallpaper-overlay"
          style={{ backgroundColor: 'var(--background)', opacity: 0.6 }}
        />
      )}

      <ErrorBoundary>
        <TimerDisplay />
      </ErrorBoundary>

      <ErrorBoundary>
        <SettingsControls />
      </ErrorBoundary>
    </div>
  )
}

function SettingsControls() {
  const { settingsOpen, setSettingsOpen, activeTab, setActiveTab } = useUIContext()
  const { isFullscreen, toggleFullscreen } = useFullscreen()

  return (
    <>
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

      <Sidebar
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {activeTab === 'timer' && (
          <ErrorBoundary>
            <TimerTab />
          </ErrorBoundary>
        )}
        {activeTab === 'theme' && (
          <ErrorBoundary>
            <ThemeTab />
          </ErrorBoundary>
        )}
        {activeTab === 'wallpaper' && (
          <ErrorBoundary>
            <WallpaperTab />
          </ErrorBoundary>
        )}
      </Sidebar>
    </>
  )
}

function PageShell() {
  const { currentTheme, theme, sidebarRgb, currentFonts, weights, sizes, roundness, sidebarOpacity } = useUIContext()

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', currentTheme)
    root.style.setProperty('--roundness', `${roundness}px`)
    root.style.setProperty('--surface', theme.surface)
  }, [currentTheme, roundness, theme.surface])

  return (
    <div
      data-theme={currentTheme}
      style={{
        '--roundness': `${roundness}px`,
        '--surface': theme.surface,
        '--sidebar-bg': `${sidebarRgb.r}, ${sidebarRgb.g}, ${sidebarRgb.b}`,
        '--sidebar-opacity': String(sidebarOpacity),
        '--font-timer': currentFonts.timer.value,
        '--font-ui': currentFonts.ui.value,
        '--font-mono': currentFonts.mono.value,
        '--weight-timer': String(weights.timer),
        '--weight-ui': String(weights.ui),
        '--weight-mono': String(weights.mono),
        '--size-timer': `${sizes.timer}rem`,
        '--size-ui': `${sizes.ui}rem`,
        '--size-mono': `${sizes.mono}rem`,
      } as React.CSSProperties}
    >
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
    </div>
  )
}

export default function Page() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <PageShell />
      </AppProviders>
    </ErrorBoundary>
  )
}
