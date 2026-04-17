import type { Fingering } from '../../types';

// German fingering soprano recorder in C
// FingeringState: 'closed' | 'half' | 'open'
// DoubleState:    0 = both open, 1 = left covered, 2 = both covered
// thumb 'half' = pinched (vent hole, enables 2nd register overtone)
//
// Key German system characteristic:
//   F5  = R1 closed, R2 open (easy natural F)
//   F#5 = cross-fingering (harder in German vs Baroque)

export const germanGFingerings: Record<string, Fingering> = {
  // ── First register ────────────────────────────────────────────────
  'C5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 2, 2] },
  'C#5': { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 2, 1] },
  'D5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 2, 0] },
  'D#5': { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 1, 0] },
  'E5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 0, 0] },
  'F5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'open',   0, 0] },
  'F#5': { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['open',   'open',   2, 0] },
  'G5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'closed'], rightHand: ['open',   'open',   0, 0] },
  'G#5': { thumb: 'closed', leftHand: ['closed', 'closed', 'open'],   rightHand: ['closed', 'open',   0, 0] },
  'A5':  { thumb: 'closed', leftHand: ['closed', 'closed', 'open'],   rightHand: ['open',   'open',   0, 0] },
  'A#5': { thumb: 'closed', leftHand: ['closed', 'open',   'closed'], rightHand: ['open',   'open',   0, 0] },
  'B5':  { thumb: 'closed', leftHand: ['closed', 'open',   'open'],   rightHand: ['open',   'open',   0, 0] },
  'C6':  { thumb: 'closed', leftHand: ['open',   'open',   'open'],   rightHand: ['open',   'open',   0, 0] },

  // ── Second register (thumb pinched) ───────────────────────────────
  'C#6': { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 2, 1] },
  'D6':  { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 2, 0] },
  'D#6': { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 1, 0] },
  'E6':  { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'closed', 0, 0] },
  'F6':  { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['closed', 'open',   0, 0] },
  'F#6': { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['open',   'open',   2, 0] },
  'G6':  { thumb: 'half',   leftHand: ['closed', 'closed', 'closed'], rightHand: ['open',   'open',   0, 0] },
  'G#6': { thumb: 'half',   leftHand: ['closed', 'closed', 'open'],   rightHand: ['closed', 'open',   0, 0] },
  'A6':  { thumb: 'half',   leftHand: ['closed', 'closed', 'open'],   rightHand: ['open',   'open',   0, 0] },
  'A#6': { thumb: 'half',   leftHand: ['closed', 'open',   'closed'], rightHand: ['open',   'open',   0, 0] },
  'B6':  { thumb: 'half',   leftHand: ['closed', 'open',   'open'],   rightHand: ['open',   'open',   0, 0] },
  'C7':  { thumb: 'half',   leftHand: ['open',   'open',   'open'],   rightHand: ['open',   'open',   0, 0] },
  'D7':  { thumb: 'open',   leftHand: ['closed', 'open',   'closed'], rightHand: ['closed', 'closed', 2, 0] },
};

export const germanGFrequencies: Record<string, number> = {
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
  'D#6': 1244.51,
  'E6':  1318.51,
  'F6':  1396.91,
  'F#6': 1479.98,
  'G6':  1567.98,
  'G#6': 1661.22,
  'A6':  1760.00,
  'A#6': 1864.66,
  'B6':  1975.53,
  'C7':  2093.00,
  'D7':  2349.32,
};
