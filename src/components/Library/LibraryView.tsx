import { useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { loadMelodies, deleteMelody, type MelodyDoc } from '../../services/melodyService';
import styles from './LibraryView.module.css';

interface LibraryViewProps {
  user: User;
  onSelectMelody: (notes: string[], name: string) => void;
  onClose: () => void;
}

export default function LibraryView({ user, onSelectMelody, onClose }: LibraryViewProps) {
  const [melodies, setMelodies] = useState<MelodyDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMelodies = useCallback(async () => {
    setLoading(true);
    const data = await loadMelodies(user.uid);
    setMelodies(data);
    setLoading(false);
  }, [user.uid]);

  useEffect(() => {
    fetchMelodies();
  }, [fetchMelodies]);

  const handleDelete = async (id: string) => {
    await deleteMelody(user.uid, id);
    fetchMelodies();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>My Library</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : melodies.length === 0 ? (
          <p className={styles.empty}>No saved melodies yet.</p>
        ) : (
          <ul className={styles.list}>
            {melodies.map(m => (
              <li key={m.id} className={styles.item}>
                <div className={styles.itemInfo} onClick={() => onSelectMelody(m.notes, m.name)}>
                  <span className={styles.itemName}>{m.name}</span>
                  <span className={styles.itemNotes}>{m.notes.join(' · ')}</span>
                </div>
                <button onClick={() => handleDelete(m.id)} className={styles.deleteButton}>
                  🗑
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
