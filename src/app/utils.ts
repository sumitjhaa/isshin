export function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

// relative luminance (0–1); lower = darker
export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const [R, G, B] = [r, g, b].map(c => {
    const s = c / 255
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

// surface = slightly shifted from bg for subtle contrast
export function deriveSurface(bg: string): string {
  const lum = luminance(bg)
  const { r, g, b } = hexToRgb(bg)
  const shift = lum < 0.4 ? 14 : -10 // lighten dark bgs, darken light bgs
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const [R, G, B] = [r, g, b].map(v => clamp(v + shift))
  return `#${R.toString(16).padStart(2, '0')}${G.toString(16).padStart(2, '0')}${B.toString(16).padStart(2, '0')}`
}

// border = balanced mix of bg and text for always-visible edges
export function deriveBorder(bg: string, text: string): string {
  const lum = luminance(bg)
  // for dark bgs tilt toward text, for light bgs tilt toward bg
  const t = lum < 0.4 ? 0.55 : 0.3
  const bh = bg.replace('#', '')
  const th = text.replace('#', '')
  const clamp = (v: number) => Math.round(Math.max(0, Math.min(255, v)))
  const r = clamp(parseInt(bh.slice(0, 2), 16) * (1 - t) + parseInt(th.slice(0, 2), 16) * t)
  const g = clamp(parseInt(bh.slice(2, 4), 16) * (1 - t) + parseInt(th.slice(2, 4), 16) * t)
  const b = clamp(parseInt(bh.slice(4, 6), 16) * (1 - t) + parseInt(th.slice(4, 6), 16) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
