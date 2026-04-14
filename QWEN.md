# Recorder Fingering PWA

## Project Overview
A PWA that takes a melody (list of notes) and displays soprano recorder fingering diagrams with audio playback. Users can save melodies to their personal library via Firebase.

## Tech Stack
- **Vite** + **React** + **TypeScript**
- **Yarn** (package manager)
- **Firebase** (Google Auth + Firestore)
- **Vite PWA plugin** (Service Worker, offline support)
- **Web Audio API** (note playback)

## Project Structure
```
src/
├── components/
│   ├── input/
│   │   ├── NoteTextInput.tsx      # Manual text input (v1)
│   │   ├── SongSearchInput.tsx    # Future
│   │   └── ImageUploadInput.tsx   # Future
│   ├── FingeringDisplay.tsx
│   ├── RecorderDiagram.tsx        # SVG fingering
│   ├── NoteNavigator.tsx
│   ├── NoteSummary.tsx
│   ├── Library/
│   │   ├── LibraryView.tsx        # Saved melodies list
│   │   └── SaveMelodyButton.tsx
│   └── Auth/
│       └── GoogleSignIn.tsx
├── data/fingerings/
│   └── germanG.ts
├── hooks/
│   └── useAudio.ts
├── services/
│   └── firebase.ts               # Firebase config + helpers
├── types/index.ts
└── App.tsx
```

## Default Recorder Type
- German G soprano recorder
- Architecture should support adding more types (Baroque C, Alto F, Tenor C)

## Firestore Schema
```
users/{userId}/melodies/{melodyId}
  - name: string
  - notes: string[]       # ["G", "A", "B", "C", ...]
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Features (Phase 1)
1. Manual text note input
2. SVG fingering diagrams (German G)
3. Note navigation (prev/next)
4. Audio playback per note
5. Google Sign-In
6. Save/load melodies to personal library
7. PWA (offline + installable)

## Future Features
- Song name lookup → find melody online → extract notes
- Sheet music image upload → OCR → extract notes
- More recorder types
