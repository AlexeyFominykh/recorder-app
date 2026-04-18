import { getAvailableNotes } from '../../data/fingerings';
import styles from './NoteInput.module.css';

interface NoteInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (rows: string[][], name: string) => void;
  recorderType: string;
  compact?: boolean;
}

export function parseInput(input: string, availableNotes: string[]): { rows: string[][], name: string } {
  const parseToken = (text: string): string[] => {
    const cleaned = text.replace(/[,']+/g, '').replace(/[Hh]/g, 'B');
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

  const parseLineToRows = (line: string): string[][] => {
    const trimmed = line.trim();
    if (!trimmed) return [];
    const tokens = trimmed.split(/\s+/).filter(Boolean);
    const tokenNotes = tokens.map(parseToken);
    const hasMultiNoteToken = tokenNotes.some(n => n.length > 1);
    if (hasMultiNoteToken) {
      return tokenNotes.filter(n => n.length > 0);
    }
    const allNotes = tokenNotes.flat();
    return allNotes.length > 0 ? [allNotes] : [];
  };

  const lines = input.split('\n');
  let name = '';
  let startIndex = 0;

  if (lines.length > 0) {
    const firstTrimmed = lines[0].trim();
    if (firstTrimmed && parseToken(firstTrimmed).length === 0) {
      name = firstTrimmed;
      startIndex = 1;
    }
  }

  const rows: string[][] = [];
  for (let i = startIndex; i < lines.length; i++) {
    rows.push(...parseLineToRows(lines[i]));
  }

  return { rows, name };
}

export default function NoteInput({ value, onChange, onSubmit, recorderType, compact = false }: NoteInputProps) {
  const availableNotes = getAvailableNotes(recorderType);

  const submit = () => {
    const { rows, name } = parseInput(value, availableNotes);
    if (rows.length > 0) onSubmit(rows, name);
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? 'Edit notes…' : 'Song name (optional)\nGABCDE or GAB CDE or G A B'}
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
