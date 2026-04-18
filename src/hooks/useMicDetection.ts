import { useState, useRef, useCallback, useEffect } from 'react';
import { PitchDetector } from 'pitchy';
import { buildNoteFrequencyMap } from '../utils/transpose';

const SILENCE_THRESHOLD = 0.015;
const SILENCE_DURATION_MS = 250;
const MIN_NOTE_DURATION_MS = 60;
const CLARITY_THRESHOLD = 0.75;

export function useMicDetection(recorderType: string, onDone: (notes: string[]) => void) {
  const [isListening, setIsListening] = useState(false);
  const [liveNote, setLiveNote] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const detectorRef = useRef<PitchDetector<Float32Array> | null>(null);
  const bufferRef = useRef<Float32Array | null>(null);
  const rafRef = useRef<number | null>(null);

  const silenceStartRef = useRef<number | null>(null);
  const noteStartRef = useRef<number | null>(null);
  const noteFreqsRef = useRef<number[]>([]);
  const notesRef = useRef<string[]>([]);
  const freqMapRef = useRef<Array<{ note: string; freq: number }>>([]);

  useEffect(() => {
    freqMapRef.current = buildNoteFrequencyMap(recorderType);
  }, [recorderType]);

  const freqToNote = useCallback((freq: number): string | null => {
    if (!freq || freq <= 0) return null;
    let best: string | null = null;
    let bestDist = Infinity;
    for (const { note, freq: nf } of freqMapRef.current) {
      const octaves = Math.round(Math.log2(nf / freq));
      const shifted = freq * Math.pow(2, octaves);
      const dist = Math.abs(Math.log2(nf / shifted));
      if (dist < bestDist) { bestDist = dist; best = note; }
    }
    return bestDist < 0.5 / 12 ? best : null;
  }, []);

  const finalizeNote = useCallback(() => {
    if (noteFreqsRef.current.length === 0 || !noteStartRef.current) return;
    const sorted = [...noteFreqsRef.current].sort((a, b) => a - b);
    const note = freqToNote(sorted[Math.floor(sorted.length / 2)]);
    noteFreqsRef.current = [];
    noteStartRef.current = null;
    if (note) notesRef.current = [...notesRef.current, note];
  }, [freqToNote]);

  const processFrame = useCallback(() => {
    const analyser = analyserRef.current;
    const detector = detectorRef.current;
    const buffer = bufferRef.current;
    const audioCtx = audioCtxRef.current;
    if (!analyser || !detector || !buffer || !audioCtx) return;

    analyser.getFloatTimeDomainData(buffer);
    let rms = 0;
    for (const v of buffer) rms += v * v;
    rms = Math.sqrt(rms / buffer.length);

    const now = performance.now();

    if (rms >= SILENCE_THRESHOLD) {
      silenceStartRef.current = null;
      if (!noteStartRef.current) noteStartRef.current = now;
      const [pitch, clarity] = detector.findPitch(buffer, audioCtx.sampleRate);
      if (clarity >= CLARITY_THRESHOLD && pitch > 0) {
        noteFreqsRef.current.push(pitch);
        setLiveNote(freqToNote(pitch));
      }
    } else {
      if (!silenceStartRef.current) silenceStartRef.current = now;
      const silenceDuration = now - silenceStartRef.current;
      const noteDuration = noteStartRef.current ? silenceStartRef.current - noteStartRef.current : 0;
      if (silenceDuration >= SILENCE_DURATION_MS && noteDuration >= MIN_NOTE_DURATION_MS) {
        setLiveNote(null);
        finalizeNote();
      }
    }

    rafRef.current = requestAnimationFrame(processFrame);
  }, [finalizeNote, freqToNote]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setLiveNote(null);
    finalizeNote();
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioCtxRef.current?.close();
    streamRef.current = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    if (notesRef.current.length > 0) {
      onDone(notesRef.current);
      notesRef.current = [];
    }
  }, [finalizeNote, onDone]);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      bufferRef.current = new Float32Array(analyser.fftSize);
      detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize);
      notesRef.current = [];
      silenceStartRef.current = null;
      noteStartRef.current = null;
      noteFreqsRef.current = [];
      setIsListening(true);
      rafRef.current = requestAnimationFrame(processFrame);
    } catch {
      // microphone access denied
    }
  }, [processFrame]);

  return { isListening, liveNote, start, stop };
}
