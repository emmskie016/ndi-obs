import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const { pathname } = useLocation()
  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
        pathname === to ? 'bg-orange-500 text-white' : 'text-gray-300 hover:text-white'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 shrink-0">
      <span className="text-orange-400 font-bold text-lg tracking-wide">SlideLive</span>
      <div className="flex gap-2">
        {link('/', 'Operator')}
        {link('/library', 'Library')}
        {link('/scriptures', 'Scriptures')}
        {link('/settings/obs', 'OBS Setup')}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => window.open('/output', '_blank', 'width=1280,height=720')}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
        >
          Open Output
        </button>
        <button
          onClick={() => window.open('/output/pip', '_blank', 'width=1280,height=720')}
          className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
        >
          Open PiP
        </button>
      </div>
    </nav>
  )
}
