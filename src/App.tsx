import { useState, useCallback, useEffect } from 'react';
import NoteInput, { parseInput, toDisplayNote } from './components/input/NoteTextInput';
import MelodyView from './components/MelodyView';
import GoogleSignIn from './components/Auth/GoogleSignIn';
import LibraryView from './components/Library/LibraryView';
import SaveMelodyButton from './components/Library/SaveMelodyButton';
import { getNoteData, getAvailableNotes } from './data/fingerings';
import { transposeNotes, findBestTransposition } from './utils/transpose';
import { useAudio } from './hooks/useAudio';
import type { Fingering } from './types';
import type { User } from 'firebase/auth';
import styles from './App.module.css';

interface NoteWithFingering {
  note: string;
  fingering: Fingering;
  frequency: number;
}

function buildMelody(rows: string[][]): NoteWithFingering[][] {
  return rows
    .map(row =>
      row.flatMap(note => {
        const data = getNoteData('germanG', note);
        return data ? [{ note, fingering: data.fingering, frequency: data.frequency }] : [];
      })
    )
    .filter(r => r.length > 0);
}

function App() {
  const [melody, setMelody] = useState<NoteWithFingering[][]>([]);
  const [melodyName, setMelodyName] = useState('');
  const [inputText, setInputText] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const { playNote, playMelody, stopMelody, isPlaying } = useAudio();

  const handleNotesSubmit = useCallback((rows: string[][], name: string) => {
    setMelody(buildMelody(rows));
    setMelodyName(name);
  }, []);

  const handleSelectMelody = useCallback((notes: string[], name: string, savedInputText: string) => {
    const text = savedInputText || (name ? `${name}\n${notes.join(' ')}` : notes.join(' '));
    setInputText(text);
    const { rows, name: parsedName } = parseInput(text, getAvailableNotes('germanG'));
    handleNotesSubmit(rows.length > 0 ? rows : [notes], parsedName || name);
    setShowLibrary(false);
  }, [handleNotesSubmit]);

  const handleTranspose = useCallback((semitones: number) => {
    const flatNotes = melody.flat().map(n => n.note);
    const transposed = transposeNotes(flatNotes, semitones, 'germanG');
    if (!transposed) return;
    setMelody(buildMelody([transposed]));
    const display = transposed.map(toDisplayNote).join(' ');
    setInputText(melodyName ? `${melodyName}\n${display}` : display);
  }, [melody, melodyName]);

  const handleAutoTranspose = useCallback(() => {
    const flatNotes = melody.flat().map(n => n.note);
    const shift = findBestTransposition(flatNotes, 'germanG');
    if (shift !== 0) handleTranspose(shift);
  }, [melody, handleTranspose]);

  const flatMelody = melody.flat();

  const canTransposeDown = flatMelody.length > 0 &&
    transposeNotes(flatMelody.map(n => n.note), -1, 'germanG') !== null;
  const canTransposeUp = flatMelody.length > 0 &&
    transposeNotes(flatMelody.map(n => n.note), 1, 'germanG') !== null;

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
          <div className={styles.transposeControls}>
            <span className={styles.transposeLabel}>Тональность:</span>
            <button
              onClick={() => handleTranspose(-1)}
              disabled={!canTransposeDown}
              className={styles.transposeButton}
              title="−1 полутон"
            >−1</button>
            <button
              onClick={handleAutoTranspose}
              className={styles.transposeButton}
              title="Подобрать автоматически"
            >Auto</button>
            <button
              onClick={() => handleTranspose(1)}
              disabled={!canTransposeUp}
              className={styles.transposeButton}
              title="+1 полутон"
            >+1</button>
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
