import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
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
  notes: string[]
): Promise<string | null> {
  try {
    const docRef = await addDoc(collection(db, 'users', userId, MELodies_COLLECTION), {
      name,
      notes,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving melody:', error);
    return null;
  }
}

export async function loadMelodies(userId: string): Promise<MelodyDoc[]> {
  try {
    const q = query(
      collection(db, 'users', userId, MELodies_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() ?? new Date(),
      updatedAt: doc.data().updatedAt?.toDate() ?? new Date(),
    })) as MelodyDoc[];
  } catch (error) {
    console.error('Error loading melodies:', error);
    return [];
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
