import { useEffect, useRef } from 'react'
import { useStore } from '../store'
import type { BroadcastState } from '../types'

export function useLiveState() {
  const applyBroadcast = useStore((s) => s.applyBroadcast)
  const lastVersionRef = useRef<string>('')

  useEffect(() => {
    let es: EventSource | null = null

    function apply(s: BroadcastState) {
      // Only re-render if state actually changed
      const version = JSON.stringify(s)
      if (version === lastVersionRef.current) return
      lastVersionRef.current = version
      applyBroadcast(s)
    }

    // Fetch current state immediately
    fetch('/api/state')
      .then((r) => r.json())
      .then(apply)
      .catch(() => {})

    // SSE for instant updates (works in interactive mode)
    try {
      es = new EventSource('/api/state/stream')
      es.onmessage = (e) => {
        try { apply(JSON.parse(e.data)) } catch {}
      }
      es.onerror = () => {
        es?.close()
        es = null
      }
    } catch {}

    // Polling fallback — OBS throttles SSE when source is not focused
    const poll = setInterval(() => {
      fetch('/api/state')
        .then((r) => r.json())
        .then(apply)
        .catch(() => {})
    }, 500)

    return () => {
      es?.close()
      clearInterval(poll)
    }
  }, [])
}
