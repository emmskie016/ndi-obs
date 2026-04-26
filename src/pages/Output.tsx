import React, { useEffect } from 'react'
import { useStore } from '../store'
import { useLiveState } from '../hooks/useLiveState'

export default function Output() {
  useLiveState()
  const { liveSlide, isBlanked } = useStore()

  useEffect(() => { document.title = 'SlideLive Output' }, [])

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ background: isBlanked ? '#000' : (liveSlide?.background ?? '#000') }}
    >
      {!isBlanked && liveSlide && (
        <p
          className="text-center font-bold leading-tight whitespace-pre-line px-12"
          style={{
            color: liveSlide.textColor,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {liveSlide.text}
        </p>
      )}
    </div>
  )
}
