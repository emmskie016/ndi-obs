export type SlideType = 'verse' | 'chorus' | 'bridge' | 'pre-chorus' | 'tag' | 'blank' | 'intro' | 'outro'

export interface Slide {
  id: string
  type: SlideType
  label: string
  text: string
}

export interface Song {
  id: string
  title: string
  artist?: string
  background: string
  textColor: string
  slides: Slide[]
  createdAt: number
  updatedAt: number
}

export interface Scripture {
  id: string
  book: string
  chapter: number
  verseStart: number
  verseEnd?: number
  text: string
  translation: string
  displayLabel: string
  createdAt: number
}

export type QueueItem =
  | { kind: 'song'; id: string }
  | { kind: 'scripture'; id: string }

export type PipLayout = 'lower-third' | 'pip-box' | 'full-overlay'
export type PipPosition = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'

// Resolved slide content — sent over SSE so OBS doesn't need localStorage
export interface LiveSlide {
  text: string          // actual lyrics / scripture text (max 2 lines applied)
  reference: string     // "Amazing Grace — Verse 1" or "John 3:16 NIV"
  background: string    // hex color
  textColor: string
}

export interface BroadcastState {
  activeItemId: string | null
  activeSlideId: string | null
  isBlanked: boolean
  showReference: boolean
  pipLayout: PipLayout
  pipPosition: PipPosition
  liveSlide: LiveSlide | null  // full resolved content for OBS
}
