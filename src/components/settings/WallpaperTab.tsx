'use client'
import './WallpaperTab.css'

import { useEffect, useRef, useState } from 'react'
import { ShimmerIcon, TrashIcon, SearchIcon } from '@/components/icons'
import { RangeSlider } from '@/components/ui/RangeSlider'
import { Dropdown } from '@/components/ui/Dropdown'
import { useMountTransition } from '@/hooks/useMountTransition'
import { useWallpaperContext } from '@/providers/AppProviders'
import { useToast } from '@/providers/ToastProvider'

export function WallpaperTab() {
  const {
    fetchWallpaper, wallpaperLoading, wallpaper, setWallpaper,
    searchQuery, setSearchQuery, doSearch, searchLoading,
    searchError,
    categories, toggleCategory, purity, togglePurity, searchResults,
    loadMore, hasMore,
  } = useWallpaperContext()
  const { addToast } = useToast()
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
        <Dropdown
          value={sorting}
          onChange={setSorting}
          items={[
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
