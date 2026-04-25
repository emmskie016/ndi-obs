import React, { useEffect, useCallback } from 'react'
import { useStore } from '../store'
import SlideText from '../components/SlideText'

function SlideThumb({ text, label, active, live, onClick }: {
  text: string; label: string; active: boolean; live: boolean; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg p-3 border-2 transition-all mb-2 ${
        live ? 'border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.6)]' : active ? 'border-gray-500 bg-gray-700' : 'border-gray-700 bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm text-white leading-snug line-clamp-3 whitespace-pre-line">{text}</p>
    </button>
  )
}

export default function Operator() {
  const {
    songs, scriptures, queue, activeItemId, activeSlideId, isBlanked,
    showReference, pipLayout, pipPosition,
    setActiveItem, setActiveSlide, toggleBlank, setBlank,
    setShowReference, setPipLayout, setPipPosition,
    addToQueue, removeFromQueue,
  } = useStore()

  const activeItem = songs.find((s) => s.id === activeItemId) ?? scriptures.find((s) => s.id === activeItemId) ?? null
  const activeSong = songs.find((s) => s.id === activeItemId) ?? null
  const activeScripture = scriptures.find((s) => s.id === activeItemId) ?? null

  const allSlides = activeSong?.slides ?? []
  const activeIndex = allSlides.findIndex((s) => s.id === activeSlideId)

  const goNext = useCallback(() => {
    if (!activeSong) return
    const next = allSlides[activeIndex + 1]
    if (next) setActiveSlide(next.id)
  }, [activeSong, allSlides, activeIndex, setActiveSlide])

  const goPrev = useCallback(() => {
    if (!activeSong) return
    const prev = allSlides[activeIndex - 1]
    if (prev) setActiveSlide(prev.id)
  }, [activeSong, allSlides, activeIndex, setActiveSlide])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext()
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev()
      if (e.key === 'b' || e.key === 'B') toggleBlank()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, toggleBlank])

  const [clock, setClock] = React.useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — Queue */}
        <div className="w-64 shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Service Queue</p>
            <div className="flex gap-1">
              <select
                className="flex-1 text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white"
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return
                  const [kind, id] = e.target.value.split(':')
                  addToQueue({ kind: kind as 'song' | 'scripture', id })
                  e.target.value = ''
                }}
              >
                <option value="">+ Add item…</option>
                <optgroup label="Songs">
                  {songs.map((s) => <option key={s.id} value={`song:${s.id}`}>{s.title}</option>)}
                </optgroup>
                <optgroup label="Scriptures">
                  {scriptures.map((s) => <option key={s.id} value={`scripture:${s.id}`}>{s.displayLabel}</option>)}
                </optgroup>
              </select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {queue.length === 0 && (
              <p className="text-xs text-gray-600 text-center mt-8">Queue is empty</p>
            )}
            {queue.map((item, i) => {
              const label = item.kind === 'song'
                ? songs.find((s) => s.id === item.id)?.title ?? '?'
                : scriptures.find((s) => s.id === item.id)?.displayLabel ?? '?'
              const isActive = item.id === activeItemId
              return (
                <div key={i} className={`flex items-center gap-1 mb-1 rounded p-2 cursor-pointer ${isActive ? 'bg-orange-900/40 border border-orange-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                  onClick={() => {
                    setActiveItem(item.id)
                    if (item.kind === 'song') {
                      const s = songs.find((x) => x.id === item.id)
                      if (s?.slides[0]) setActiveSlide(s.slides[0].id)
                    } else {
                      setActiveSlide(item.id)
                    }
                  }}>
                  <span className="text-xs text-gray-400 w-4 shrink-0">{item.kind === 'song' ? '♪' : '📖'}</span>
                  <span className="text-xs text-white flex-1 truncate">{label}</span>
                  <button className="text-gray-600 hover:text-red-400 text-xs shrink-0"
                    onClick={(e) => { e.stopPropagation(); removeFromQueue(i) }}>✕</button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Middle — Slide grid */}
        <div className="flex-1 bg-gray-800 flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-700">
            <p className="text-sm font-semibold text-white truncate">
              {activeSong?.title ?? activeScripture?.displayLabel ?? 'Select an item from the queue'}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {/* Blank / Logo buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={toggleBlank}
                className={`px-4 py-2 rounded font-medium text-sm transition-colors ${isBlanked ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
              >
                {isBlanked ? '● BLANKED' : 'BLANK (B)'}
              </button>
            </div>

            {activeSong && allSlides.map((slide) => (
              <SlideThumb
                key={slide.id}
                label={slide.label}
                text={slide.type === 'blank' ? '(blank)' : slide.text}
                active={slide.id === activeSlideId}
                live={slide.id === activeSlideId && !isBlanked}
                onClick={() => { setActiveSlide(slide.id); setBlank(false) }}
              />
            ))}

            {activeScripture && (
              <SlideThumb
                label={activeScripture.displayLabel}
                text={activeScripture.text}
                active={true}
                live={!isBlanked}
                onClick={() => { setActiveSlide(activeScripture.id); setBlank(false) }}
              />
            )}
          </div>
        </div>

        {/* Right — Output preview */}
        <div className="w-72 shrink-0 bg-gray-900 border-l border-gray-700 flex flex-col">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider p-3 border-b border-gray-700">Output Preview</p>
          <div className="p-3 flex-1 flex flex-col gap-4">
            {/* 16:9 preview */}
            <div className="w-full aspect-video rounded overflow-hidden border border-gray-700 relative"
              style={{ background: isBlanked ? '#000' : (activeSong?.background ?? '#000') }}>
              {!isBlanked && (
                <div className="absolute inset-0 flex items-center justify-center scale-[0.35] origin-center">
                  <SlideText song={activeSong} scripture={activeScripture} slideId={activeSlideId} showReference={false} className="w-full" />
                </div>
              )}
              {isBlanked && <p className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">BLANKED</p>}
            </div>

            {/* PiP controls */}
            <div className="bg-gray-800 rounded-lg p-3 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">PiP / Overlay</p>

              <div>
                <p className="text-xs text-gray-500 mb-1">Layout</p>
                <div className="flex gap-1">
                  {(['lower-third', 'pip-box', 'full-overlay'] as const).map((l) => (
                    <button key={l} onClick={() => setPipLayout(l)}
                      className={`flex-1 text-xs py-1 rounded ${pipLayout === l ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {l === 'lower-third' ? 'Bar' : l === 'pip-box' ? 'Box' : 'Full'}
                    </button>
                  ))}
                </div>
              </div>

              {pipLayout === 'pip-box' && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Position</p>
                  <div className="grid grid-cols-2 gap-1">
                    {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((p) => (
                      <button key={p} onClick={() => setPipPosition(p)}
                        className={`text-xs py-1 rounded ${pipPosition === p ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                        {p.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input type="checkbox" checked={showReference} onChange={(e) => setShowReference(e.target.checked)} className="accent-orange-500" />
                Show reference / song title
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-4 py-2 gap-4">
        <div className="flex gap-2">
          <button onClick={goPrev} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">◀ Prev</button>
          <button onClick={goNext} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm">Next ▶</button>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {activeSong ? `${activeIndex + 1} / ${allSlides.length} — ${allSlides[activeIndex]?.label ?? ''}` : activeScripture?.displayLabel ?? 'No slide selected'}
          </p>
        </div>
        <div className="text-sm text-gray-400 tabular-nums">
          {clock.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
