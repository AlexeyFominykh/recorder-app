import type { Fingering } from '../types';
import RecorderDiagram from './RecorderDiagram';
import styles from './FingeringDisplay.module.css';

interface FingeringDisplayProps {
  note: string;
  fingering: Fingering;
  currentIndex: number;
  totalNotes: number;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
}

export default function FingeringDisplay({
  note,
  fingering,
  currentIndex,
  totalNotes,
  onPrev,
  onNext,
  onPlay,
}: FingeringDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={styles.navButton}
        >
          ←
        </button>
        <div className={styles.noteInfo}>
          <span className={styles.noteName}>{note}</span>
          <span className={styles.counter}>{currentIndex + 1} / {totalNotes}</span>
        </div>
        <button
          onClick={onNext}
          disabled={currentIndex === totalNotes - 1}
          className={styles.navButton}
        >
          →
        </button>
      </div>
      
      <RecorderDiagram fingering={fingering} label={note} />
      
      <button onClick={onPlay} className={styles.playButton}>
        ▶ Play Note
      </button>
    </div>
  );
}
