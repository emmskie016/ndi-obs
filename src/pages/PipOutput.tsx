import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../store'
import SlideText from '../components/SlideText'
import { useLiveState } from '../hooks/useLiveState'

export default function PipOutput() {
  useLiveState()
  const [params] = useSearchParams()
  const transparent = params.get('bg') === 'transparent'
  const { activeItemId, activeSlideId, isBlanked, showReference, pipLayout, pipPosition, songs, scriptures } = useStore()

  useEffect(() => {
    document.title = 'SlideLive PiP'
    if (transparent) document.body.style.background = 'transparent'
  }, [transparent])

  const song = songs.find((s) => s.id === activeItemId) ?? null
  const scripture = scriptures.find((s) => s.id === activeItemId) ?? null
  const hasContent = (song && activeSlideId) || scripture

  if (isBlanked || !hasContent) return <div className="w-screen h-screen" style={{ background: transparent ? 'transparent' : '#000' }} />

  const posClass: Record<string, string> = {
    'bottom-left': 'bottom-8 left-8',
    'bottom-right': 'bottom-8 right-8',
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
  }

  if (pipLayout === 'lower-third') {
    return (
      <div className="w-screen h-screen relative" style={{ background: transparent ? 'transparent' : 'transparent' }}>
        <div className="absolute bottom-0 left-0 right-0 px-12 py-8"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)' }}>
          <SlideText song={song} scripture={scripture} slideId={activeSlideId} showReference={showReference} className="text-left items-start" />
        </div>
      </div>
    )
  }

  if (pipLayout === 'pip-box') {
    return (
      <div className="w-screen h-screen relative" style={{ background: transparent ? 'transparent' : 'transparent' }}>
        <div className={`absolute ${posClass[pipPosition]} w-[640px] rounded-xl overflow-hidden`}
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}>
          <SlideText song={song} scripture={scripture} slideId={activeSlideId} showReference={showReference} className="p-6" />
        </div>
      </div>
    )
  }

  // full-overlay
  return (
    <div className="w-screen h-screen flex items-center justify-center" style={{ background: transparent ? 'transparent' : 'transparent' }}>
      <SlideText song={song} scripture={scripture} slideId={activeSlideId} showReference={showReference} className="w-full h-full" />
    </div>
  )
}
