'use client';
import React, { useId, useMemo } from 'react';
import { FRAME_D, type ColorScheme } from '@/lib/avatar-shapes';
import { FRAME_BOX } from './avatar-face';

/** Modules across. 21 is a QR version 1 grid, which is what this is shaped after. */
const MODULES = 21;
/** The matrix's box inside the 40-unit artboard, leaving a quiet zone in the frame. */
const CODE_ORIGIN = 9;
const CODE_SPAN = 22;
const CELL = CODE_SPAN / MODULES;
/** Corner finder patterns, in modules. */
const FINDER = 5;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Which cells the three corner finders and their separators occupy. */
function inFinder(col: number, row: number) {
  const near = (a: number, b: number) => a <= FINDER && b <= FINDER;
  return (
    near(col, row) ||
    near(MODULES - 1 - col, row) ||
    near(col, MODULES - 1 - row)
  );
}

function finderCells(ox: number, oy: number): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let r = 0; r < FINDER; r++) {
    for (let c = 0; c < FINDER; c++) {
      const ring = r === 0 || c === 0 || r === FINDER - 1 || c === FINDER - 1;
      const centre = r === 2 && c === 2;
      if (ring || centre) out.push([ox + c, oy + r]);
    }
  }
  return out;
}

interface IProps {
  color: ColorScheme;
  size: number;
  /** Seeds the matrix, so the same invite always draws the same code. */
  seed: string;
}

/**
 * The card's other side: an invite code in the avatar's own silhouette, so the
 * turn reads as one object showing its back rather than a panel replacing it.
 *
 * The matrix is decorative — deterministic from `seed`, with the three corner
 * finders a real code would have, but not encoding anything scannable. It sits
 * alongside the rest of the prototype's stand-in data (the address below it is
 * equally invented); wiring a real encoder is a dependency away if this needs
 * to actually resolve.
 */
export function AvatarBarcode({ color, size, seed }: IProps) {
  const uid = useId().replace(/:/g, '');
  const fillId = `code-fill${uid}`;
  const clipId = `code-clip${uid}`;

  const cells = useMemo(() => {
    const rnd = mulberry32(hash(seed));
    const out: Array<[number, number]> = [];
    for (let row = 0; row < MODULES; row++) {
      for (let col = 0; col < MODULES; col++) {
        if (inFinder(col, row)) continue;
        if (rnd() < 0.46) out.push([col, row]);
      }
    }
    out.push(...finderCells(0, 0));
    out.push(...finderCells(MODULES - FINDER, 0));
    out.push(...finderCells(0, MODULES - FINDER));
    return out;
  }, [seed]);

  return (
    <svg viewBox={FRAME_BOX} width={size} height={size}>
      <defs>
        <linearGradient id={fillId} x1="20" x2="20" y1="-3" y2="40" gradientUnits="userSpaceOnUse">
          <stop
            offset="0.299"
            style={{ stopColor: color.gradientFrom, transition: 'stop-color 250ms ease' }}
          />
          <stop
            offset="1"
            style={{ stopColor: color.gradientTo, transition: 'stop-color 250ms ease' }}
          />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={FRAME_D} />
        </clipPath>
      </defs>
      <path d={FRAME_D} fill={`url(#${fillId})`} />
      <g clipPath={`url(#${clipId})`}>
        {cells.map(([col, row]) => (
          <rect
            key={`${col}-${row}`}
            x={CODE_ORIGIN + col * CELL}
            y={CODE_ORIGIN + row * CELL}
            width={CELL}
            height={CELL}
            rx={CELL * 0.28}
            style={{ fill: color.bg, transition: 'fill 250ms ease' }}
          />
        ))}
      </g>
    </svg>
  );
}
