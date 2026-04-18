import { useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { loadMelodies, deleteMelody, updateLastOpened, type MelodyDoc } from '../../services/melodyService';
import styles from './LibraryView.module.css';

interface LibraryViewProps {
  user: User;
  onSelectMelody: (notes: string[], name: string, inputText: string) => void;
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

  const handleSelect = async (m: MelodyDoc) => {
    await updateLastOpened(user.uid, m.id);
    onSelectMelody(m.notes, m.name, m.inputText ?? '');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteMelody(user.uid, id);
    setMelodies(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>My Library</h2>
          <button onClick={onClose} className={styles.closeButton}>✕</button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <p className={styles.empty}>Loading...</p>
          ) : melodies.length === 0 ? (
            <p className={styles.empty}>No saved melodies yet.</p>
          ) : (
            <ul className={styles.list}>
              {melodies.map(m => (
                <li key={m.id} className={styles.item} onClick={() => handleSelect(m)}>
                  <span className={styles.itemName}>{m.name}</span>
                  <button
                    onClick={(e) => handleDelete(m.id, e)}
                    className={styles.deleteButton}
                    title="Delete"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
