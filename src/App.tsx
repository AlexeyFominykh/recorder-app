import { useState, useCallback, useEffect } from 'react';
import NoteInput from './components/input/NoteTextInput';
import FingeringDisplay from './components/FingeringDisplay';
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
  const [currentIndex, setCurrentIndex] = useState(0);
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
    setCurrentIndex(0);
  }, []);

  const handleSelectMelody = useCallback((notes: string[], name: string) => {
    handleNotesSubmit(notes);
    setMelodyName(name);
    setShowLibrary(false);
  }, [handleNotesSubmit]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(melody.length - 1, prev + 1));
  }, [melody.length]);

  const handlePlay = useCallback(() => {
    if (melody[currentIndex]) {
      playNote(melody[currentIndex].frequency, 1.2);
    }
  }, [melody, currentIndex, playNote]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (melody.length === 0) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        handlePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [melody.length, handlePrev, handleNext, handlePlay]);

  const handleBackToInput = useCallback(() => {
    setMelody([]);
    setMelodyName('');
    setCurrentIndex(0);
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
        <FingeringDisplay
          note={melody[currentIndex].note}
          fingering={melody[currentIndex].fingering}
          currentIndex={currentIndex}
          totalNotes={melody.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onPlay={handlePlay}
        />
      )}

      {melody.length > 0 && (
        <div className={styles.melodySummary}>
          <h3>{melodyName || 'Melody'}:</h3>
          <div className={styles.noteChips}>
            {melody.map((n, i) => (
              <span
                key={i}
                className={`${styles.chip} ${i === currentIndex ? styles.active : ''}`}
                onClick={() => setCurrentIndex(i)}
              >
                {n.note}
              </span>
            ))}
          </div>
          <div className={styles.actions}>
            <button onClick={() => playMelody(melody.map(n => n.frequency), 0.8, 0.2)} className={styles.playAllButton}>
              ▶ Play All
            </button>
            {user && <SaveMelodyButton user={user} notes={melody.map(n => n.note)} />}
          </div>
          <button onClick={handleBackToInput} className={styles.backButton}>
            ← New Melody
          </button>
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
