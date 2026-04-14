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
    const notes = input
      .trim()
      .split(/\s+/)
      .map(n => n.replace(/[',]/g, ''))
      .filter(n => availableNotes.includes(n));
    
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
          placeholder="e.g., G4 A4 B4 C5 D5"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Show Fingerings
        </button>
      </div>
      <div className={styles.noteList}>
        <p>Available notes: {availableNotes.join(', ')}</p>
      </div>
    </form>
  );
}
