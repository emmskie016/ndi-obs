import React, { useState } from 'react'

const base = window.location.origin

export default function ObsSetup() {
  const [transparent, setTransparent] = useState(true)
  const pipUrl = `${base}/output/pip${transparent ? '?bg=transparent' : ''}`
  const obsUrl = `${base}/output/obs`

  const copy = (text: string) => navigator.clipboard.writeText(text)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-xl font-bold text-white">OBS + NDI Setup</h1>

      <div className="bg-gray-800 rounded-xl p-5 space-y-4">
        <h2 className="text-white font-semibold">How it works</h2>
        <div className="text-sm text-gray-300 space-y-2">
          <p>SlideLive outputs to browser windows. OBS captures them as <strong>Browser Sources</strong>, then the <strong>OBS-NDI plugin</strong> broadcasts the scene as an NDI stream on your local network.</p>
          <ol className="list-decimal list-inside space-y-1 text-gray-400">
            <li>Install OBS Studio</li>
            <li>Install the <strong>obs-ndi</strong> plugin from GitHub (obs-ndi releases)</li>
            <li>Add Browser Sources in OBS using the URLs below</li>
            <li>Enable NDI output: <em>Tools → NDI Output Settings → Main Output → Enable</em></li>
            <li>Any NDI receiver on the same network can now receive "OBS" as an NDI source</li>
          </ol>
        </div>
      </div>

      {/* OBS Layer diagram */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-3">
        <h2 className="text-white font-semibold">OBS Layer Stack (for PiP / Scripture overlay)</h2>
        <div className="bg-gray-900 rounded p-4 text-sm font-mono text-gray-300 space-y-1">
          <p className="text-green-400">↑ top</p>
          <p>🟧 [Layer 3] SlideLive PiP — <span className="text-orange-300">/output/pip?bg=transparent</span></p>
          <p>🟦 [Layer 2] SlideLive Full Screen — <span className="text-blue-300">/output/obs</span> (for projector)</p>
          <p>📹 [Layer 1] Camera / Video feed</p>
          <p className="text-green-400">↓ bottom</p>
        </div>
        <p className="text-xs text-gray-500">The PiP layer is transparent — lyrics/scriptures float over your camera feed. Perfect for streaming.</p>
      </div>

      {/* Browser Source 1 — Full output */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-3">
        <h2 className="text-white font-semibold">Browser Source 1 — Full Screen Output</h2>
        <p className="text-xs text-gray-400">Add this as a Browser Source for your projector / main output display.</p>
        <div className="flex gap-2">
          <input readOnly value={obsUrl} className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono" />
          <button onClick={() => copy(obsUrl)} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Copy</button>
          <button onClick={() => window.open('/output/obs', '_blank', 'width=1920,height=1080')}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm">Test</button>
        </div>
        <p className="text-xs text-gray-500">OBS Browser Source settings: <strong>Width 1920, Height 1080</strong>. Uncheck "Shutdown source when not visible".</p>
      </div>

      {/* Browser Source 2 — PiP overlay */}
      <div className="bg-gray-800 rounded-xl p-5 space-y-3">
        <h2 className="text-white font-semibold">Browser Source 2 — PiP / Lyrics Overlay</h2>
        <p className="text-xs text-gray-400">Add this ABOVE your camera layer in OBS. It shows lyrics and scriptures as a transparent overlay.</p>
        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
          <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} className="accent-orange-500" />
          Transparent background (recommended for overlay)
        </label>
        <div className="flex gap-2">
          <input readOnly value={pipUrl} className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm font-mono" />
          <button onClick={() => copy(pipUrl)} className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm">Copy</button>
          <button onClick={() => window.open(pipUrl, '_blank', 'width=1920,height=1080')}
            className="px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm">Test</button>
        </div>
        <p className="text-xs text-gray-500">OBS Browser Source settings: <strong>Width 1920, Height 1080</strong>. Check "Allow transparency".</p>
      </div>

      <div className="bg-gray-800 rounded-xl p-5">
        <h2 className="text-white font-semibold mb-2">Keyboard Shortcuts (Operator Panel)</h2>
        <div className="text-sm text-gray-300 space-y-1">
          <p><kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs">→ / ↓</kbd> — Next slide</p>
          <p><kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs">← / ↑</kbd> — Previous slide</p>
          <p><kbd className="bg-gray-700 px-2 py-0.5 rounded text-xs">B</kbd> — Toggle blank screen</p>
        </div>
      </div>
    </div>
  )
}
