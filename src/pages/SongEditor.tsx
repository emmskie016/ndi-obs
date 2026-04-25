import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import type { Slide, SlideType } from '../types'

const SLIDE_TYPES: SlideType[] = ['verse', 'chorus', 'bridge', 'pre-chorus', 'tag', 'intro', 'outro', 'blank']

function newSlide(type: SlideType, index: number): Slide {
  return { id: crypto.randomUUID(), type, label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`, text: '' }
}

export default function SongEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { songs, addSong, updateSong } = useStore()
  const existing = id && id !== 'new' ? songs.find((s) => s.id === id) : null

  const [title, setTitle] = useState(existing?.title ?? '')
  const [artist, setArtist] = useState(existing?.artist ?? '')
  const [background, setBackground] = useState(existing?.background ?? '#000000')
  const [textColor, setTextColor] = useState(existing?.textColor ?? '#ffffff')
  const [slides, setSlides] = useState<Slide[]>(existing?.slides ?? [newSlide('verse', 1)])
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (existing) {
      setTitle(existing.title)
      setArtist(existing.artist ?? '')
      setBackground(existing.background)
      setTextColor(existing.textColor)
      setSlides(existing.slides)
    }
  }, [existing?.id])

  const addSlide = () => {
    const type: SlideType = 'verse'
    const count = slides.filter((s) => s.type === type).length + 1
    setSlides([...slides, newSlide(type, count)])
  }

  const updateSlide = (i: number, patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s, idx) => idx === i ? { ...s, ...patch } : s))
  }

  const removeSlide = (i: number) => setSlides((prev) => prev.filter((_, idx) => idx !== i))

  const save = () => {
    const now = Date.now()
    if (existing) {
      updateSong({ ...existing, title, artist, background, textColor, slides, updatedAt: now })
    } else {
      addSong({ id: crypto.randomUUID(), title, artist, background, textColor, slides, createdAt: now, updatedAt: now })
    }
    navigate('/library')
  }

  const activeSlide = slides[activeIdx]

  return (
    <div className="flex h-[calc(100vh-48px)] overflow-hidden">
      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden p-6 overflow-y-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/library')} className="text-gray-400 hover:text-white text-sm">← Back</button>
          <h1 className="text-lg font-bold text-white flex-1">{existing ? 'Edit Song' : 'New Song'}</h1>
          <button onClick={save} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium text-sm">Save Song</button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm" placeholder="Song title *" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm" placeholder="Artist (optional)" value={artist} onChange={(e) => setArtist(e.target.value)} />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="text-xs text-gray-400">Background <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="ml-2 w-8 h-6 rounded cursor-pointer" /></label>
          <label className="text-xs text-gray-400">Text <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="ml-2 w-8 h-6 rounded cursor-pointer" /></label>
        </div>

        <div className="space-y-3">
          {slides.map((slide, i) => (
            <div key={slide.id} onClick={() => setActiveIdx(i)}
              className={`rounded-lg border p-3 cursor-pointer transition-colors ${activeIdx === i ? 'border-orange-500 bg-gray-800' : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800'}`}>
              <div className="flex items-center gap-2 mb-2">
                <select value={slide.type} onChange={(e) => updateSlide(i, { type: e.target.value as SlideType, label: `${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)} ${slides.filter((s, si) => s.type === e.target.value && si <= i).length}` })}
                  className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white">
                  {SLIDE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={slide.label} onChange={(e) => updateSlide(i, { label: e.target.value })}
                  className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white" />
                <button onClick={(e) => { e.stopPropagation(); removeSlide(i) }} className="text-gray-600 hover:text-red-400 text-xs">✕</button>
              </div>
              <textarea value={slide.text} onChange={(e) => updateSlide(i, { text: e.target.value })}
                rows={3} className="w-full text-sm bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white resize-none"
                placeholder="Lyrics…" />
            </div>
          ))}
        </div>

        <button onClick={addSlide} className="mt-4 w-full py-2 border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 rounded text-sm">+ Add Slide</button>
      </div>

      {/* Live preview */}
      <div className="w-72 shrink-0 bg-gray-900 border-l border-gray-700 flex flex-col items-center justify-center p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Preview</p>
        <div className="w-full aspect-video rounded overflow-hidden relative flex items-center justify-center"
          style={{ background }}>
          {activeSlide && activeSlide.type !== 'blank' && (
            <p className="text-center font-bold text-sm px-3 whitespace-pre-line leading-snug" style={{ color: textColor, fontSize: '10px', lineHeight: 1.5 }}>
              {activeSlide.text || '(empty)'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
