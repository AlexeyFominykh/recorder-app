import { useState } from 'react';
import { getAvailableNotes } from '../../data/fingerings';
import styles from './NoteInput.module.css';

interface NoteInputProps {
  onSubmit: (notes: string[]) => void;
  recorderType: string;
}

export default function NoteInput({ onSubmit, recorderType }: NoteInputProps) {
  const [input, setInput] = useState('');

  const availableNotes = getAvailableNotes(recorderType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Remove spaces, commas, apostrophes
    const cleaned = input.replace(/[\s,']+/g, '');
    // Parse notes: letter + optional sharp + optional octave digit
    const regex = /([A-Ga-g])(#?)(\d?)/g;
    const notes: string[] = [];
    let match;
    while ((match = regex.exec(cleaned)) !== null) {
      const letter = match[1].toUpperCase();
      const sharp = match[2];
      const octave = match[3] || '5';
      const note = `${letter}${sharp}${octave}`;
      if (availableNotes.includes(note)) {
        notes.push(note);
      }
    }

    if (notes.length > 0) {
      onSubmit(notes);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h2>Enter Melody</h2>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., GABCDE, gabcde, G#AC5D"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Show Fingerings
        </button>
      </div>
      <div className={styles.noteList}>
        <p>Available notes: {availableNotes.map(n => n.replace(/\d/, '')).join(', ')}</p>
      </div>
    </form>
  );
}
