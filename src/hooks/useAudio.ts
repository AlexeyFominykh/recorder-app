import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNote = useCallback((frequency: number, duration: number = 1) => {
    const ctx = getAudioContext();
    
    // Stop previous note if playing
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch {}
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Recorder-like envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    oscillatorRef.current = oscillator;
  }, [getAudioContext]);

  const playMelody = useCallback((frequencies: number[], noteDuration: number = 0.8, gap: number = 0.2) => {
    frequencies.forEach((freq, i) => {
      setTimeout(() => playNote(freq, noteDuration), i * (noteDuration + gap) * 1000);
    });
  }, [playNote]);

  return { playNote, playMelody };
}
