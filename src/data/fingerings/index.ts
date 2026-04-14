import type { RecorderConfig } from '../../types';
import { germanGFingerings, germanGFrequencies } from './germanG';

export const recorderConfigs: Record<string, RecorderConfig> = {
  germanG: {
    type: 'germanG',
    name: 'German G Soprano',
    fingerings: germanGFingerings,
    frequencies: germanGFrequencies,
  },
  // Future: baroqueC, altoF, tenorC
};

export function getNoteData(
  recorderType: string,
  note: string
): { fingering: import('../../types').Fingering; frequency: number } | null {
  const config = recorderConfigs[recorderType];
  if (!config) return null;

  const fingering = config.fingerings[note];
  const frequency = config.frequencies[note];

  if (!fingering || !frequency) return null;

  return { fingering, frequency };
}

export function getAvailableNotes(recorderType: string): string[] {
  const config = recorderConfigs[recorderType];
  if (!config) return [];
  return Object.keys(config.fingerings);
}
