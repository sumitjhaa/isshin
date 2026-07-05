'use client'
import './Section.css'

import { useState } from 'react'

export function Section({ title, icon, defaultOpen = false, children }: { title: string; icon?: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
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
