import { useRef, useCallback, useState } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((frequency: number, duration: number = 1) => {
    const ctx = getAudioContext();

    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch {}
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    oscillatorRef.current = oscillator;
  }, [getAudioContext]);

  const stopMelody = useCallback(() => {
    for (const id of timeoutsRef.current) clearTimeout(id);
    timeoutsRef.current = [];
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch {}
      oscillatorRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playMelody = useCallback((frequencies: number[], noteDuration: number = 0.8, gap: number = 0.2) => {
    stopMelody();
    setIsPlaying(true);

    const ids: number[] = [];
    frequencies.forEach((freq, i) => {
      const id = window.setTimeout(() => playNote(freq, noteDuration), i * (noteDuration + gap) * 1000);
      ids.push(id);
    });

    const finishId = window.setTimeout(() => setIsPlaying(false), frequencies.length * (noteDuration + gap) * 1000);
    ids.push(finishId);

    timeoutsRef.current = ids;
  }, [playNote, stopMelody]);

  return { playNote, playMelody, stopMelody, isPlaying };
}
