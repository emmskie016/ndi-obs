import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Operator from './pages/Operator'
import Library from './pages/Library'
import SongEditor from './pages/SongEditor'
import Scriptures from './pages/Scriptures'
import ObsSetup from './pages/ObsSetup'
import Output from './pages/Output'
import PipOutput from './pages/PipOutput'

const OUTPUT_ROUTES = ['/output', '/output/obs', '/output/pip']

export default function App() {
  const { pathname } = useLocation()
  const isOutput = OUTPUT_ROUTES.some((r) => pathname.startsWith(r))

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {!isOutput && <Nav />}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Operator />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/songs/new" element={<SongEditor />} />
          <Route path="/library/songs/:id" element={<SongEditor />} />
          <Route path="/scriptures" element={<Scriptures />} />
          <Route path="/settings/obs" element={<ObsSetup />} />
          <Route path="/output" element={<Output />} />
          <Route path="/output/obs" element={<Output />} />
          <Route path="/output/pip" element={<PipOutput />} />
        </Routes>
      </div>
    </div>
  )
}
