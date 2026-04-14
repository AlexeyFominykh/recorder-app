import type { Fingering } from '../../types';

// German G soprano recorder fingerings
// true = hole covered, false = hole open
// thumb = back hole (left thumb)
// leftHand = [index, middle, ring] (top 3 holes)
// rightHand = [index, middle, ring, pinky] (bottom 4 holes)

export const germanGFingerings: Record<string, Fingering> = {
  'G4':  { thumb: true,  leftHand: [true,  true,  true],  rightHand: [true,  true,  true,  true]  },  // All holes
  'G#4': { thumb: true,  leftHand: [true,  true,  true],  rightHand: [true,  true,  true,  false] },
  'A4':  { thumb: true,  leftHand: [true,  true,  true],  rightHand: [true,  true,  false, false] },
  'A#4': { thumb: true,  leftHand: [true,  true,  true],  rightHand: [true,  false, false, false] },
  'B4':  { thumb: true,  leftHand: [true,  true,  true],  rightHand: [false, false, false, false] },
  'C5':  { thumb: true,  leftHand: [true,  true,  false], rightHand: [false, false, false, false] },
  'C#5': { thumb: true,  leftHand: [true,  false, true],  rightHand: [true,  false, false, false] },
  'D5':  { thumb: true,  leftHand: [true,  true,  false], rightHand: [true,  false, false, false] },
  'D#5': { thumb: true,  leftHand: [true,  false, true],  rightHand: [false, false, false, false] },
  'E5':  { thumb: true,  leftHand: [true,  false, false], rightHand: [false, false, false, false] },
  'F5':  { thumb: true,  leftHand: [false, true,  true],  rightHand: [true,  false, false, false] },
  'F#5': { thumb: true,  leftHand: [false, true,  false], rightHand: [true,  false, false, false] },
  'G5':  { thumb: true,  leftHand: [false, true,  false], rightHand: [false, false, false, false] },
  'G#5': { thumb: true,  leftHand: [true,  false, false], rightHand: [true,  false, false, false] },
  'A5':  { thumb: true,  leftHand: [true,  false, false], rightHand: [false, false, false, false] },
  'A#5': { thumb: false, leftHand: [true,  true,  true],  rightHand: [false, false, false, false] },
  'B5':  { thumb: false, leftHand: [true,  true,  false], rightHand: [false, false, false, false] },
  'C6':  { thumb: false, leftHand: [false, true,  false], rightHand: [false, false, false, false] },
  'C#6': { thumb: false, leftHand: [false, false, true],  rightHand: [false, false, false, false] },
  'D6':  { thumb: false, leftHand: [false, false, false], rightHand: [false, false, false, false] },  // All open
};

export const germanGFrequencies: Record<string, number> = {
  'G4':  392.00,
  'G#4': 415.30,
  'A4':  440.00,
  'A#4': 466.16,
  'B4':  493.88,
  'C5':  523.25,
  'C#5': 554.37,
  'D5':  587.33,
  'D#5': 622.25,
  'E5':  659.25,
  'F5':  698.46,
  'F#5': 739.99,
  'G5':  783.99,
  'G#5': 830.61,
  'A5':  880.00,
  'A#5': 932.33,
  'B5':  987.77,
  'C6':  1046.50,
  'C#6': 1108.73,
  'D6':  1174.66,
};
