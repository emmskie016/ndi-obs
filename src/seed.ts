import type { Song, Scripture } from './types'

export const seedSongs: Song[] = [
  {
    id: 'seed-amazing-grace',
    title: 'Amazing Grace',
    artist: 'John Newton',
    background: '#000000',
    textColor: '#ffffff',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: [
      { id: 'ag-1', type: 'verse', label: 'Verse 1', text: 'Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost but now am found\nWas blind but now I see' },
      { id: 'ag-2', type: 'verse', label: 'Verse 2', text: "'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed" },
      { id: 'ag-3', type: 'verse', label: 'Verse 3', text: 'Through many dangers toils and snares\nI have already come\n\'Twas grace that brought me safe thus far\nAnd grace will lead me home' },
      { id: 'ag-4', type: 'verse', label: 'Verse 4', text: 'When we\'ve been there ten thousand years\nBright shining as the sun\nWe\'ve no less days to sing God\'s praise\nThan when we first begun' },
    ],
  },
  {
    id: 'seed-how-great',
    title: 'How Great Is Our God',
    artist: 'Chris Tomlin',
    background: '#000000',
    textColor: '#ffffff',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: [
      { id: 'hg-1', type: 'verse', label: 'Verse 1', text: 'The splendor of the King\nClothed in majesty\nLet all the earth rejoice\nAll the earth rejoice' },
      { id: 'hg-2', type: 'verse', label: 'Verse 2', text: 'He wraps Himself in light\nAnd darkness tries to hide\nAnd trembles at His voice\nAnd trembles at His voice' },
      { id: 'hg-3', type: 'chorus', label: 'Chorus', text: 'How great is our God\nSing with me\nHow great is our God\nAnd all will see how great\nHow great is our God' },
      { id: 'hg-4', type: 'bridge', label: 'Bridge', text: 'Name above all names\nWorthy of all praise\nMy heart will sing\nHow great is our God' },
    ],
  },
  {
    id: 'seed-good-father',
    title: 'Good Good Father',
    artist: 'Chris Tomlin',
    background: '#000000',
    textColor: '#ffffff',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    slides: [
      { id: 'gf-1', type: 'verse', label: 'Verse 1', text: "I've heard a thousand stories\nOf what they think You're like\nBut I've heard the tender whisper\nOf love in the dead of night" },
      { id: 'gf-2', type: 'chorus', label: 'Chorus', text: "You're a good good Father\nIt's who You are\nIt's who You are\nIt's who You are\nAnd I'm loved by You\nIt's who I am\nIt's who I am\nIt's who I am" },
      { id: 'gf-3', type: 'verse', label: 'Verse 2', text: "I've seen many searching\nFor answers far and wide\nBut I know we're all searching\nFor answers only You provide" },
      { id: 'gf-4', type: 'bridge', label: 'Bridge', text: "You are perfect in all of Your ways\nYou are perfect in all of Your ways\nYou are perfect in all of Your ways to us" },
    ],
  },
]

export const seedScriptures: Scripture[] = [
  {
    id: 'seed-john-316',
    book: 'John',
    chapter: 3,
    verseStart: 16,
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    translation: 'NIV',
    displayLabel: 'John 3:16 NIV',
    createdAt: Date.now(),
  },
  {
    id: 'seed-ps-23-1',
    book: 'Psalms',
    chapter: 23,
    verseStart: 1,
    text: 'The Lord is my shepherd, I lack nothing.',
    translation: 'NIV',
    displayLabel: 'Psalms 23:1 NIV',
    createdAt: Date.now(),
  },
]
