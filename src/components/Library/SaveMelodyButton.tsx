import { useState } from 'react';
import type { User } from 'firebase/auth';
import { saveMelody } from '../../services/melodyService';
import styles from './SaveMelodyButton.module.css';

interface SaveMelodyButtonProps {
  user: User | null;
  notes: string[];
}

export default function SaveMelodyButton({ user, notes }: SaveMelodyButtonProps) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!user || !name.trim() || notes.length === 0) return;
    setSaving(true);
    await saveMelody(user.uid, name.trim(), notes);
    setSaving(false);
    setSaved(true);
    setShowInput(false);
    setName('');
    setTimeout(() => setSaved(false), 2000);
  };

  if (saved) {
    return <span className={styles.saved}>✓ Saved!</span>;
  }

  if (showInput) {
    return (
      <div className={styles.saveForm}>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Melody name"
          className={styles.input}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
        />
        <button onClick={handleSave} disabled={saving || !name.trim()} className={styles.confirmButton}>
          {saving ? '...' : 'Save'}
        </button>
        <button onClick={() => setShowInput(false)} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setShowInput(true)} className={styles.saveButton}>
      💾 Save to Library
    </button>
  );
}
