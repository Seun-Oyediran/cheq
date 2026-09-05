'use client';
import React, { useMemo } from 'react';
import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import { FRAME_D, FACE_D, type ColorScheme } from '@/lib/avatar-shapes';

// 4x4 Bayer matrix. An ordered threshold is what makes the falloff read as a
// dither pattern rather than as random scatter.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// The avatar is drawn on a 40-unit viewBox and rendered at 40px, so 20% of its
// original size is 8px — plus the 20% increase, 9.6px.
const MINI = 9.6;
const PITCH = 12;

/** How far the ring travels, in px from the avatar centre. */
export const PULSE_MAX_R = 272;

// The field has to cover everywhere the ring reaches, or it runs out of copies
// mid-sweep and the pattern ends on a hard edge. It is centred on the avatar,
// which sits high in the card, so it needs 2 * PULSE_MAX_R of height to reach
// the bottom — at 225px tall it was stopping right around the Customize button.
// Width only needs to cover the card (360px) plus a little, since anything
// wider is clipped by it. Height needs the ring's full diameter, because the
// avatar sits high in the card and the wave still has to reach the bottom.
const COLS = Math.ceil(384 / PITCH);
const ROWS = Math.ceil((PULSE_MAX_R * 2) / PITCH);

interface IProps {
  color: ColorScheme;
  /** 0 to 1, driven by whoever fires the pulse. Shared so surrounding
   *  elements can react to the wave front as it passes them. */
  progress: MotionValue<number>;
  /** How far this wave travels. Defaults to the full reach. */
  reach?: number;
  /** Overall intensity, 0 to 1. The trailing wave runs weaker. */
  strength?: number;
  /** How ragged the wave front is. 0 is a clean circle. */
  wobble?: number;
}

/**
 * A field of miniature avatars that a ring of light sweeps across once the
 * avatar lands.
 *
 * The field is always rendered; an expanding radial mask uncovers a band of it,
 * so the copies are revealed by the pulse passing over them rather than fading
 * in underneath it. One <symbol> is defined and referenced by <use>, so the
 * geometry is uploaded once rather than per copy.
 */
