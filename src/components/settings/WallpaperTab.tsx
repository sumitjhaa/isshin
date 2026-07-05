'use client'
import './WallpaperTab.css'

import { useEffect, useRef, useState } from 'react'
import { DiceIcon, TrashIcon, SearchIcon, InfoIcon, WarningIcon, ErrorIcon, ChevronDownIcon } from '@/components/icons'
import { Dropdown } from '@/components/ui/Dropdown'
import { ColorPicker } from '@/components/ui/ColorPicker'
import { useWallpaperContext } from '@/providers/AppProviders'
import { useToast } from '@/providers/ToastProvider'
import { RESOLUTIONS, RATIOS, TOP_RANGES, ORDER_OPTIONS } from '@/data/wallhaven'

export function WallpaperTab() {
  const {
    fetchWallpaper, wallpaperLoading, wallpaper, setWallpaper,
    searchQuery, setSearchQuery, doSearch, searchLoading,
    searchError,
    categories, toggleCategory, purity, togglePurity, searchResults,
    clearAll, loadMore, hasMore,
    atleast, setAtleast,
    ratios, setRatios,
    topRange, setTopRange,
    colors, setColors,
    order, setOrder,
  } = useWallpaperContext()
  const { addToast } = useToast()
  const [sorting, setSorting] = useState('relevance')

  const handleSetWallpaper = (url: string) => {
    setWallpaper(url)
    addToast('success', 'Wallpaper set')
  }

  const mounted = useRef(false)
  useEffect(() => { mounted.current = true }, [])
  useEffect(() => {
    if (!mounted.current) return
    doSearch(sorting)
  }, [categories, purity, sorting, doSearch])

  const handleSearch = () => doSearch(sorting)

  return (
    <div className="wallpaper-body">
      <div className="wp-search-row">
        <button className="wp-random-btn" onClick={fetchWallpaper} disabled={wallpaperLoading}>
          <DiceIcon />
          {wallpaperLoading ? 'Loading...' : 'Random'}
        </button>
        <div className="wp-search-wrap">
          <input
            className="wp-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="wp-search-inner-btn" onClick={handleSearch} disabled={searchLoading} title="Search">
            <SearchIcon />
          </button>
        </div>
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
          className="wp-sort-select"
        />
      </div>

      <div className="wp-toggles-grid">
        {['General', 'Anime', 'People'].map((label, i) => (
          <button
            key={label}
            className={`wp-toggle${categories[i] === '1' ? ' on' : ' off'}`}
            onClick={() => toggleCategory(i)}
          >
            {label}
          </button>
        ))}
        {['SFW', 'Sketchy', 'NSFW'].map((label, i) => (
          <button
            key={label}
            className={`wp-toggle wp-toggle-sm${purity[i] === '1' ? ' on' : ' off'}`}
            onClick={() => togglePurity(i)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="wp-filters-row">
        <Dropdown value={atleast} onChange={setAtleast} items={RESOLUTIONS} className="wp-filter-select" placeholder="Resolution" />
        <Dropdown value={ratios} onChange={setRatios} items={RATIOS} className="wp-filter-select" placeholder="Ratio" />
        <Dropdown value={order} onChange={setOrder} items={ORDER_OPTIONS} className="wp-filter-select" placeholder="Order" />
        <Dropdown value={topRange} onChange={setTopRange} items={TOP_RANGES} className="wp-filter-select" placeholder="Top range" />
        <ColorPicker value={colors} onChange={setColors} />
        {wallpaper && (
          <button className="wp-clear-btn" onClick={() => { clearAll(); addToast('info', 'Cleared') }} title="Clear all">
            <TrashIcon />
          </button>
        )}
      </div>

      {searchResults.length > 0 ? (
        <div>
          <div className="wp-result-count">{searchResults.length} results</div>
          <div className="wp-results-grid">
            {searchResults.map((r, i) => (
              <div
                key={r.id}
                className={`wp-result-thumb${r.full === wallpaper ? ' selected' : ''}`}
                style={{ backgroundImage: `url(${r.thumb})`, '--i': i } as React.CSSProperties}
                onClick={() => handleSetWallpaper(r.full)}
                title="Set as wallpaper"
              >
                <span className="wp-result-source">wallhaven</span>
              </div>
            ))}
            {searchLoading && [1, 2, 3, 4].map(i => (
              <div key={`skeleton-${i}`} className="wp-result-thumb wp-skeleton" style={{ '--i': i } as React.CSSProperties} />
            ))}
            {hasMore && (
              <button className="wp-load-more" onClick={loadMore} disabled={searchLoading}>
                <ChevronDownIcon />
                {searchLoading ? 'Loading…' : 'Load more'}
              </button>
            )}
            </div>
          {searchError && <div className="wallpaper-error">{searchError}</div>}
        </div>
      ) : searchLoading ? (
        <div className="wp-results-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={`skeleton-init-${i}`} className="wp-result-thumb wp-skeleton" style={{ '--i': i } as React.CSSProperties} />
          ))}
        </div>
      ) : (
        <div className="wp-empty">
          {searchError ? (
            <>
              {searchError.includes('No results') ? <InfoIcon /> : searchError.includes('API error') ? <WarningIcon /> : <ErrorIcon />}
              <span>{searchError}</span>
            </>
          ) : (
            <>
              <SearchIcon />
              <span>Search for wallpapers above</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
