'use client';
import React, { useId } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { FRAME_D, FACE_D, type ColorScheme } from '@/lib/avatar-shapes';

/** How far either side of the scheme's hue the fringes sit. */
const HUE_SPREAD = 55;
/** How far the fringes lag and lead the main band, in avatar units. */
const ABERRATION = 1.4;
/** Band width. Narrow reads as a specular highlight; wide reads as a wash. */
const BAND_W = 9;
/**
 * How far the highlight on the recessed face trails the one on the raised
 * frame, in avatar units. This is the whole depth cue: a single band laid flat
 * across both surfaces is what made the sweep read as a decal printed on the
 * avatar rather than light crossing something with relief. Two surfaces at
 * different heights cannot catch the same highlight at the same instant.
 */
const RECESS_PARALLAX = 2.4;
/** How much less light the sunken face returns than the frame facing the viewer. */
const RECESS_FALLOFF = 0.45;

interface IProps {
  color: ColorScheme;
  /** 0 to 1 across one sweep. */
  progress: MotionValue<number>;
}

/**
 * A holographic band that travels diagonally across the avatar.
 *
 * Three bands rather than one: the scheme's own hue in the middle, with hues
 * 55 degrees either side of it leading and trailing by ~2 units. That offset is
 * the chromatic aberration — the colour fringes separate at the edges of the
 * sweep and recombine in the middle, the way a lens splits light. They are
 * composited with `screen` so the overlap brightens toward white instead of
 * muddying, which is what makes it read as a sheen rather than three stripes.
 *
 * Clipped to the avatar's own frame path, so the highlight stops at the
 * silhouette — including its notches — rather than running into the panel.
 */
export function AvatarShimmer(props: IProps) {
  const { color, progress } = props;
  const uid = useId().replace(/:/g, '');
  const ringId = `shimmer-ring${uid}`;
  const faceId = `shimmer-face${uid}`;

  // Rotated 38 degrees, the frame projects 32 * (cos38 + sin38) = 44.9 units
  // onto the sweep axis, spanning -2.5 to 42.5 about the rotation centre. The
  // band starts a full width before that and ends past it, so it enters and
  // leaves off the silhouette entirely rather than appearing and vanishing
  // part-way across. These were the numbers for the old 40-unit plate; against
  // the cropped frame they left dead time at both ends of the sweep.
  const x = useTransform(progress, [0, 1], [-2.5 - BAND_W - ABERRATION, 42.5 + ABERRATION]);
  const xLead = useTransform(x, (v) => v - ABERRATION);
  const xTrail = useTransform(x, (v) => v + ABERRATION);
  // Peaks as the highlight crosses the middle rather than holding flat all the
  // way over, so the sweep has a moment of maximum rather than a plateau.
  const opacity = useTransform(progress, [0, 0.12, 0.5, 0.85, 1], [0, 0.82, 1, 0.82, 0]);

  const xRecessed = useTransform(x, (v) => v + RECESS_PARALLAX);
  const xLeadRecessed = useTransform(xLead, (v) => v + RECESS_PARALLAX);
  const xTrailRecessed = useTransform(xTrail, (v) => v + RECESS_PARALLAX);

  const bands = [
    {
      id: `g-lead${uid}`,
      hue: color.hue - HUE_SPREAD,
      x: xLead,
      xRecessed: xLeadRecessed,
      alpha: 0.75,
    },
    { id: `g-main${uid}`, hue: color.hue, x, xRecessed, alpha: 0.9 },
    {
      id: `g-trail${uid}`,
      hue: color.hue + HUE_SPREAD,
      x: xTrail,
      xRecessed: xTrailRecessed,
      alpha: 0.75,
    },
  ];

  return (
    <motion.svg
      aria-hidden
      className="absolute pointer-events-none"
      width={40}
      height={40}
      // Same crop as the face beneath it, so the two stay in register. The
      // path data and the rotation centre are still in the original units.
      viewBox="4 4 32 32"
      style={{ inset: 0, opacity }}
    >
      <defs>
        {/* The raised frame only — the face is knocked out of it with evenodd,
            so the two surfaces can be lit separately. */}
        <clipPath id={ringId}>
          <path d={`${FRAME_D} ${FACE_D}`} clipRule="evenodd" />
        </clipPath>
        <clipPath id={faceId}>
          <path d={FACE_D} />
        </clipPath>
        {bands.map((band) => (
          <linearGradient key={band.id} id={band.id} x1="0" y1="0" x2="1" y2="0">
            {/* A hot core with soft shoulders rather than a straight ramp to
                the middle. The linear version spread its energy evenly across
                the whole 9 units, which is a wash; concentrating it in the
                middle fifth is what reads as a polished surface catching the
                light. */}
            <stop offset="0" stopColor={`oklch(0.9 0.13 ${band.hue})`} stopOpacity="0" />
            <stop
              offset="0.36"
              stopColor={`oklch(0.9 0.13 ${band.hue})`}
              stopOpacity={band.alpha * 0.22}
            />
            <stop offset="0.5" stopColor={`oklch(0.97 0.08 ${band.hue})`} stopOpacity={band.alpha} />
            <stop
              offset="0.64"
              stopColor={`oklch(0.9 0.13 ${band.hue})`}
              stopOpacity={band.alpha * 0.22}
            />
            <stop offset="1" stopColor={`oklch(0.9 0.13 ${band.hue})`} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <g transform="rotate(-38 20 20)">
        {/* Frame: the surface facing the viewer, lit in full. */}
        <g clipPath={`url(#${ringId})`}>
          {bands.map((band) => (
            <motion.rect
              key={band.id}
              x={band.x}
              y={-24}
              width={BAND_W}
              height={88}
              fill={`url(#${band.id})`}
              style={{ mixBlendMode: 'screen' }}
            />
          ))}
        </g>
        {/* Face: set back, so its highlight trails the frame's and returns less
            light. The lag is what makes the two surfaces separate in depth —
            the sweep crosses the frame, then catches the face a moment later. */}
        <g clipPath={`url(#${faceId})`} opacity={RECESS_FALLOFF}>
          {bands.map((band) => (
            <motion.rect
              key={band.id}
              x={band.xRecessed}
              y={-24}
              width={BAND_W}
              height={88}
              fill={`url(#${band.id})`}
              style={{ mixBlendMode: 'screen' }}
            />
          ))}
        </g>
      </g>
    </motion.svg>
  );
}
