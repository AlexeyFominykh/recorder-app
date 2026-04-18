import type { Fingering } from '../types';
import RecorderDiagram from './RecorderDiagram';
import styles from './MelodyView.module.css';

interface NoteWithFingering {
  note: string;
  fingering: Fingering;
  frequency: number;
}

interface MelodyViewProps {
  melody: NoteWithFingering[][];
  onPlayNote: (frequency: number) => void;
}

export default function MelodyView({ melody, onPlayNote }: MelodyViewProps) {
  let counter = 0;
  return (
    <div className={styles.container}>
      {melody.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.rowGroup}>
          <div className={styles.row}>
            {row.map((item) => {
              const n = counter++;
              return (
                <button
                  key={n}
                  className={styles.noteItem}
                  onClick={() => onPlayNote(item.frequency)}
                >
                  <span className={styles.noteNumber}>{n + 1}</span>
                  <RecorderDiagram fingering={item.fingering} label={item.note} />
                </button>
              );
            })}
          </div>
          {rowIndex < melody.length - 1 && <div className={styles.separator} />}
        </div>
      ))}
    </div>
  );
}
