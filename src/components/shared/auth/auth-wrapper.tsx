'use client';
import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '@/state/context';
import {
  authModalVariants,
  authHeightSpring,
  EASE_OUT,
  EXIT_SCALE,
  ENTER_SCALE,
  EXIT_DURATION,
  ENTER_DURATION,
  EXIT_DELAY,
  ENTER_DELAY,
  CROSSFADE_S,
  CROSSFADE_EASE,
} from '@/lib/utils/static';

const DARK_VARIANTS = new Set(['selectAvatar', 'welcome']);

/**
 * Select avatar and Welcome are one screen as far as the cross-fade is
 * concerned. They share a presence key, so the subtree is never unmounted
 * between them and the avatar is a single element that turns and grows rather
 * than two that fade past each other. Everything that differs — the title, the
 * identity block, the button — animates inside that surviving subtree.
 */
const SHARED_PRESENCE: Partial<Record<string, string>> = {
  selectAvatar: 'avatar',
  welcome: 'avatar',
};

interface IProps {
  children?: ReactNode;
}

export function AuthWrapper(props: IProps) {
  const { children } = props;
  const { authModal } = useAppContext().state;

  return (
    <motion.div
      // The card owns the surface colour rather than each screen painting its
      // own. Two opaque panels cross-fading do not sum to opaque — at the
      // midpoint the combined alpha is only 0.75 — so the card behind showed
      // through and the dark screens visibly washed out mid-transition.
      className={`app_auth_wrapper${
        DARK_VARIANTS.has(authModal.variant) ? ' app_auth_wrapper--dark' : ''
      }`}
      initial={{ height: authModalVariants[authModal.variant].height }}
      animate={{
        height: authModalVariants[authModal.variant].height,
        transition: authHeightSpring,
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={SHARED_PRESENCE[authModal.variant] ?? authModal.variant}
          className="h-full absolute inset-0"
          initial="enter"
          animate="open"
          exit="collapsed"
          variants={{
            // The blur is not decoration. Cross-fading two different layouts
            // leaves a window where both are legible at once, which reads as a
            // jumble rather than a change. Blurring both sides through the
            // hand-off collapses them into one indistinct mass, so the eye
            // reads a single transformation instead of two overlaid screens.
            enter: { opacity: 0, scale: ENTER_SCALE, filter: 'blur(5px)' },
            open: {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                scale: { duration: ENTER_DURATION, ease: EASE_OUT, delay: ENTER_DELAY },
                // Starts later than the exit's fade so the two are not both at
                // full strength in the middle of the hand-off.
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
            // Outgoing content grows outward as it fades. EXIT_SCALE is keyed to
            // the blue CTA: it is 312px inside a 360px card, so 360/312 scales it
            // out to exactly the card width just as it disappears.
            collapsed: {
              opacity: 0,
              scale: EXIT_SCALE,
              filter: 'blur(5px)',
              transition: {
                scale: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
                opacity: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
                filter: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
              },
            },
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {/* {children} */}
    </motion.div>
  );
}
