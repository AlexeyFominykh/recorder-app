import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Melody } from '../types';

const MELodies_COLLECTION = 'melodies';

export interface MelodyDoc extends Melody {
  id: string;
}

export async function saveMelody(
  userId: string,
  name: string,
  notes: string[],
  inputText?: string,
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, MELodies_COLLECTION), {
      name,
      notes,
      inputText: inputText ?? '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving melody:', error);
    throw error;
  }
}

export async function loadMelodies(userId: string): Promise<MelodyDoc[]> {
  try {
    const q = query(
      collection(db, 'users', userId, MELodies_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toDate() ?? new Date(),
      updatedAt: d.data().updatedAt?.toDate() ?? new Date(),
      lastOpenedAt: d.data().lastOpenedAt?.toDate() ?? undefined,
      inputText: d.data().inputText ?? undefined,
    })) as MelodyDoc[];
    return docs.sort((a, b) => {
      const aTime = (a.lastOpenedAt ?? a.createdAt).getTime();
      const bTime = (b.lastOpenedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error loading melodies:', error);
    return [];
  }
}

export async function updateLastOpened(userId: string, melodyId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId, MELodies_COLLECTION, melodyId), {
      lastOpenedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating lastOpenedAt:', error);
  }
}

export async function deleteMelody(userId: string, melodyId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'users', userId, MELodies_COLLECTION, melodyId));
    return true;
  } catch (error) {
    console.error('Error deleting melody:', error);
    return false;
  }
}
