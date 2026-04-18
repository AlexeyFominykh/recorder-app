import { useState, useCallback, useEffect } from 'react';
import NoteInput, { parseInput } from './components/input/NoteTextInput';
import MelodyView from './components/MelodyView';
import GoogleSignIn from './components/Auth/GoogleSignIn';
import LibraryView from './components/Library/LibraryView';
import SaveMelodyButton from './components/Library/SaveMelodyButton';
import { getNoteData, getAvailableNotes } from './data/fingerings';
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
  const [melody, setMelody] = useState<NoteWithFingering[][]>([]);
  const [melodyName, setMelodyName] = useState('');
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const { playNote, playMelody, stopMelody, isPlaying } = useAudio();

  const handleNotesSubmit = useCallback((rows: string[][], name: string) => {
    const melodyRows: NoteWithFingering[][] = [];
    for (const row of rows) {
      const rowNotes: NoteWithFingering[] = [];
      for (const note of row) {
        const data = getNoteData('germanG', note);
        if (data) rowNotes.push({ note, fingering: data.fingering, frequency: data.frequency });
      }
      if (rowNotes.length > 0) melodyRows.push(rowNotes);
    }
    setMelody(melodyRows);
    setMelodyName(name);
  }, []);

  const handleSelectMelody = useCallback((notes: string[], name: string, savedInputText: string) => {
    const text = savedInputText || (name ? `${name}\n${notes.join(' ')}` : notes.join(' '));
    setInputText(text);
    const { rows, name: parsedName } = parseInput(text, getAvailableNotes('germanG'));
    handleNotesSubmit(rows.length > 0 ? rows : [notes], parsedName || name);
    setShowLibrary(false);
  }, [handleNotesSubmit]);

  const flatMelody = melody.flat();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (flatMelody.length === 0) return;
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === ' ' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault();
        playNote(flatMelody[0].frequency, 1.2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatMelody, playNote]);

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

      <div className={styles.main}>
        {melody.length > 0 ? (
          <MelodyView melody={melody} onPlayNote={(freq) => playNote(freq, 1.2)} />
        ) : null}
      </div>

      {melody.length > 0 && (
        <div className={styles.toolbar}>
          <div className={styles.actions}>
            <button
              onClick={() => isPlaying ? stopMelody() : playMelody(flatMelody.map(n => n.frequency), 0.8, 0.2)}
              className={styles.playAllButton}
            >
              {isPlaying ? '■ Stop' : '▶ Play All'}
            </button>
            {user && (
              <SaveMelodyButton
                user={user}
                notes={flatMelody.map(n => n.note)}
                inputText={inputText}
                defaultName={melodyName}
              />
            )}
          </div>
        </div>
      )}

      <div className={styles.inputBar}>
        <NoteInput
          value={inputText}
          onChange={setInputText}
          onSubmit={handleNotesSubmit}
          recorderType="germanG"
          compact={melody.length > 0}
        />
      </div>

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
