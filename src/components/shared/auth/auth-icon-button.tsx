'use client';
import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  EASE_OUT,
  EXIT_SCALE,
  ENTER_SCALE,
  EXIT_DURATION,
  ENTER_DURATION,
  EXIT_DELAY,
  ENTER_DELAY,
} from '@/lib/utils/static';

interface IProps {
  side: 'left' | 'right';
  onClick: () => void;
  children: ReactNode;
}

/**
 * The header affordances shared by every auth screen (close, back).
 *
 * Counter-scales the auth wrapper's transition so the target stays a constant
 * size while the rest of the content grows or shrinks. The variant names match
 * the wrapper's — framer propagates them down through the tree, so no props
 * need threading. Lives in one place so the four screens cannot drift apart.
 */
export function AuthIconButton(props: IProps) {
  const { side, onClick, children } = props;

  return (
    <motion.button
      type="button"
      className={`absolute ${side === 'left' ? 'left-0' : 'right-0'} flex size-8 items-center justify-center text-[var(--auth-text-muted)]`}
      variants={{
        enter: { scale: 1 / ENTER_SCALE },
        open: {
          scale: 1,
          transition: { duration: ENTER_DURATION, ease: EASE_OUT, delay: ENTER_DELAY },
        },
        collapsed: {
          scale: 1 / EXIT_SCALE,
          transition: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
        },
      }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
