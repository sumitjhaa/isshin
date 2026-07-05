'use client'
import './RangeSlider.css'

export function RangeSlider({ value, onChange, min, max, step, className, showValue, formatValue }: {
  value: number; onChange: (v: number) => void; min: number; max: number; step?: number; className?: string
  showValue?: boolean; formatValue?: (v: number) => string
}) {
  const pct = min < max ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div className={`range-slider${className ? ` ${className}` : ''}`}>
      <input
        type="range" min={min} max={max} step={step ?? 1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="range-slider-input"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
      {showValue && (
        <span className="range-slider-value">{formatValue ? formatValue(value) : String(value)}</span>
      )}
    </div>
  )
}
