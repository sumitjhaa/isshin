'use client'
import './TabBar.css'

import { ClockIcon, PaletteIcon, ImageIcon } from '@/components/icons'
import type { TabId } from '@/lib/types'

export function TabBar({ activeTab, setActiveTab }: { activeTab: TabId; setActiveTab: (t: TabId) => void }) {
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
