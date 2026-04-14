import type { Fingering } from '../types';
import styles from './RecorderDiagram.module.css';

interface RecorderDiagramProps {
  fingering: Fingering;
  label?: string;
}

export default function RecorderDiagram({ fingering, label }: RecorderDiagramProps) {
  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <svg viewBox="0 0 120 280" className={styles.svg}>
        {/* Recorder body */}
        <rect x="35" y="10" width="50" height="260" rx="8" fill="#e8d5b7" stroke="#8b6914" strokeWidth="2" />
        
        {/* Mouthpiece */}
        <rect x="40" y="0" width="40" height="15" rx="3" fill="#c9a96e" stroke="#8b6914" strokeWidth="1" />

        {/* Thumb hole (back) */}
        <circle
          cx="60"
          cy="30"
          r="10"
          fill={fingering.thumb ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />

        {/* Left hand holes */}
        <circle
          cx="60"
          cy="70"
          r="10"
          fill={fingering.leftHand[0] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="105"
          r="10"
          fill={fingering.leftHand[1] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="140"
          r="10"
          fill={fingering.leftHand[2] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />

        {/* Right hand holes */}
        <circle
          cx="60"
          cy="180"
          r="10"
          fill={fingering.rightHand[0] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="215"
          r="10"
          fill={fingering.rightHand[1] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />
        <circle
          cx="60"
          cy="250"
          r="10"
          fill={fingering.rightHand[2] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />

        {/* Finger labels on left side */}
        <text x="20" y="33" fontSize="10" fill="#555">L0</text>
        <text x="20" y="73" fontSize="10" fill="#555">L1</text>
        <text x="20" y="108" fontSize="10" fill="#555">L2</text>
        <text x="20" y="143" fontSize="10" fill="#555">L3</text>
        <text x="20" y="183" fontSize="10" fill="#555">R1</text>
        <text x="20" y="218" fontSize="10" fill="#555">R2</text>
        <text x="20" y="253" fontSize="10" fill="#555">R3</text>

        {/* Pinky hole (extra bottom) */}
        <circle
          cx="60"
          cy="265"
          r="6"
          fill={fingering.rightHand[3] ? '#2c2c2c' : '#f5e6d0'}
          stroke="#8b6914"
          strokeWidth="1.5"
        />
        <text x="20" y="268" fontSize="8" fill="#555">R4</text>
      </svg>
    </div>
  );
}
