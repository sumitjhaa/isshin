'use client'

import { useState, useCallback, useRef } from 'react'
import type { WallpaperResult } from '@/lib/types'

export function useWallpaper() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState('111')
  const [purity, setPurity] = useState('100')
  const [searchResults, setSearchResults] = useState<WallpaperResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [wallpaper, setWallpaper] = useState('')
  const [wallpaperLoading, setWallpaperLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchError, setSearchError] = useState('')
  const [wallpaperError, setWallpaperError] = useState('')
  const lastSorting = useRef('relevance')

  const toggleCategory = (idx: number) => {
    const arr = categories.split('')
    arr[idx] = arr[idx] === '1' ? '0' : '1'
    const next = arr.join('')
    if (next !== '000') setCategories(next)
  }

  const togglePurity = (idx: number) => {
    const arr = purity.split('')
    arr[idx] = arr[idx] === '1' ? '0' : '1'
    const next = arr.join('')
    if (next !== '000') setPurity(next)
  }

  const doSearch = useCallback(async (sorting = 'relevance') => {
    lastSorting.current = sorting
    setSearchLoading(true)
    setSearchError('')
    setPage(1)
    try {
      const params = new URLSearchParams({ q: searchQuery, categories, purity, sorting, page: '1' })
      const res = await fetch(`/api/wallhaven?${params}`)
      if (!res.ok) {
        setSearchError(`API error (${res.status}) — try again later`)
        setSearchResults([])
        setHasMore(false)
        return
      }
      const json = await res.json()
      if (json.error) {
        setSearchError(json.error)
        setSearchResults([])
        setHasMore(false)
      } else if (json.data) {
        setSearchResults(
          json.data.map((d: { id: string; thumbs: { large: string }; path: string }) => ({
            id: d.id,
            thumb: d.thumbs.large,
            full: d.path,
          }))
        )
        setHasMore(json.data.length >= 24)
        if (json.data.length === 0) setSearchError('No results — try different terms or filters')
      }
    } catch {
      setSearchError('Network error — check your connection')
      setSearchResults([])
      setHasMore(false)
    }
    setSearchLoading(false)
  }, [searchQuery, categories, purity])

  const loadMore = useCallback(async () => {
    if (searchLoading || !hasMore) return
    setSearchLoading(true)
    setSearchError('')
    const nextPage = page + 1
    try {
      const params = new URLSearchParams({ q: searchQuery, categories, purity, sorting: lastSorting.current, page: String(nextPage) })
      const res = await fetch(`/api/wallhaven?${params}`)
      if (!res.ok) {
        setSearchError(`API error (${res.status})`)
        setSearchLoading(false)
        return
      }
      const json = await res.json()
      if (json.data) {
        setSearchResults(prev => [
          ...prev,
          ...json.data.map((d: { id: string; thumbs: { large: string }; path: string }) => ({
            id: d.id,
            thumb: d.thumbs.large,
            full: d.path,
          })),
        ])
        setPage(nextPage)
        setHasMore(json.data.length >= 24)
      }
    } catch {
      setSearchError('Network error loading more')
    }
    setSearchLoading(false)
  }, [searchLoading, hasMore, page, searchQuery, categories, purity])

  const fetchWallpaper = useCallback(async () => {
    setWallpaperLoading(true)
    setWallpaperError('')
    const q = searchQuery || 'landscape'
    const params = new URLSearchParams({ q, categories, purity, sorting: 'random', page: '1' })
    try {
      const res = await fetch(`/api/wallhaven?${params}`)
      if (!res.ok) {
        setWallpaperError(`API error (${res.status})`)
        setWallpaperLoading(false)
        return
      }
      const json = await res.json()
      if (json.data?.[0]) {
        const url = json.data[0].path
        const img = new Image()
        img.onload = () => { setWallpaper(url); setWallpaperLoading(false) }
        img.onerror = () => { setWallpaperError('Failed to load image'); setWallpaperLoading(false) }
        img.src = url
      } else {
        setWallpaperError('No random wallpaper found — try different filters')
        setWallpaperLoading(false)
      }
    } catch {
      setWallpaperError('Network error fetching wallpaper')
      setWallpaperLoading(false)
    }
  }, [searchQuery, categories, purity])

  return {
    searchQuery, setSearchQuery,
    categories, toggleCategory,
    purity, togglePurity,
    searchResults,
    searchLoading, doSearch,
    searchError,
    wallpaper, setWallpaper,
    wallpaperLoading, fetchWallpaper,
    wallpaperError,
    loadMore, hasMore,
  }
}
