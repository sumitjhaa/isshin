'use client'
import './Sidebar.css'

import { useEffect, useRef } from 'react'
import { useMountTransition } from '@/hooks/useMountTransition'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { TabBar } from './TabBar'
import type { TabId } from '@/lib/types'

function saveScroll(el: HTMLDivElement | null, tab: TabId) {
  if (el) el.dataset[`scroll${tab}`] = String(el.scrollTop)
}

function getScroll(el: HTMLDivElement | null, tab: TabId): number {
  if (!el) return 0
  return Number(el.dataset[`scroll${tab}`] || '0')
}

export function Sidebar({
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
  const prevVisibleRef = useRef(false)

  useEffect(() => {
    if (!visible || !bodyRef.current) return
    bodyRef.current.scrollTop = getScroll(bodyRef.current, activeTab)
    prevTabRef.current = activeTab
  }, [activeTab, visible])

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    if (prevVisibleRef.current && !visible) {
      saveScroll(el, prevTabRef.current)
    }
    prevVisibleRef.current = visible
  }, [visible])

  useEscapeKey(onClose, mounted)

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
