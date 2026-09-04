'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Copy, CopyDone } from '../svgs/icons';
import { EASE_OUT } from '@/lib/utils/static';

// Emil Kowalski's rules for a state swap, applied to the copy affordance.
//
// Asymmetric: whichever icon is arriving springs in with a little overshoot,
// and whichever is leaving takes a short ease-in out of the way. A single
// symmetric tween in both directions — which is what this was — reads as a
// dissolve between two pictures rather than one thing being replaced by
// another, and gives the confirmation no snap.
//
// Both icons stay mounted, so a second click mid-flight redirects the values
// they are already on rather than restarting from the beginning.
const ICON_IN = { type: 'spring' as const, duration: 0.34, bounce: 0.42 };
const ICON_OUT = { duration: 0.13, ease: [0.4, 0, 1, 1] as const };
// Well short of zero. Scaling to 0.5 pops; the icon should read as receding.
const ICON_SMALL = 0.62;
// The blur leads. It runs on its own short window ahead of everything else, so
// the icon has already gone soft by the time it starts leaving — the switch
// happens behind it rather than in full focus, which is what stops the two
// glyphs being legible on top of each other at the crossover. The arriving one
// holds its softness until it has landed and only then resolves.
const BLUR_LEAD = 0.075;
const ICON_BLUR = 3.5;

function CopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => {
    clearTimeout(timer.current);
  }, []);

  const handleCopy = () => {
    void navigator.clipboard.writeText(address);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const face = (shown: boolean) => ({
    animate: {
      opacity: shown ? 1 : 0,
      scale: reduced ? 1 : shown ? 1 : ICON_SMALL,
      filter: reduced ? 'blur(0px)' : shown ? 'blur(0px)' : `blur(${ICON_BLUR}px)`,
    },
    transition: reduced
      ? { duration: 0.12 }
      : shown
        ? {
            opacity: { ...ICON_IN, delay: BLUR_LEAD },
            scale: { ...ICON_IN, delay: BLUR_LEAD },
            filter: { duration: 0.2, ease: EASE_OUT, delay: BLUR_LEAD + 0.06 },
          }
        : {
            filter: { duration: BLUR_LEAD, ease: EASE_OUT },
            opacity: { ...ICON_OUT, delay: BLUR_LEAD },
            scale: { ...ICON_OUT, delay: BLUR_LEAD },
          },
  });

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy'}
      className="text-[#9B9FA4] hover:text-[#F9F9F9] transition-colors relative"
      style={{ width: 20, height: 20 }}
      // The press itself gets a response, so the confirmation is not the first
      // thing the button does after being clicked.
      whileTap={reduced ? undefined : { scale: 0.86 }}
      transition={ICON_IN}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        {...face(!copied)}
      >
        <Copy width={20} height={20} />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        {...face(copied)}
      >
        <CopyDone width={20} height={20} />
      </motion.span>
    </motion.button>
  );
}

/**
 * Who you are, under the avatar on the final screen. Its own component because
 * Select avatar and Welcome are one mounted screen now — the avatar between
 * them has to survive the change, so the parts that differ have to be things
 * that screen can render, not a second screen that replaces it.
 */
/**
 * Stand-in wallet address. One constant rather than a shortened display string
 * beside a longer copy string — those were already inconsistent, and the copy
 * value was 33 hex characters, seven short of an address anyone could paste
 * anywhere. This is a full 40, so it reads as the real thing at a glance.
 */
export const WALLET_ADDRESS = '0x2734B3C027f8B1e305C3A8E7a6D2f04Bc71a0293';

export function AuthIdentity({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center gap-1 justify-center">
      <h2 className="text-sm font-medium text-[#F9F9F9]">{username || 'Anonymous'}</h2>
      {/* Two lines, not one. A 42-character address overflows this 360px card
          by 49px even at 11px, and the size that would fit it is ~9px — past
          reading. Wrapping keeps every character on screen and selectable,
          which is the whole point of showing it in full rather than truncated. */}
      <div className="flex items-center gap-1.5 justify-center">
        <p className="text-[12px] leading-[1.35] text-[#F9F9F980] text-center break-all max-w-[184px]">
          {WALLET_ADDRESS}
        </p>
        <CopyButton address={WALLET_ADDRESS} />
      </div>
    </div>
  );
}

/**
 * What the identity block becomes once the card is turned to its invite code.
 * Same two-line shape as AuthIdentity — a heading over a row with the copy
 * control — so the swap happens in place rather than one layout replacing a
 * differently shaped one.
 */
export function AuthInvite({ username }: { username: string }) {
  const link = `cheq.xyz/i/${username || 'anon'}`;
  return (
    <div className="flex flex-col items-center gap-1 justify-center">
      <h2 className="text-sm font-medium text-[#F9F9F9]">Invite friends</h2>
      <div className="flex items-center gap-1">
        <p className="text-[13px] text-[#F9F9F980]">{link}</p>
        <CopyButton address={`https://${link}`} />
      </div>
    </div>
  );
}
