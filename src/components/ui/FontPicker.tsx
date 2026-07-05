'use client'

import type { FontOption } from '@/lib/types'
import { Dropdown } from './Dropdown'

export function FontPicker({ options, value, onChange }: {
  options: FontOption[]
  value: number
  onChange: (idx: number) => void
}) {
  const items = options.map((o, i) => ({ value: String(i), label: o.name, style: { fontFamily: o.value } as React.CSSProperties }))
  return <Dropdown items={items} value={String(value)} onChange={v => onChange(Number(v))} search />
}
