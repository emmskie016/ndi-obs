import React, { useEffect } from 'react'
import { useStore } from '../store'
import SlideText from '../components/SlideText'
import { useLiveState } from '../hooks/useLiveState'

export default function Output() {
  useLiveState()
  const { activeItemId, activeSlideId, isBlanked, songs, scriptures } = useStore()

  useEffect(() => {
    document.title = 'SlideLive Output'
  }, [])

  const song = songs.find((s) => s.id === activeItemId) ?? null
  const scripture = scriptures.find((s) => s.id === activeItemId) ?? null
  const bg = song ? song.background : '#000000'

  return (
    <div
      className="w-screen h-screen flex items-center justify-center overflow-hidden"
      style={{ background: isBlanked ? '#000000' : bg }}
    >
      {!isBlanked && (
        <SlideText
          song={song}
          scripture={scripture}
          slideId={activeSlideId}
          showReference={false}
          maxLines={2}
          className="w-full h-full"
        />
      )}
    </div>
  )
}
