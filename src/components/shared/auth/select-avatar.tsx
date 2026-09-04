'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import {
  motion,
  animate,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { useAppContext } from '@/state/context';
import { Button } from '@/components/ui';
import { updateAuthModal } from '@/state/reducer';
import { Back, Close } from '../svgs/icons';
import { AuthIconButton } from './auth-icon-button';
import { AuthCtaContent } from './auth-cta-content';
import { AvatarPulse, PulseWarp, PULSE_MAX_R } from './avatar-pulse';
import { AvatarShimmer } from './avatar-shimmer';
import { AvatarFace, AvatarSlab, FRAME_CORNER, CARD_DEPTH_RATIO } from './avatar-face';
import { AuthIdentity, AuthInvite } from './auth-identity';
import { AvatarBarcode } from './avatar-barcode';
import {
  AUTH_SUBMIT_DELAY_MS,
  SLOT_ENTER_SPRING,
  ENTER_DELAY,
  ENTER_DURATION,
  EXIT_DELAY,
  EXIT_DURATION,
  EASE_OUT,
  CROSSFADE_S,
  CROSSFADE_EASE,
} from '@/lib/utils/static';
import {
  COLORS,
  EXPRESSIONS,
  FRAME_D,
  FACE_D,
  PATHS,
  IDLE_ANIMATIONS,
  type ColorScheme,
} from '@/lib/avatar-shapes';


const ROW_TRAVEL = 34;

// The controls leave in sequence on the avatar click: the swatch / expression
// row clears first, and the Customize button only starts once it has gone. One
// factory for both, so the second is the first replayed `delay` later rather
// than a second definition that can drift out of step with it. Entry is
// unstaggered — the delay applies to the exit only.
const groupVariants = (delay: number, exitS: number) => ({
  enter: { opacity: 0, y: ROW_TRAVEL, filter: 'blur(4px)' },
  open: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      y: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      opacity: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: ENTER_DELAY },
      filter: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: ENTER_DELAY },
    },
  },
  collapsed: {
    opacity: 0,
    y: ROW_TRAVEL,
    filter: 'blur(4px)',
    // One duration and one curve across all three legs. They used to run
    // split — the drop on EXIT_DURATION and the fade on CROSSFADE_S, nearly
    // twice as long — so the button fell into place and then sat there fading,
    // which is the break you feel rather than a single movement away.
    transition: {
      y: { duration: exitS, ease: EASE_OUT, delay },
      opacity: { duration: exitS, ease: EASE_OUT, delay },
      filter: { duration: exitS, ease: EASE_OUT, delay },
    },
  },
});

// Sequential but tight. Built on CROSSFADE_S rather than the shared exit
// constants: this is one gesture leaving, not a crossfade between two screens,
// and the modal's EXIT_DELAY lead only added dead air ahead of it. Two thirds
// of a crossfade each, back to back, is 0.32s end to end against the 0.61s it
// ran at when the row and the button each carried a full one.
const ROW_EXIT_S = CROSSFADE_S * 0.62;
const BUTTON_EXIT_S = CROSSFADE_S * 0.72;
const SWATCH_GROUP_VARIANTS = groupVariants(0, ROW_EXIT_S);
const CUSTOMIZE_GROUP_VARIANTS = groupVariants(ROW_EXIT_S, BUTTON_EXIT_S);

// The wrapper only orchestrates now. It carries no visual state of its own:
// fading it would take both groups with it and there would be nothing left to
// stagger. Empty variants still propagate the label down to the two children.
const CONTROLS_VARIANTS = { enter: {}, open: {}, collapsed: {} };

const ROW_VARIANTS = {
  // Same treatment as the screen-to-screen cross-fade. Both rows sit in the
  // same 34.5px box, so without a stagger they are each half-visible in the
  // same place at the same time and read as one jumbled row rather than a
  // swap. The incoming fade starts a third of the way into the outgoing one,
  // and both pass through a blur so the overlap is never two legible sets of
  // shapes on top of each other.
  enter: { opacity: 0, y: ROW_TRAVEL, filter: 'blur(4px)' },
  open: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      y: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      opacity: {
        duration: CROSSFADE_S,
        ease: CROSSFADE_EASE,
        delay: EXIT_DELAY + CROSSFADE_S * 0.35,
      },
      filter: {
        duration: CROSSFADE_S,
        ease: CROSSFADE_EASE,
        delay: EXIT_DELAY + CROSSFADE_S * 0.35,
      },
    },
  },
  collapsed: {
    opacity: 0,
    y: ROW_TRAVEL,
    filter: 'blur(4px)',
    transition: {
      y: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
      opacity: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
      filter: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
    },
  },
};

