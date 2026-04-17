import type { Fingering } from '../types';
import RecorderDiagram from './RecorderDiagram';
import styles from './MelodyView.module.css';

interface NoteWithFingering {
  note: string;
  fingering: Fingering;
  frequency: number;
}

interface MelodyViewProps {
  melody: NoteWithFingering[];
  onPlayNote: (frequency: number) => void;
}

export default function MelodyView({ melody, onPlayNote }: MelodyViewProps) {
  return (
    <div className={styles.container}>
      {melody.map((item, i) => (
        <button
          key={i}
          className={styles.noteItem}
          onClick={() => onPlayNote(item.frequency)}
        >
          <span className={styles.noteNumber}>{i + 1}</span>
          <RecorderDiagram fingering={item.fingering} label={item.note} />
        </button>
      ))}
    </div>
  );
}
