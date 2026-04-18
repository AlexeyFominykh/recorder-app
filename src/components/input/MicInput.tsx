import { useState, useRef, useCallback, useEffect } from 'react';
import { PitchDetector } from 'pitchy';
import { buildNoteFrequencyMap } from '../../utils/transpose';
import styles from './MicInput.module.css';

interface MicInputProps {
  onSubmit: (rows: string[][], name: string) => void;
  recorderType: string;
}

const SILENCE_THRESHOLD = 0.015;
const SILENCE_DURATION_MS = 150;
const MIN_NOTE_DURATION_MS = 60;
const CLARITY_THRESHOLD = 0.75;

export default function MicInput({ onSubmit, recorderType }: MicInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [notes, setNotes] = useState<string[]>([]);
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
    // Shift detected frequency by octaves to find best match in recorder range
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
    const medianFreq = sorted[Math.floor(sorted.length / 2)];
    const note = freqToNote(medianFreq);
    noteFreqsRef.current = [];
    noteStartRef.current = null;
    if (note) {
      const updated = [...notesRef.current, note];
      notesRef.current = updated;
      setNotes([...updated]);
    }
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
    const isSilent = rms < SILENCE_THRESHOLD;

    if (!isSilent) {
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
  }, [finalizeNote]);

  const stopListening = useCallback(() => {
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
      onSubmit([notesRef.current], '');
    }
  }, [finalizeNote, onSubmit]);

  const startListening = async () => {
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
      setNotes([]);
      silenceStartRef.current = null;
      noteStartRef.current = null;
      noteFreqsRef.current = [];

      setIsListening(true);
      rafRef.current = requestAnimationFrame(processFrame);
    } catch {
      // microphone access denied or unavailable
    }
  };

  const handleClear = () => {
    notesRef.current = [];
    setNotes([]);
    noteFreqsRef.current = [];
    noteStartRef.current = null;
    silenceStartRef.current = null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {!isListening ? (
          <button onClick={startListening} className={styles.recordButton}>
            🎤 Record
          </button>
        ) : (
          <button onClick={stopListening} className={styles.stopButton}>
            ■ Stop
          </button>
        )}

        {notes.length > 0 && (
          <button onClick={handleClear} className={styles.clearButton}>
            Clear
          </button>
        )}
      </div>
      <div className={styles.noteDisplay}>
        {isListening && notes.length === 0 && !liveNote && (
          <span className={styles.hint}>Напойте ноту, делайте паузы между нотами…</span>
        )}
        {notes.length > 0 && (
          <span className={styles.notes}>{notes.join(' ')}</span>
        )}
        {isListening && liveNote && (
          <span className={styles.liveNote}> → {liveNote}</span>
        )}
      </div>
    </div>
  );
}
