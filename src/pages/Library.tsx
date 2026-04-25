import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function Library() {
  const { songs, deleteSong } = useStore()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = songs.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.slides.some((sl) => sl.text.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Song Library</h1>
        <button onClick={() => navigate('/library/songs/new')}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium text-sm">
          + New Song
        </button>
      </div>
      <input
        className="w-full mb-4 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-500 text-sm"
        placeholder="Search songs or lyrics…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="space-y-2">
        {filtered.map((song) => (
          <div key={song.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
            <div>
              <p className="text-white font-medium">{song.title}</p>
              <p className="text-xs text-gray-400">{song.slides.length} slides{song.artist ? ` · ${song.artist}` : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/library/songs/${song.id}`)}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white">Edit</button>
              <button onClick={() => { if (confirm(`Delete "${song.title}"?`)) deleteSong(song.id) }}
                className="px-3 py-1 text-xs bg-gray-700 hover:bg-red-900 rounded text-red-400">Delete</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-gray-600 text-sm text-center py-8">No songs found</p>}
      </div>
    </div>
  )
}
