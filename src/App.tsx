import { useState, useCallback, useEffect } from 'react';
import NoteInput from './components/input/NoteTextInput';
import MelodyView from './components/MelodyView';
import GoogleSignIn from './components/Auth/GoogleSignIn';
import LibraryView from './components/Library/LibraryView';
import SaveMelodyButton from './components/Library/SaveMelodyButton';
import { getNoteData } from './data/fingerings';
import { useAudio } from './hooks/useAudio';
import type { Fingering } from './types';
import type { User } from 'firebase/auth';
import styles from './App.module.css';

interface NoteWithFingering {
  note: string;
  fingering: Fingering;
  frequency: number;
}

function App() {
  const [melody, setMelody] = useState<NoteWithFingering[]>([]);
  const [melodyName, setMelodyName] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const { playNote, playMelody } = useAudio();

  const handleNotesSubmit = useCallback((notes: string[]) => {
    const notesWithData: NoteWithFingering[] = [];
    for (const note of notes) {
      const data = getNoteData('germanG', note);
      if (data) {
        notesWithData.push({ note, fingering: data.fingering, frequency: data.frequency });
      }
    }
    setMelody(notesWithData);
    setMelodyName(notes.join(' '));
  }, []);

  const handleSelectMelody = useCallback((notes: string[], name: string) => {
    handleNotesSubmit(notes);
    setMelodyName(name);
    setShowLibrary(false);
  }, [handleNotesSubmit]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (melody.length === 0) return;
      if (e.key === ' ') {
        e.preventDefault();
        // Play first note or cycle
        const idx = melody.findIndex((_, i) => i === 0);
        if (idx !== -1) playNote(melody[0].frequency, 1.2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [melody, playNote]);

  const handleBackToInput = useCallback(() => {
    setMelody([]);
    setMelodyName('');
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Recorder Fingering</h1>
        <div className={styles.headerActions}>
          {user && (
            <button onClick={() => setShowLibrary(true)} className={styles.libraryButton}>
              📚 Library
            </button>
          )}
          <GoogleSignIn onUserChange={setUser} />
        </div>
      </header>

      {melody.length === 0 ? (
        <NoteInput onSubmit={handleNotesSubmit} recorderType="germanG" />
      ) : (
        <MelodyView melody={melody} onPlayNote={(freq) => playNote(freq, 1.2)} />
      )}

      {melody.length > 0 && (
        <div className={styles.toolbar}>
          <span className={styles.melodyName}>{melodyName || 'Melody'}</span>
          <div className={styles.actions}>
            <button onClick={() => playMelody(melody.map(n => n.frequency), 0.8, 0.2)} className={styles.playAllButton}>
              ▶ Play All
            </button>
            {user && <SaveMelodyButton user={user} notes={melody.map(n => n.note)} />}
            <button onClick={handleBackToInput} className={styles.backButton}>
              ← New Melody
            </button>
          </div>
        </div>
      )}

      {showLibrary && user && (
        <LibraryView
          user={user}
          onSelectMelody={handleSelectMelody}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
}

export default App;