export function AvatarPulse(props: IProps) {
  const { color, progress, reach = PULSE_MAX_R, strength = 1, wobble = 1 } = props;

  const width = COLS * PITCH;
  const height = ROWS * PITCH;

  const cells = useMemo(() => {
    const out: Array<{ x: number; y: number; dim: number }> = [];
    const cx = (COLS * PITCH) / 2;
    const cy = (ROWS * PITCH) / 2;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const px = col * PITCH + PITCH / 2;
        const py = row * PITCH + PITCH / 2;
        // Distance in real pixels against the ring's reach, so the falloff does
        // not change shape when the grid's aspect does.
        const r = Math.hypot(px - cx, py - cy) / PULSE_MAX_R;
        // Shallow on purpose: a steep falloff empties the outer cells, so the
        // ring reaches the card edge with nothing left to reveal.
        const density = Math.max(0, 1 - r * 0.55) * (0.72 + Math.random() * 0.5);
        if (density < (BAYER[row % 4][col % 4] / 16) * 0.85) continue;
        out.push({
          x: px - MINI / 2,
          y: py - MINI / 2,
          dim: 0.55 + density * 0.45,
        });
      }
    }
    return out;
  }, []);

  // Built once per colour. Every glyph is the same shape, so one <symbol> is
  // defined and referenced; inside an image that costs nothing per frame, but
  // it keeps the URL short enough to stay well under any length limit.
  const fieldUrl = useMemo(() => {
    const uses = cells
      .map((c) => `<use href="#g" x="${c.x.toFixed(1)}" y="${c.y.toFixed(1)}" width="${MINI}" height="${MINI}" opacity="${c.dim.toFixed(2)}"/>`)
      .join('');
    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
      `<defs><symbol id="g" viewBox="0 0 40 40">` +
      // Frame and face as one path with evenodd, so the face is knocked out of
      // the frame. Drawn as two filled paths it reads as a solid block at 8px;
      // the cut-out keeps the avatar's silhouette legible.
      `<path d="${FRAME_D} ${FACE_D}" fill-rule="evenodd" fill="${color.borderFrom}"/>` +
      `</symbol></defs>${uses}</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }, [cells, color.borderFrom, width, height]);

  const maxR = reach;

  const inner = useTransform(progress, (v) => `${Math.max(0, v * maxR - 46)}px`);
  const mid = useTransform(progress, (v) => `${v * maxR}px`);
  const outer = useTransform(progress, (v) => `${v * maxR + 34}px`);
  const mask = useMotionTemplate`radial-gradient(circle at 50% 50%, transparent ${inner}, #000 ${mid}, transparent ${outer})`;
  const opacity = useTransform(progress, [0, 0.05, 0.85, 1], [0, strength, strength * 0.95, 0]);

  // The shockwave. The field alone reads as a texture change; a ring gives the
  // pulse a leading edge to follow, so it reads as something travelling.
  const ringSize = useTransform(progress, [0, 1], [40, maxR * 2]);
  // The front is not a clean circle. Each corner radius runs off its own
  // sine at a different frequency, so the outline never repeats itself over a
  // single sweep and the edge reads as a disturbance rather than a ring. The
  // amplitude eases off as it expands, so it settles rather than boiling.
  const ringRadius = useTransform(progress, (v) => {
    const amp = wobble * 7 * (1 - v * 0.55);
    const r = (phase: number, freq: number) => 50 + Math.sin(v * freq + phase) * amp;
    return (
      `${r(0, 9)}% ${r(1.7, 7)}% ${r(3.1, 11)}% ${r(4.6, 8)}% / ` +
      `${r(2.2, 8)}% ${r(0.6, 12)}% ${r(5.0, 6)}% ${r(3.7, 10)}%`
    );
  });
  const ringSpin = useTransform(progress, [0, 1], [0, 18 * wobble]);
  const ringOpacity = useTransform(progress, [0, 0.06, 0.6, 1], [0, strength, strength * 0.5, 0]);
  const ringWidth = useTransform(progress, [0, 1], [5, 1.5]);
  // The wave reads borderFrom — the avatar's own lightest tone — rather than a
  // separate token. There used to be a `pulse` colour on each scheme, but it
  // was derived from the eye hue, so the grey avatar threw a cyan wave and the
  // orange one a yellow-green. Reading the avatar's colour directly means the
  // two cannot drift, and the wave stays right through a colour change because
  // it is the same object the face is painted from.
  const ringBorder = useMotionTemplate`${ringWidth}px solid ${color.borderFrom}`;
  const ringGlow = useMotionTemplate`0 0 24px ${color.borderFrom}, 0 0 8px ${color.borderFrom}`;

  return (
    <>
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: ringRadius,
          rotate: ringSpin,
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
          border: ringBorder,
          boxShadow: ringGlow,
          opacity: ringOpacity,
        }}
      />
      {/* One <img>, not 1086 live <use> nodes.

          The field never changes once drawn — only the mask over it moves — but
          SVG has no per-node compositing, so an animated mask forced the whole
          subtree to re-rasterise every frame: 1086 shapes, 60 times a second.
          Measured under 6x CPU throttling it held the pulse at 31fps with 83ms
          frame spikes, and hiding this one element took it to 55fps; the ring
          beside it cost nothing. Baked into a data URL the browser rasterises
          it once and the mask animates over a single bitmap layer.

          The trade is that the tint no longer eases when the scheme changes
          under a wave in flight — the src swaps and re-decodes. The pulse fires
          on the colour change rather than across it, so that transition was
          almost never visible anyway. */}
      <motion.img
        aria-hidden
        alt=""
        src={fieldUrl}
        className="absolute pointer-events-none"
        style={{
          // Sized here rather than by attribute. `img { width: 100% }` in
          // _reset.scss is unlayered, so it overrode the width/height
          // attributes, and this element's parent is a zero-size point — the
          // field collapsed to 0x0 and vanished. An inline style outranks it.
          width,
          height,
          maxWidth: 'none',
          left: '50%',
          top: '50%',
          marginLeft: -width / 2,
          marginTop: -height / 2,
          opacity,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </>
  );
}

export interface PulseWave {
  progress: MotionValue<number>;
  /** How far this wave travels, in px. */
  reach: number;
  /** Intensity of the displacement it causes. */
  strength: number;
  /** Multiplier on the shear, so a wave can distort harder than it lifts. */
  distortion: number;
}

interface IWarpProps {
  waves: PulseWave[];
  /** Distance of this element from the pulse origin, in px. */
  distance: number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Distorts its children as the wave front passes over them.
 *
 * The displacement is a function of distance, not of time — each element reacts
 * when the ring actually reaches it, so things nearer the avatar move first and
 * the disturbance travels outward. It stretches unevenly (more vertically than
 * horizontally) and shears slightly, so the elements deform rather than simply
 * growing, which is what makes it read as a wave passing through them.
 */
export function PulseWarp(props: IWarpProps) {
  const { waves, distance, className, children } = props;

  const progresses = waves.map((w) => w.progress);

  // Each wave contributes where its own front is, so two waves passing at
  // different times displace the element twice rather than averaging into one
  // smeared push.
  const at = (v: number, w: PulseWave) =>
    Math.max(0, 1 - Math.abs(v * w.reach - distance) / 62) * w.strength;

  const lift = useTransform(progresses, (vals: number[]) =>
    vals.reduce((sum, v, i) => sum + at(v, waves[i]), 0)
  );
  const shear = useTransform(progresses, (vals: number[]) =>
    vals.reduce((sum, v, i) => sum + at(v, waves[i]) * waves[i].distortion, 0)
  );

  const scaleX = useTransform(lift, (x) => 1 + x * 0.07);
  const scaleY = useTransform(lift, (x) => 1 + x * 0.22);
  const skewX = useTransform(shear, (x) => x * -7);
  const y = useTransform(lift, (x) => -x * 5);

  return (
    <motion.div className={className} style={{ scaleX, scaleY, skewX, y }}>
      {children}
    </motion.div>
  );
}
