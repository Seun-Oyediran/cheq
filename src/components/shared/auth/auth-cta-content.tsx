'use client';
import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Spinner } from '../svgs/icons';
import {
  EASE_OUT,
  ENTER_DURATION,
  EXIT_DURATION,
  ENTER_DELAY,
  EXIT_DELAY,
  SLOT_ENTER_SPRING,
} from '@/lib/utils/static';

// Rises from below on the way in, sinks below on the way out — so the label and
// the spinner travel the same direction rather than crossfading in place.
const CTA_VARIANTS = {
  enter: { opacity: 0, y: '100%' },
  open: {
    opacity: 1,
    y: '0%',
    transition: {
      y: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      opacity: { duration: ENTER_DURATION, ease: EASE_OUT, delay: ENTER_DELAY },
    },
  },
  collapsed: {
    opacity: 0,
    y: '100%',
    transition: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
  },
};

interface IProps {
  loading: boolean;
  children: ReactNode;
}

/**
 * A CTA's label and its loading spinner, stacked so they slide past each other
 * without changing the button's size. Shared so the auth screens cannot drift
 * apart on it.
 */
export function AuthCtaContent(props: IProps) {
  const { loading, children } = props;

  return (
    <span className="app_auth_cta__stack">
      <AnimatePresence initial={false}>
        {loading ? (
          <motion.span
            key="spinner"
            className="app_auth_cta__face"
            initial="enter"
            animate="open"
            exit="collapsed"
            variants={CTA_VARIANTS}
          >
            <Spinner className="animate-spin size-5" />
          </motion.span>
        ) : (
          <motion.span
            key="label"
            className="app_auth_cta__face"
            initial="enter"
            animate="open"
            exit="collapsed"
            variants={CTA_VARIANTS}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
