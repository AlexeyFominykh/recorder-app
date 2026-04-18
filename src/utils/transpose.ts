import { getAvailableNotes, getNoteData } from '../data/fingerings';

export function transposeNotes(notes: string[], semitones: number, recorderType: string): string[] | null {
  if (semitones === 0) return notes;
  const available = getAvailableNotes(recorderType);
  const result: string[] = [];
  for (const note of notes) {
    const idx = available.indexOf(note);
    if (idx === -1) return null;
    const newIdx = idx + semitones;
    if (newIdx < 0 || newIdx >= available.length) return null;
    result.push(available[newIdx]);
  }
  return result;
}

export function findBestTransposition(notes: string[], recorderType: string): number {
  const available = getAvailableNotes(recorderType);
  const indices = notes.map(n => available.indexOf(n)).filter(i => i !== -1);
  if (indices.length === 0) return 0;

  const minIdx = Math.min(...indices);
  const maxIdx = Math.max(...indices);
  const range = maxIdx - minIdx;

  if (range >= available.length) return 0;

  const idealMin = Math.floor((available.length - range) / 2);
  return idealMin - minIdx;
}

export function buildNoteFrequencyMap(recorderType: string): Array<{ note: string; freq: number }> {
  return getAvailableNotes(recorderType)
    .map(note => ({ note, freq: getNoteData(recorderType, note)?.frequency ?? 0 }))
    .filter(x => x.freq > 0);
}
