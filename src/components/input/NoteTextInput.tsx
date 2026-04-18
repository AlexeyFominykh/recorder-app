import { useState } from 'react';
import { getAvailableNotes } from '../../data/fingerings';
import styles from './NoteInput.module.css';

interface NoteInputProps {
  onSubmit: (rows: string[][]) => void;
  recorderType: string;
  compact?: boolean;
}

function parseInputToRows(input: string, availableNotes: string[]): string[][] {
  const parseToken = (text: string): string[] => {
    const cleaned = text.replace(/[,']+/g, '');
    const regex = /([A-Ga-g])(#?)(\+?)(\d?)/g;
    const notes: string[] = [];
    let match;
    while ((match = regex.exec(cleaned)) !== null) {
      const letter = match[1].toUpperCase();
      const sharp = match[2];
      const plus = match[3];
      const digit = match[4];
      const octave = digit || (plus ? '6' : '5');
      const note = `${letter}${sharp}${octave}`;
      if (availableNotes.includes(note)) notes.push(note);
    }
    return notes;
  };

  const rows: string[][] = [];

  for (const line of input.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const tokens = trimmed.split(/\s+/).filter(Boolean);
    const tokenNotes = tokens.map(parseToken);
    const hasMultiNoteToken = tokenNotes.some(n => n.length > 1);

    if (hasMultiNoteToken) {
      for (const notes of tokenNotes) {
        if (notes.length > 0) rows.push(notes);
      }
    } else {
      const allNotes = tokenNotes.flat();
      if (allNotes.length > 0) rows.push(allNotes);
    }
  }

  return rows;
}

export default function NoteInput({ onSubmit, recorderType, compact = false }: NoteInputProps) {
  const [input, setInput] = useState('');
  const availableNotes = getAvailableNotes(recorderType);

  const submit = () => {
    const rows = parseInputToRows(input, availableNotes);
    if (rows.length > 0) onSubmit(rows);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={compact ? styles.containerCompact : styles.container}>
      {!compact && <h2>Enter Melody</h2>}
      <div className={styles.inputGroup}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? 'Edit notes…' : 'e.g., GABCDE or GAB CDE or G A B\nUse new lines or spaces between groups'}
          className={styles.input}
          rows={compact ? 2 : 3}
        />
        <button type="submit" className={styles.button}>
          {compact ? 'Update' : 'Show Fingerings'}
        </button>
      </div>
      {!compact && (
        <div className={styles.noteList}>
          <p>Available notes: {availableNotes.map(n => n.replace(/\d/, '')).join(', ')}</p>
          <p className={styles.hint}>Enter = new row · Ctrl+Enter = submit</p>
        </div>
      )}
    </form>
  );
}
