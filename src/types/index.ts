export interface Fingering {
  thumb: boolean;       // Back hole (left thumb)
  leftHand: [boolean, boolean, boolean];  // [index, middle, ring]
  rightHand: [boolean, boolean, boolean, boolean]; // [index, middle, ring, pinky]
}

export interface NoteData {
  note: string;
  fingering: Fingering;
  frequency: number;
}

export interface Melody {
  id: string;
  name: string;
  notes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type RecorderType = 'germanG' | 'baroqueC' | 'altoF' | 'tenorC';

export interface RecorderConfig {
  type: RecorderType;
  name: string;
  fingerings: Record<string, Fingering>;
  frequencies: Record<string, number>;
}
