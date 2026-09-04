'use client';
import React, { useId, useRef, useEffect } from 'react';
import { animate } from 'framer-motion';
import { FRAME_D, FACE_D, PATHS, IDLE_ANIMATIONS, type ColorScheme } from '@/lib/avatar-shapes';

/**
 * The avatar's own bounding box. The frame occupies 4..36 of the 40-unit
 * artboard, so cropping to it makes the element box the avatar — no margin of
 * air to make every downstream measurement lie about the size.
 */
export const FRAME_BOX = '4 4 32 32';

/**
 * Corner of the frame once cropped: the arc turns about (9,9) with radius 5 in
 * artboard units, which the 40/32 crop puts at 6.25 with radius 6.25 — centre
 * equal to radius, i.e. tangent to the box, as a rounded rect filling its box
 * should be. Anything drawn concentric with the avatar measures from here.
 */
export const FRAME_CORNER = 6.25;

/**
 * Thickness of the card as a fraction of its width, so it holds its proportion
 * at any size. Sliced finely enough that the side wall is solid rather than
 * banded when the card turns edge-on.
 */
export const CARD_DEPTH_RATIO = 6 / 40;
export const DEPTH_SLICES = 24;

export function AvatarFace({
  exprIdx,
  color,
  size,
}: {
  exprIdx: number;
  color: ColorScheme;
  size: number;
}) {
  const uid = useId();
  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const prevIdx = useRef(exprIdx);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const mouth = mouthRef.current;
    if (!left || !right || !mouth) return;

    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }

    const newPaths = PATHS[exprIdx];
    const idle = IDLE_ANIMATIONS[exprIdx];
    const changed = prevIdx.current !== exprIdx;
    prevIdx.current = exprIdx;

    const startIdle = () => {
      const cL = animate(
        left,
        { d: idle.left },
        { duration: idle.duration, times: idle.times, repeat: Infinity, ease: 'linear' }
      );
      const cR = animate(
        right,
        { d: idle.right },
        { duration: idle.duration, times: idle.times, repeat: Infinity, ease: 'linear' }
      );
      stopRef.current = () => {
        cL.stop();
        cR.stop();
      };
    };

    if (changed) {
      const cL = animate(left, { d: newPaths.left }, { duration: 0.4 });
      const cR = animate(right, { d: newPaths.right }, { duration: 0.4 });
      const cM = animate(mouth, { d: newPaths.mouth }, { duration: 0.4 });
      stopRef.current = () => {
        cL.stop();
        cR.stop();
        cM.stop();
      };
      void Promise.all([cL, cR, cM]).then(startIdle);
    } else {
      left.setAttribute('d', newPaths.left);
      right.setAttribute('d', newPaths.right);
      mouth.setAttribute('d', newPaths.mouth);
      startIdle();
    }

    return () => {
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
    };
  }, [exprIdx]);

  const fillId = `avatar-fill${uid}`;

  return (
    // Cropped to the frame's own bbox (it spans 4..36 of the 40-unit box)
    // rather than scaled up. With the backing plate gone the frame was the
    // silhouette but still carried the plate's 4-unit margin, so it sat inside
    // the rings instead of filling them. Cropping means the element box IS the
    // avatar, so the 40px chip, the 4x expand and the ring offsets all keep
    // measuring the thing that is actually drawn.
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
      </defs>
      {/* No backing plate. The avatar is the frame illustration alone, so the
          card behind it shows through the gaps between the frame and its
          bounding box. */}
      <path d={FRAME_D} fill={`url(#${fillId})`} />
      <path d={FACE_D} style={{ fill: color.bg, transition: 'fill 250ms ease 40ms' }} />
      <path ref={leftRef} style={{ fill: color.eye, transition: 'fill 250ms ease 40ms' }} />
      <path ref={rightRef} style={{ fill: color.eye, transition: 'fill 250ms ease 40ms' }} />
      <path ref={mouthRef} fill={`url(#${fillId})`} />
    </svg>
  );
}

interface SlabProps {
  color: ColorScheme;
  /** Rendered size in px. Depth scales with it, so the slab keeps its ratio. */
  size: number;
}

/**
 * The card's thickness: copies of the frame's silhouette stacked in Z between
 * the two faces. Not rounded boxes — with no backing plate behind the avatar
 * those read as a solid square sitting behind a cut-out. FRAME_D is a filled
 * shape (the face is punched out of it by the layer in front), so stacking it
 * gives the same extruded edge.
 *
 * Callers place the two faces at +/- depth / 2; these sit strictly between, and
 * must not be coplanar with either — a solid FRAME_D sharing a plane with the
 * front face wins the z-fight and hides the eyes.
 */
export function AvatarSlab({ color, size }: SlabProps) {
  const depth = size * CARD_DEPTH_RATIO;
  return (
    <>
      {Array.from({ length: DEPTH_SLICES }, (_, i) => {
        const t = (i + 1) / (DEPTH_SLICES + 1);
        return (
          <svg
            key={i}
            viewBox={FRAME_BOX}
            width={size}
            height={size}
            style={{
              position: 'absolute',
              inset: 0,
              transform: `translateZ(${depth / 2 - t * depth}px)`,
            }}
          >
            <path
              d={FRAME_D}
              style={{
                // The wall darkens toward the back. A flat fill reads as a
                // stack of identical cards; the falloff is what makes it a
                // side lit from the front. Mixed in oklab so the ramp stays
                // even rather than dipping through grey.
                fill: `color-mix(in oklab, ${color.gradientTo} ${(1 - t * 0.75) * 100}%, ${color.borderTo})`,
                transition: 'fill 250ms ease',
              }}
            />
          </svg>
        );
      })}
    </>
  );
}
