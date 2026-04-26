import React from 'react'
import type { Song, Scripture } from '../types'

interface Props {
  song?: Song | null
  scripture?: Scripture | null
  slideId?: string | null
  showReference?: boolean
  className?: string
  maxLines?: number  // enforce max lines on output — undefined = no limit
}

function clampLines(text: string, max: number): string {
  const lines = text.split('\n').filter((l) => l.trim() !== '')
  return lines.slice(0, max).join('\n')
}

export default function SlideText({ song, scripture, slideId, showReference = true, className = '', maxLines }: Props) {
  if (scripture) {
    const words = scripture.text.split(' ')
    // For scripture, split into 2 display lines by word count
    const displayText = maxLines
      ? (() => {
          const mid = Math.ceil(words.length / 2)
          const line1 = words.slice(0, mid).join(' ')
          const line2 = words.slice(mid).join(' ')
          return [line1, line2].filter(Boolean).join('\n')
        })()
      : scripture.text

    return (
      <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
        <p className="text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
          {displayText}
        </p>
        {showReference && (
          <p className="mt-4 text-xl md:text-2xl opacity-75">{scripture.displayLabel}</p>
        )}
      </div>
    )
  }

  if (song && slideId) {
    const slide = song.slides.find((s) => s.id === slideId)
    if (!slide) return null
    if (slide.type === 'blank') return null

    const displayText = maxLines ? clampLines(slide.text, maxLines) : slide.text

    return (
      <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
        <p
          className="text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)', color: song.textColor }}
        >
          {displayText}
        </p>
        {showReference && (
          <p className="mt-4 text-lg md:text-xl opacity-60">{song.title} — {slide.label}</p>
        )}
      </div>
    )
  }

  return null
}
