import { useEffect } from 'react'
import { useStore } from '../store'
import type { BroadcastState } from '../types'

export function useLiveState() {
  const applyBroadcast = useStore((s) => s.applyBroadcast)

  useEffect(() => {
    // Fetch current state immediately on mount
    fetch('/api/state')
      .then((r) => r.json())
      .then((s) => applyBroadcast(s as BroadcastState))
      .catch(() => {})

    // Subscribe to SSE stream for real-time updates from OBS or other contexts
    const es = new EventSource('/api/state/stream')
    es.onmessage = (e) => {
      try {
        applyBroadcast(JSON.parse(e.data) as BroadcastState)
      } catch {}
    }
    return () => es.close()
  }, [])
}
