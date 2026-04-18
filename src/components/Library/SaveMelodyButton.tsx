import { useState } from 'react';
import type { User } from 'firebase/auth';
import { saveMelody } from '../../services/melodyService';
import styles from './SaveMelodyButton.module.css';

interface SaveMelodyButtonProps {
  user: User | null;
  notes: string[];
  inputText: string;
  defaultName?: string;
}

export default function SaveMelodyButton({ user, notes, inputText, defaultName = '' }: SaveMelodyButtonProps) {
  const [showInput, setShowInput] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    console.log('handleSave', { user: user?.uid, name, notes: notes.length });
    if (!user) { setError('Not signed in'); return; }
    if (!name.trim()) { setError('Name is empty'); return; }
    if (notes.length === 0) { setError('No notes'); return; }
    setSaving(true);
    setError('');
    try {
      const id = await saveMelody(user.uid, name.trim(), notes, inputText);
      setSaving(false);
      if (id) {
        setSaved(true);
        setShowInput(false);
        setName('');
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError('Failed to save');
      }
    } catch (e: any) {
      setSaving(false);
      setError(e?.message ?? 'Error saving');
    }
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
          onChange={e => { setName(e.target.value); setError(''); }}
          placeholder="Melody name"
          className={styles.input}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        <button onClick={handleSave} disabled={saving || !name.trim()} className={styles.confirmButton}>
          {saving ? '...' : 'Save'}
        </button>
        <button onClick={() => { setShowInput(false); setError(''); }} className={styles.cancelButton}>
          Cancel
        </button>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }

  return (
    <button onClick={() => { setName(defaultName); setShowInput(true); }} className={styles.saveButton}>
      💾 Save to Library
    </button>
  );
}
