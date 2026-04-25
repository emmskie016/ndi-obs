import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Song, Scripture, QueueItem, PipLayout, PipPosition, BroadcastState } from './types'
import { seedSongs, seedScriptures } from './seed'

const CHANNEL = 'slidelivechannel'
let bc: BroadcastChannel | null = null

function getBroadcast() {
  if (!bc) bc = new BroadcastChannel(CHANNEL)
  return bc
}

interface Store {
  // library
  songs: Song[]
  scriptures: Scripture[]
  // service queue
  queue: QueueItem[]
  // operator state
  activeItemId: string | null
  activeSlideId: string | null
  isBlanked: boolean
  showReference: boolean
  pipLayout: PipLayout
  pipPosition: PipPosition
  // actions
  addSong: (s: Song) => void
  updateSong: (s: Song) => void
  deleteSong: (id: string) => void
  addScripture: (s: Scripture) => void
  updateScripture: (s: Scripture) => void
  deleteScripture: (id: string) => void
  addToQueue: (item: QueueItem) => void
  removeFromQueue: (index: number) => void
  reorderQueue: (from: number, to: number) => void
  setActiveItem: (id: string) => void
  setActiveSlide: (slideId: string) => void
  toggleBlank: () => void
  setBlank: (v: boolean) => void
  setShowReference: (v: boolean) => void
  setPipLayout: (l: PipLayout) => void
  setPipPosition: (p: PipPosition) => void
  broadcast: () => void
  applyBroadcast: (s: BroadcastState) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      songs: seedSongs,
      scriptures: seedScriptures,
      queue: [],
      activeItemId: null,
      activeSlideId: null,
      isBlanked: false,
      showReference: true,
      pipLayout: 'lower-third',
      pipPosition: 'bottom-left',

      addSong: (s) => set((st) => ({ songs: [...st.songs, s] })),
      updateSong: (s) => set((st) => ({ songs: st.songs.map((x) => (x.id === s.id ? s : x)) })),
      deleteSong: (id) => set((st) => ({ songs: st.songs.filter((x) => x.id !== id) })),
      addScripture: (s) => set((st) => ({ scriptures: [...st.scriptures, s] })),
      updateScripture: (s) => set((st) => ({ scriptures: st.scriptures.map((x) => (x.id === s.id ? s : x)) })),
      deleteScripture: (id) => set((st) => ({ scriptures: st.scriptures.filter((x) => x.id !== id) })),

      addToQueue: (item) => set((st) => ({ queue: [...st.queue, item] })),
      removeFromQueue: (i) => set((st) => ({ queue: st.queue.filter((_, idx) => idx !== i) })),
      reorderQueue: (from, to) =>
        set((st) => {
          const q = [...st.queue]
          const [item] = q.splice(from, 1)
          q.splice(to, 0, item)
          return { queue: q }
        }),

      setActiveItem: (id) => set({ activeItemId: id }),
      setActiveSlide: (slideId) => {
        set({ activeSlideId: slideId, isBlanked: false })
        setTimeout(() => get().broadcast(), 0)
      },
      toggleBlank: () => {
        set((st) => ({ isBlanked: !st.isBlanked }))
        setTimeout(() => get().broadcast(), 0)
      },
      setBlank: (v) => {
        set({ isBlanked: v })
        setTimeout(() => get().broadcast(), 0)
      },
      setShowReference: (v) => {
        set({ showReference: v })
        setTimeout(() => get().broadcast(), 0)
      },
      setPipLayout: (l) => {
        set({ pipLayout: l })
        setTimeout(() => get().broadcast(), 0)
      },
      setPipPosition: (p) => {
        set({ pipPosition: p })
        setTimeout(() => get().broadcast(), 0)
      },

      broadcast: () => {
        const { activeItemId, activeSlideId, isBlanked, showReference, pipLayout, pipPosition } = get()
        getBroadcast().postMessage({ activeItemId, activeSlideId, isBlanked, showReference, pipLayout, pipPosition })
      },

      applyBroadcast: (s) =>
        set({
          activeItemId: s.activeItemId,
          activeSlideId: s.activeSlideId,
          isBlanked: s.isBlanked,
          showReference: s.showReference,
          pipLayout: s.pipLayout,
          pipPosition: s.pipPosition,
        }),
    }),
    {
      name: 'slidelive-store',
      partialize: (s) => ({ songs: s.songs, scriptures: s.scriptures, queue: s.queue }),
    }
  )
)

// listen for cross-tab broadcasts
getBroadcast().onmessage = (e) => {
  useStore.getState().applyBroadcast(e.data as BroadcastState)
}
