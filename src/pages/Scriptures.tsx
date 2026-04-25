import React, { useState } from 'react'
import { useStore } from '../store'
import type { Scripture } from '../types'

const TRANSLATIONS = ['NIV', 'ESV', 'KJV', 'NKJV', 'NLT', 'NASB', 'CSB', 'MSG', 'AMP']

// n8n Capisoft Bible verse lookup webhook
const N8N_WEBHOOK = 'https://capisoftnl.app.n8n.cloud/webhook/bible-verse-lookup'

function blankScripture(): Omit<Scripture, 'id' | 'createdAt' | 'displayLabel'> {
  return { book: '', chapter: 1, verseStart: 1, text: '', translation: 'NIV' }
}

export default function Scriptures() {
  const { scriptures, addScripture, updateScripture, deleteScripture, setActiveItem, setActiveSlide, setBlank } = useStore()
  const [search, setSearch] = useState('')
  const [form, setForm] = useState<Omit<Scripture, 'id' | 'createdAt' | 'displayLabel'>>(blankScripture())
  const [verseEnd, setVerseEnd] = useState<string>('')
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')

  // Auto-generate display label
  const displayLabel = form.book && form.chapter && form.verseStart
    ? `${form.book} ${form.chapter}:${form.verseStart}${verseEnd ? `-${verseEnd}` : ''} ${form.translation}`
    : ''

  const filtered = scriptures.filter((s) =>
    s.displayLabel.toLowerCase().includes(search.toLowerCase()) ||
    s.text.toLowerCase().includes(search.toLowerCase())
  )

  const reset = () => {
    setForm(blankScripture())
    setVerseEnd('')
    setEditId(null)
    setLookupError('')
  }

  const startEdit = (s: Scripture) => {
    setForm({ book: s.book, chapter: s.chapter, verseStart: s.verseStart, text: s.text, translation: s.translation })
    setVerseEnd(s.verseEnd ? String(s.verseEnd) : '')
    setEditId(s.id)
  }

  const save = () => {
    if (!form.book || !form.chapter || !form.verseStart || !form.text) return
    const now = Date.now()
    const label = `${form.book} ${form.chapter}:${form.verseStart}${verseEnd ? `-${verseEnd}` : ''} ${form.translation}`
    if (editId) {
      const existing = scriptures.find((s) => s.id === editId)!
      updateScripture({ ...existing, ...form, verseEnd: verseEnd ? Number(verseEnd) : undefined, displayLabel: label })
    } else {
      addScripture({ id: crypto.randomUUID(), ...form, verseEnd: verseEnd ? Number(verseEnd) : undefined, displayLabel: label, createdAt: now })
    }
    reset()
  }

  const goLive = (s: Scripture) => {
    setActiveItem(s.id)
    setActiveSlide(s.id)
    setBlank(false)
  }

  // Fetch from n8n webhook (Bible verse lookup via Capisoft n8n)
  const lookupVerse = async () => {
    if (!form.book || !form.chapter || !form.verseStart) return
    setLoading(true)
    setLookupError('')
    try {
      const res = await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book: form.book, chapter: form.chapter, verse: form.verseStart, verseEnd: verseEnd || undefined, translation: form.translation }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      const data = Array.isArray(raw) ? raw[0] : raw
      if (data?.text) setForm((f) => ({ ...f, text: data.text }))
      else setLookupError('No verse text returned — paste it manually below.')
    } catch {
      setLookupError('Lookup unavailable — paste the verse text manually below.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Scripture Library</h1>

      {/* Form */}
      <div className="bg-gray-800 rounded-xl p-5 mb-6 space-y-4">
        <p className="text-sm font-semibold text-gray-300">{editId ? 'Edit Scripture' : 'Add Scripture'}</p>

        <div className="grid grid-cols-4 gap-3">
          <input className="col-span-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="Book (e.g. John)" value={form.book} onChange={(e) => setForm((f) => ({ ...f, book: e.target.value }))} />
          <input className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="Chapter" type="number" min={1} value={form.chapter} onChange={(e) => setForm((f) => ({ ...f, chapter: Number(e.target.value) }))} />
          <select className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" value={form.translation} onChange={(e) => setForm((f) => ({ ...f, translation: e.target.value }))}>
            {TRANSLATIONS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-4 gap-3 items-center">
          <input className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="Verse start" type="number" min={1} value={form.verseStart} onChange={(e) => setForm((f) => ({ ...f, verseStart: Number(e.target.value) }))} />
          <input className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm" placeholder="Verse end (optional)" type="number" min={1} value={verseEnd} onChange={(e) => setVerseEnd(e.target.value)} />
          <button onClick={lookupVerse} disabled={loading || !form.book}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 rounded text-white text-sm">
            {loading ? 'Looking up…' : '🔍 Auto-fetch'}
          </button>
          {displayLabel && <p className="text-xs text-orange-400 truncate">{displayLabel}</p>}
        </div>

        {lookupError && <p className="text-xs text-yellow-400">{lookupError}</p>}

        {/* Paste-in text area — main input for copy-paste scripture */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Scripture text — type or paste directly here</p>
          <textarea
            className="w-full px-3 py-3 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none leading-relaxed"
            rows={5}
            placeholder="Paste or type the scripture text here…"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
        </div>

        <div className="flex gap-2">
          <button onClick={save} disabled={!form.book || !form.text}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded font-medium text-sm">
            {editId ? 'Update' : 'Save Scripture'}
          </button>
          {editId && <button onClick={reset} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Cancel</button>}
        </div>
      </div>

      {/* Search & list */}
      <input
        className="w-full mb-4 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 text-sm"
        placeholder="Search scriptures…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="bg-gray-800 rounded-lg px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-orange-400 text-sm font-semibold">{s.displayLabel}</p>
                <p className="text-gray-300 text-sm mt-1 line-clamp-2">{s.text}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => goLive(s)}
                  className="px-3 py-1 text-xs bg-orange-600 hover:bg-orange-500 rounded text-white font-medium">▶ Live</button>
                <button onClick={() => startEdit(s)}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white">Edit</button>
                <button onClick={() => { if (confirm('Delete this scripture?')) deleteScripture(s.id) }}
                  className="px-3 py-1 text-xs bg-gray-700 hover:bg-red-900 rounded text-red-400">Del</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-600 text-sm text-center py-8">No scriptures found</p>}
      </div>
    </div>
  )
}
