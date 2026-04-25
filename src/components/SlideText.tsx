import React from 'react'
import type { Song, Scripture } from '../types'

interface Props {
  song?: Song | null
  scripture?: Scripture | null
  slideId?: string | null
  showReference?: boolean
  className?: string
}

export default function SlideText({ song, scripture, slideId, showReference = true, className = '' }: Props) {
  if (scripture) {
    return (
      <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
        <p className="text-4xl md:text-6xl font-bold leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>
          {scripture.text}
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
    return (
      <div className={`flex flex-col items-center justify-center text-center px-8 ${className}`}>
        <p className="text-4xl md:text-6xl font-bold leading-tight whitespace-pre-line" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.9)', color: song.textColor }}>
          {slide.text}
        </p>
        {showReference && (
          <p className="mt-4 text-lg md:text-xl opacity-60">{song.title} — {slide.label}</p>
        )}
      </div>
    )
  }

  return null
}
