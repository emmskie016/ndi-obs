import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store'
import { useLiveState } from '../hooks/useLiveState'

export default function PipOutput() {
  useLiveState()
  const [params] = useSearchParams()
  const transparent = params.get('bg') === 'transparent'
  const { liveSlide, isBlanked, showReference, pipLayout, pipPosition } = useStore()

  useEffect(() => {
    document.title = 'SlideLive PiP'
    if (transparent) document.body.style.background = 'transparent'
  }, [transparent])

  const empty = <div className="w-screen h-screen" style={{ background: 'transparent' }} />

  if (isBlanked || !liveSlide) return empty

  const textStyle: React.CSSProperties = {
    color: liveSlide.textColor,
    textShadow: '0 2px 12px rgba(0,0,0,0.9)',
    fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
    fontWeight: 700,
    lineHeight: 1.3,
    whiteSpace: 'pre-line',
  }

  const posClass: Record<string, string> = {
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
  }

  const refEl = showReference && liveSlide.reference && (
    <p style={{ color: liveSlide.textColor, opacity: 0.7, fontSize: '1rem', marginTop: '0.5rem' }}>
      {liveSlide.reference}
    </p>
  )

  if (pipLayout === 'lower-third') {
    return (
      <div className="w-screen h-screen relative" style={{ background: 'transparent' }}>
        <div
          className="absolute bottom-0 left-0 right-0 px-12 py-8"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)' }}
        >
          <p style={textStyle}>{liveSlide.text}</p>
          {refEl}
        </div>
      </div>
    )
  }

  if (pipLayout === 'pip-box') {
    return (
      <div className="w-screen h-screen relative" style={{ background: 'transparent' }}>
        <div
          className={`absolute ${posClass[pipPosition]} rounded-xl p-6`}
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)', maxWidth: '640px' }}
        >
          <p style={textStyle}>{liveSlide.text}</p>
          {refEl}
        </div>
      </div>
    )
  }

  // full-overlay
  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: 'transparent' }}>
      <div className="text-center px-16">
        <p style={textStyle}>{liveSlide.text}</p>
        {refEl}
      </div>
    </div>
  )
}
