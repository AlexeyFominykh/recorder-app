export interface Fingering {
  thumb: FingeringState; // Back hole (left thumb), 'half' = pinched for 2nd octave
  leftHand: [FingeringState, FingeringState, FingeringState];  // [index, middle, ring]
  rightHand: [FingeringState, FingeringState, DoubleState, DoubleState]; // [index, middle, ring-double, pinky-double]
}

export type FingeringState = 'closed' | 'half' | 'open';
export type DoubleState = 0 | 1 | 2; // holes covered in double-hole pair

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
