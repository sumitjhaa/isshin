'use client'

import '@/components/layout/PageLayout.css'
import { memo } from 'react'
import { AppProviders, useUIContext, useWallpaperContext } from '@/providers/AppProviders'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { TimerDisplay } from '@/components/main/TimerDisplay'
import { SettingsPanel } from '@/components/layout/SettingsPanel'

const MainContent = memo(function MainContent() {
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
        <SettingsPanel />
      </ErrorBoundary>
    </div>
  )
})

function PageShell() {
  const { currentTheme, theme, sidebarRgb, currentFonts, weights, sizes, roundness, sidebarOpacity } = useUIContext()

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
