import type { Fingering, FingeringState, DoubleState } from '../types';
import styles from './RecorderDiagram.module.css';

interface RecorderDiagramProps {
  fingering: Fingering;
  label?: string;
}

const STROKE = '#222';

const stateFill = (state: FingeringState) => {
  if (state === 'closed') return '#222';
  if (state === 'half') return '#999';
  return 'white';
};

const doubleFill = (state: DoubleState, side: 'left' | 'right') => {
  if (state === 2) return '#222';
  if (state === 1 && side === 'left') return '#222';
  return 'white';
};

export default function RecorderDiagram({ fingering, label }: RecorderDiagramProps) {
  const cx = 20;
  const bx1 = 18;
  const bx2 = 22;

  const rNormal = 5;
  const rThumb = 3.5;
  const rDouble = 3.5;
  const dOffset = 4.5;

  const thumbY = 11;
  const leftY = [28, 43, 58];
  const rightY = [78, 93];
  const doubleY = [114, 130];

  const div = (y: number) => (
    <line x1="12" y1={y} x2="28" y2={y} stroke={STROKE} strokeWidth="1" />
  );

  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <svg viewBox="0 0 40 148" className={styles.svg}>
        {/* Body */}
        <line x1={bx1} y1="0" x2={bx1} y2="146" stroke={STROKE} strokeWidth="1.2" />
        <line x1={bx2} y1="0" x2={bx2} y2="146" stroke={STROKE} strokeWidth="1.2" />

        {/* Thumb hole (back, smaller) */}
        <circle cx={cx} cy={thumbY} r={rThumb}
                fill={stateFill(fingering.thumb)}
                stroke={STROKE} strokeWidth="1.2" />

        {div(19)}

        {/* Left hand L1–L3 */}
        {fingering.leftHand.map((state, i) => (
          <circle key={`l${i}`} cx={cx} cy={leftY[i]} r={rNormal}
                  fill={stateFill(state)}
                  stroke={STROKE} strokeWidth="1.2" />
        ))}

        {div(67)}

        {/* Right hand R1–R2 */}
        {(fingering.rightHand.slice(0, 2) as FingeringState[]).map((state, i) => (
          <circle key={`r${i}`} cx={cx} cy={rightY[i]} r={rNormal}
                  fill={stateFill(state)}
                  stroke={STROKE} strokeWidth="1.2" />
        ))}

        {div(103)}

        {/* R3, R4 — double holes side by side */}
        {(fingering.rightHand.slice(2) as DoubleState[]).map((state, i) => (
          <g key={`d${i}`}>
            <circle cx={cx - dOffset} cy={doubleY[i]} r={rDouble}
                    fill={doubleFill(state, 'left')}
                    stroke={STROKE} strokeWidth="1.2" />
            <circle cx={cx + dOffset} cy={doubleY[i]} r={rDouble}
                    fill={doubleFill(state, 'right')}
                    stroke={STROKE} strokeWidth="1.2" />
          </g>
        ))}
      </svg>
    </div>
  );
}