// 40px avatar -> 160px.

// One shimmer sweep. Shared by both things that fire it — an expression change
// and the avatar's own click — so the two read as the same effect.
const SHIMMER_S = 1.25;
const SHIMMER_EASE = [0.33, 0.7, 0.45, 1] as const;
// The chip renders at 40px, so its slab is that fraction of 40.
const CARD_DEPTH = 40 * CARD_DEPTH_RATIO;

const EXPANDED_SCALE = 4;
// Drops it into the middle of the space the controls leave behind: the avatar
// centre sits 36px into the column, whose own centre is ~125px down.
const EXPANDED_DROP = 89;
// Avatar centre once expanded (36 from the column top, plus the drop), half of
// its 160px height, then a 20px gap.
const IDENTITY_TOP = 36 + EXPANDED_DROP + 80 + 20;
const EXPAND_SPRING = { type: 'spring' as const, duration: 0.75, bounce: 0.14 };

export function SelectAvatar() {
  const { state, dispatch } = useAppContext();
  const [exprIdx, setExprIdx] = useState(2);
  const expandRunRef = useRef(0);
  // Welcome is not a separate screen any more — it is this one with a different
  // title, a different button and the avatar held open. The card would
  // otherwise cross-fade to a second copy of the avatar, and a copy cannot
  // spin into focus; it can only fade in already turned.
  const isWelcome = state.authModal.variant === 'welcome';
  // Which side of the card is out on the final screen: the avatar, or its
  // invite code. Clicking turns it either way.
  const [showCode, setShowCode] = useState(false);
  const [colorIdx, setColorIdx] = useState(2);
  const [selectedColorIdx, setSelectedColorIdx] = useState(2);
  const [showExpressions, setShowExpressions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Tapping the avatar blows it up and clears the controls away.
  const [expanded, setExpanded] = useState(false);
  // 0 to 1 across one pulse. Shared with the surrounding elements so they
  // can warp as the wave front reaches them.
  const pulseProgress = useMotionValue(0);
  // 0 collapsed, 1 expanded. Drives the avatar's size and its drop into the
  // space the controls vacate.
  const expand = useMotionValue(0);
  // 0 to 1 across one shimmer sweep, fired on an expression change.
  const shimmerProgress = useMotionValue(0);
  const firstExpr = useRef(true);
  const username = state.authModal.username;
  const innerRingRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);

  // Timers for the in-flight sequence, so an interrupting click can cancel them.
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  // Rotation accumulates rather than resetting. Keeping it monotonic means an
  // interrupting click retargets to a larger angle and the browser interpolates
  // forward from wherever the spin currently is, instead of unwinding.
  const rotationRef = useRef(0);
  // Identifies the current run so a superseded animation cannot resume.
  const runRef = useRef(0);
  // Unsubscribes the in-flight "nearly landed" watcher.
  const pulseWatchRef = useRef<(() => void) | null>(null);
  // Whether a turn is currently in flight, so an interrupting click can
  // continue it rather than starting a fresh one.
  const spinningRef = useRef(false);

  const spin = useMotionValue(0);
  const lift = useMotionValue(0);
  const liftScale = useTransform(lift, [0, 1], [1, 1.15]);
  const liftY = useTransform(lift, [0, 1], [0, -6]);
  // 40px -> 160px is a 4x scale. Done as a transform rather than by resizing
  // the svg, so the rings and the 3D faces scale with it and the layout does
  // not reflow underneath.
  const expandScale = useTransform(expand, [0, 1], [1, EXPANDED_SCALE]);
  const expandY = useTransform(expand, [0, 1], [0, EXPANDED_DROP]);
  const ringOpacity = useTransform(expand, [0, 0.45], [1, 0]);
  const originY = useTransform(expand, [0, 1], [20, 20 + EXPANDED_DROP]);
  const perspectiveOrigin = useMotionTemplate`50% ${originY}px`;
  const avatarScale = useTransform([liftScale, expandScale], ([l, e]: number[]) => l * e);
  const avatarY = useTransform([liftY, expandY], ([l, e]: number[]) => l + e);
  // scale3d, not scale: CSS `scale()` is 2D, so it grew the faces to 160px and
  // left the extrusion behind them at its original 6px — the expanded card
  // turned edge-on like paper. A uniform scale3d takes the children's
  // translateZ with it, so the slab keeps its proportion at any size.
  const avatarTransform = useMotionTemplate`translateY(${avatarY}px) scale3d(${avatarScale}, ${avatarScale}, ${avatarScale}) rotateY(${spin}deg)`;

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const after = (ms: number, fn: () => void) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  useEffect(
    () => () => {
      clearTimers();
      pulseWatchRef.current?.();
    },
    []
  );

  // Anticipation: a short wind-back against the turn before committing to it.
  const ANTICIPATION_DEG = 22;
  const ANTICIPATION_S = 0.09;
  const SPIN_DEGREES = 540;
  // The Customize rows swap the same way the disclaimer and button do: the
  // incoming row rises from below while the outgoing sinks, so the eyes travel
  // up into place rather than cross-fading where they stand.
  const PULSE_S = 1.1;
  // The wave runs at 80% power.
  const MAIN_STRENGTH = 0.8;

  // How much of the turn is still left when the pulse goes off. Small, because
  // the spin's ease-out tail means the last slice of *angle* takes a
  // disproportionate slice of *time* — at 0.12 this fired 323ms early.
  const PULSE_LEAD = 0.015;

  const SPIN_S = 0.9;
  // Ease-in-out tuned for the landing. The earlier 0.97/0.175 curve peaked at
  // ~10x a linear rate, so the turn arrived carrying far too much speed to shed
  // gently no matter how long the tail was. Backing the first control point off
  // to 0.5 drops the peak to ~3.3x while the second at 0.15 keeps the final
  // approach spread over ~38% of the duration — a slower middle and a long,
  // soft arrival rather than a spike followed by a stop.
  const SPIN_EASE = [0.5, 0, 0.15, 1] as const;
  // Used only when a turn is already in flight. A duration-based curve always
  // starts from a standstill, so re-targeting one mid-spin would visibly stall.
  // A spring picks up the motion value's current velocity, so the turn carries
  // straight on to the further target instead of restarting.
  const CONTINUE_SPRING = { type: 'spring' as const, duration: 0.7, bounce: 0.1 };

  useEffect(() => {
    // Skip the initial mount: nothing has changed yet.
    if (firstExpr.current) {
      firstExpr.current = false;
      return;
    }
    void animate(lift, 1, { duration: 0.16, ease: EASE_OUT }).then(() => {
      void animate(lift, 0, { type: 'spring', duration: 0.5, bounce: 0.2 });
    });
    fireShimmer();
    // lift and shimmerProgress are stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exprIdx]);

  const fireShimmer = () => {
    shimmerProgress.set(0);
    void animate(shimmerProgress, 1, { duration: SHIMMER_S, ease: [...SHIMMER_EASE] });
  };

  useEffect(() => {
    if (!isWelcome) return;
    setExpanded(true);
    rotationRef.current += 360;
    const run = ++expandRunRef.current;
    void animate(spin, rotationRef.current, { duration: SPIN_S, ease: [...SPIN_EASE] }).then(() => {
      if (expandRunRef.current === run) fireShimmer();
    });
    void animate(expand, 1, EXPAND_SPRING);
    // The motion values and the spin config are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWelcome]);

  const toggleCode = () => {
    const next = !showCode;
    // 540 rather than 360, so it genuinely arrives on the other side rather
    // than coming back to the face it started on. Each turn is forward, so
    // going back reads as the same gesture rather than an undo.
    rotationRef.current += 540;
    const run = ++expandRunRef.current;
    void animate(spin, rotationRef.current, { duration: SPIN_S, ease: [...SPIN_EASE] }).then(() => {
      if (expandRunRef.current === run) fireShimmer();
    });
    // Swapped while the card is edge-on, the same point in the turn the colour
    // change uses, so the change itself is never visible. Guarded by the run
    // counter: clicking again mid-turn would otherwise let the first click's
    // timer land after the second and leave the card showing the wrong side.
    after(480, () => {
      if (expandRunRef.current === run) setShowCode(next);
    });
  };

  const toggleExpanded = () => {
    if (isWelcome) {
      toggleCode();
      return;
    }
    const next = !expanded;
    setExpanded(next);
    // A forward turn each way, so the gesture reads the same opening and
    // closing rather than unwinding on the way back.
    rotationRef.current += 360;
    // Guarded because the sweep is chained to the turn finishing: without it a
    // second click's shimmer would be stomped by the first turn's promise
    // resolving late and re-firing from zero.
    const run = ++expandRunRef.current;
    void animate(spin, rotationRef.current, {
      duration: SPIN_S,
      ease: [...SPIN_EASE],
    }).then(() => {
      if (expandRunRef.current === run) fireShimmer();
    });
    void animate(expand, next ? 1 : 0, EXPAND_SPRING);
  };

  const firePulse = () => {
    pulseProgress.set(0);
    void animate(pulseProgress, 1, {
      duration: PULSE_S,
      ease: [0.33, 0.7, 0.45, 1],
    });
  };

  /**
   * Fires the pulse in the last stretch of the turn rather than on its
   * completion. Watching the rotation itself rather than setting a timer means
   * this stays correct whatever the spin's duration or easing is — a timer
   * would have to restate them and would drift the moment either changed.
   */
  const firePulseNearEndOf = (target: number, run: number) => {
    const total = Math.abs(target - spin.get());
    if (total === 0) return;
    const unsub = spin.on('change', (v) => {
      if (runRef.current !== run) {
        unsub();
        return;
      }
      if (Math.abs(target - v) <= total * PULSE_LEAD) {
        unsub();
        firePulse();
      }
    });
    pulseWatchRef.current?.();
    pulseWatchRef.current = unsub;
  };

  const handleColorChange = (newIdx: number) => {
    if (newIdx === selectedColorIdx) return;
    setSelectedColorIdx(newIdx);

    const inner = innerRingRef.current;
    const outer = outerRingRef.current;
    if (!inner || !outer) {
      setColorIdx(newIdx);
      return;
    }

    clearTimers();
    const run = ++runRef.current;

    // Overlapping action: the rings leave ahead of the avatar rather than with
    // it, so the parts do not all move on the same beat.
    inner.style.transition = 'opacity 110ms ease';
    inner.style.opacity = '0';
    outer.style.transition = 'opacity 110ms ease 30ms';
    outer.style.opacity = '0';

    rotationRef.current += SPIN_DEGREES;
    const target = rotationRef.current;
    const alreadyTurning = spinningRef.current;
    spinningRef.current = true;

    if (alreadyTurning) {
      // Mid-turn. No second wind-back — anticipating again would drag the
      // avatar backwards against a turn that is already underway, which is the
      // restart being avoided here. Extend the target and let the spring carry
      // the existing velocity into it.
      firePulseNearEndOf(target, run);
      void animate(spin, target, CONTINUE_SPRING).then(() => {
        if (runRef.current === run) spinningRef.current = false;
      });
    } else {
      void animate(spin, spin.get() - ANTICIPATION_DEG, {
        duration: ANTICIPATION_S,
        ease: [0.23, 1, 0.32, 1],
      }).then(() => {
        // A newer click already took over; do not stomp its animation.
        if (runRef.current !== run) return;
        void animate(spin, target, {
          duration: SPIN_S,
          ease: [...SPIN_EASE],
        }).then(() => {
          if (runRef.current === run) spinningRef.current = false;
        });
        firePulseNearEndOf(target, run);
      });
    }

    // Secondary action: the lift overlaps the turn instead of bracketing it, so
    // there is no moment where the avatar is stationary between two phases.
    void animate(lift, 1, { duration: 0.16, ease: [0.23, 1, 0.32, 1] });
    after(640, () => {
      void animate(lift, 0, { type: 'spring', duration: 0.42, bounce: 0.18 });
    });

    // Swap the face while it is edge-on.
    // Swap the face while it is edge-on, midway through the turn.
    after(480, () => {
      setColorIdx(newIdx);
    });

    after(790, () => {
      inner.style.transition = 'opacity 200ms ease';
      inner.style.opacity = '1';
      outer.style.transition = 'opacity 200ms ease 60ms';
      outer.style.opacity = '1';
    });
  };

  const color = COLORS[colorIdx];

  return (
    <div className="dark app_login h-full flex flex-col app_select_avatar px-6! py-7!">
      <div className="relative flex items-center justify-center pt-2! pb-6!">
        <AnimatePresence initial={false}>
          {!isWelcome && (
            <motion.div
              key="back"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: CROSSFADE_S, ease: CROSSFADE_EASE }}
            >
              <AuthIconButton
                side="left"
                onClick={() => {
                  dispatch(updateAuthModal({ show: true, variant: 'createAccount' }));
                }}
              >
                <Back />
              </AuthIconButton>
            </motion.div>
          )}
        </AnimatePresence>
        {/* The title is the only thing that cross-fades now. Both copies sit in
            the same grid cell so the swap happens in place rather than the
            incoming one pushing the outgoing one aside. */}
        <div className="grid">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.h3
              key={isWelcome ? 'welcome' : 'select'}
              className="app_login__top__title__text text-[#F9F9F9CC]! col-start-1 row-start-1"
              initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
              transition={{ duration: CROSSFADE_S, ease: CROSSFADE_EASE }}
            >
              {isWelcome ? 'Welcome to Cheq' : 'Select your avatar'}
            </motion.h3>
          </AnimatePresence>
        </div>
        <AuthIconButton
          side="right"
          onClick={() => {
            dispatch(updateAuthModal({ show: false }));
          }}
        >
          <Close />
        </AuthIconButton>
      </div>

      <div className="relative flex-1">
        {/* Outside the avatar's perspective box: `perspective` creates a
            stacking context, so a z-index inside it cannot lift the pulse above
            the swatches and buttons below. Anchored to the avatar's centre —
            16px of top padding plus half of its 40px. */}
        <div
          className="absolute left-1/2 z-30 pointer-events-none"
          style={{ top: 36, width: 0, height: 0 }}
        >
          <AvatarPulse color={color} progress={pulseProgress} strength={MAIN_STRENGTH} />
        </div>
        <div className="flex justify-center pt-4! pb-10.5!">
          {/* perspective-origin has to travel with the avatar. It defaults to
              the centre of this 40px box, but the expanded avatar sits 89px
              lower, so the 3D edge layers behind the face were being projected
              downward and out from under it — the brown rim that looked like a
              leftover of the small avatar. Following the drop keeps them
              square behind the face at rest, and still lets them show as
              thickness while the card is mid-turn. */}
          <motion.div
            className="relative cursor-pointer"
            style={{ perspective: 600, perspectiveOrigin }}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={
              isWelcome
                ? showCode
                  ? 'Show avatar'
                  : 'Show invite code'
                : expanded
                  ? 'Shrink avatar'
                  : 'Enlarge avatar'
            }
            onClick={toggleExpanded}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpanded();
              }
            }}
          >
            {/* The rings belong to the 40px chip: they sit outside the element
                that carries the expand transform, so they kept their small
                geometry while the avatar grew and their sides showed above it.
                The wrapper fades them out on the way up and back in on the way
                down; each ring keeps its own opacity for the colour-change
                sequence, and the two multiply. Radii are again centred on
                (9,9) — 9 + 8 and 9 + 4 — so all four contours stay concentric. */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: ringOpacity }}
            >
              <div
                ref={outerRingRef}
                className="absolute"
                style={{
                  inset: -8,
                  borderRadius: FRAME_CORNER + 8,
                  border: `1.5px solid ${color.borderTo}12`,
                }}
              />
              <div
                ref={innerRingRef}
                className="absolute"
                style={{
                  inset: -4,
                  borderRadius: FRAME_CORNER + 4,
                  border: `1.5px solid ${color.borderTo}33`,
                }}
              />
            </motion.div>
            <motion.div style={{ transformStyle: 'preserve-3d', transform: avatarTransform }}>
              {/* Front face */}
              <div
                style={{
                  position: 'relative',
                  backfaceVisibility: 'hidden',
                  transform: `translateZ(${CARD_DEPTH / 2}px)`,
                }}
              >
                {showCode ? (
                  <AvatarBarcode color={color} size={40} seed={username} />
                ) : (
                  <AvatarFace exprIdx={exprIdx} color={color} size={40} />
                )}
                <AvatarShimmer color={color} progress={shimmerProgress} />
              </div>
              {/* Edge layers */}
              {/* The card's thickness during the flip. These were rounded
                  divs tracing the backing plate; with the plate gone they have
                  to be the frame's own silhouette, or they read as a solid
                  square sitting behind a cut-out avatar. FRAME_D is a filled
                  shape (the face is punched out of it by the layer above), so
                  stacking it in Z gives the same extruded edge. */}
              <AvatarSlab color={color} size={40} />
              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: `rotateY(180deg) translateZ(${CARD_DEPTH / 2}px)`,
                }}
              >
                {showCode ? (
                  <AvatarBarcode color={color} size={40} seed={username} />
                ) : (
                  <AvatarFace exprIdx={exprIdx} color={color} size={40} />
                )}
                {/* The back face sweeps too. A colour change turns 540 degrees,
                    so parity flips every time and half the resting states show
                    this side — with the shimmer only on the front, the effect
                    silently went missing on those. Same progress value, so
                    whichever face is out is the one that sweeps. */}
                <AvatarShimmer color={color} progress={shimmerProgress} />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Fixed to the tallest state so toggling expressions/colours does not
            shift the layout. 34.5 is the active colour swatch — it was 26,
            sized for the old swatches, so the enlarged ones overflowed it and
            ate ~4px of the gap below. */}
        {/* Distances are measured from the avatar centre, so each element
            reacts as the ring actually reaches it. */}
        {/* Absolutely placed: the controls it would otherwise follow are gone by
            now, and the avatar above it is transform-scaled inside a 40px slot,
            so nothing in the flow knows how tall it actually is. IDENTITY_TOP
            is the avatar's expanded centre plus half its height plus a gap. */}
        <AnimatePresence initial={false}>
          {isWelcome && (
            <motion.div
              key="identity"
              className="absolute left-0 right-0"
              style={{ top: IDENTITY_TOP }}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              transition={{ duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: 0.35 }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={showCode ? 'invite' : 'identity'}
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
                  transition={{ duration: CROSSFADE_S, ease: CROSSFADE_EASE }}
                >
                  {showCode ? (
                    <AuthInvite username={username} />
                  ) : (
                    <AuthIdentity username={username} />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!expanded && (
            <motion.div
              key="controls"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={CONTROLS_VARIANTS}
            >
        <motion.div variants={SWATCH_GROUP_VARIANTS}>
        <PulseWarp waves={[
            {
              progress: pulseProgress,
              reach: PULSE_MAX_R,
              strength: MAIN_STRENGTH,
              distortion: 1,
            },
          ]} distance={76}>
        {/* overflow: hidden so the rows travel in and out of this box instead
            of sliding over the Customize button below it. 40px rather than the
            swatch's own 34.5 leaves room for the active swatch's 2px ring,
            which a tight box would clip. */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: 40, overflow: 'hidden' }}
        >
          <AnimatePresence initial={false}>
          {showExpressions ? (
            <motion.div
              key="expressions"
              className="absolute inset-0 flex justify-center gap-2 items-center"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={ROW_VARIANTS}
            >
              {EXPRESSIONS.map((expr, i) => {
                const p = PATHS[i];
                const active = exprIdx === i;
                // Matches the colour swatches so the two rows are the same size.
                const btnSize = active ? 34.5 : 24;
                return (
                  <div
                    key={expr.key}
                    className="flex items-center justify-center"
                    // style={{ width: 26, height: 26 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setExprIdx(i);
                      }}
                      className="cursor-pointer overflow-hidden"
                      style={{ borderRadius: 3, backgroundColor: active ? '#292929' : '#29292980' }}
                      animate={{ width: btnSize, height: btnSize }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <svg viewBox="12 14 16 9" className="w-full h-full">
                        <path d={p.left} fill="#FFFFFF" />
                        <path d={p.right} fill="#FFFFFF" />
                      </svg>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="colors"
              className="absolute inset-0 flex justify-center gap-2 items-center"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={ROW_VARIANTS}
            >
              {COLORS.map((c, i) => {
                const active = selectedColorIdx === i;
                // 50% up from 23 / 16.
                const btnSize = active ? 34.5 : 24;
                return (
                  <div
                    key={c.key}
                    className="flex items-center justify-center"
                    // style={{ width: 23, height: 23 }}
                  >
                    <motion.button
                      onClick={() => {
                        handleColorChange(i);
                      }}
                      className="rounded-full overflow-hidden cursor-pointer"
                      // 2px outline in the colour's own lighter tone rather
                      // than a flat white ring. box-shadow rather than `ring`
                      // so it follows the circle without being clipped by the
                      // overflow: hidden that masks the swatch artwork.
                      style={{ boxShadow: active ? `0 0 0 2px ${c.ring}` : undefined }}
                      animate={{ width: btnSize, height: btnSize, rotate: active ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <svg viewBox="0 0 32 32" className="w-full h-full">
                        <circle cx="16" cy="16" r="16" fill={c.gradientFrom} />
                        <path d="M32 0 L32 32 L0 32 Z" fill={c.gradientTo} />
                      </svg>
                    </motion.button>
                  </div>
                );
              })}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
        </PulseWarp>
        </motion.div>
        <motion.div variants={CUSTOMIZE_GROUP_VARIANTS}>
        <PulseWarp waves={[
            {
              progress: pulseProgress,
              reach: PULSE_MAX_R,
              strength: MAIN_STRENGTH,
              distortion: 1,
            },
          ]} distance={128} className="flex justify-center mt-[17.25px]!">
          <Button
            // rounded-full rather than a large px radius: the app-wide squircle
            // default explicitly excludes .rounded-full, so this stays a true
            // pill instead of being smoothed into a lozenge.
            //
            // Two hover effects had to be cancelled: the Button variant's
            // hover:bg-primary/80, which painted a near-white overlay over the
            // dark fill (#292929 -> #9D9D9D), and the global
            // button:hover { opacity: .8 } in _reset.scss. Replaced with a one
            // subtler neutral lift: #292929 -> #313131 is dL 0.034. The ramp's
            // --n-700 was dL 0.069 and carries the ramp's cool cast, which read
            // as too big a jump and slightly blue against this neutral fill.
            className="h-8 px-3! bg-[#292929] rounded-full text-[#F9F9F9E5]! hover:opacity-100! hover:bg-[#313131]!"
            style={{ fontSize: 14, letterSpacing: '0.02em' }}
            onClick={() => {
              setShowExpressions((v) => !v);
            }}
          >
            Customize
          </Button>
        </PulseWarp>
        </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mb-3">
        <Button
          className="w-full h-12 bg-[#f9f9f9] hover:bg-[#f9f9f9] app_auth_cta text-[#0b0b0b] shadow-[0px_0px_0px_1px_#0000000A] hover:opacity-100! disabled:opacity-100!"
          disabled={submitting}
          onClick={() => {
            if (isWelcome) {
              dispatch(updateAuthModal({ show: false }));
              return;
            }
            if (submitting) return;
            setSubmitting(true);
            after(AUTH_SUBMIT_DELAY_MS, () => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'welcome',
                  colorIdx: selectedColorIdx,
                  exprIdx,
                })
              );
              setSubmitting(false);
            });
          }}
        >
          <AuthCtaContent loading={submitting}>{isWelcome ? 'Done' : 'Continue'}</AuthCtaContent>
        </Button>
      </div>
    </div>
  );
}
