'use client';
import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppContext } from '@/state/context';
import { authModalVariants, spring } from '@/lib/utils/static';

interface IProps {
  children?: ReactNode;
}

export function AuthWrapper(props: IProps) {
  const { children } = props;
  const { authModal } = useAppContext().state;

  return (
    <motion.div
      className="app_auth_wrapper"
      initial={{ height: authModalVariants[authModal.variant].height }}
      animate={{ height: authModalVariants[authModal.variant].height, transition: spring }}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={authModal.variant}
          className="h-full"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: {
              // filter: 'blur(0px)',
              transition: { duration: 0.1, delay: 0.3 },
              opacity: 1,
              scale: 1,
            },
            collapsed: {
              // filter: 'blur(0px)',
              transition: { duration: 0.1 },
              opacity: 1,
              scale: 1,
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
