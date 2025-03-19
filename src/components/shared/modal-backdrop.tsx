'use client';
import React, { Fragment } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/state/context';

export function ModalBackdrop() {
  const { authModal, positionOpened } = useAppContext().state;
  const condition = authModal.show || positionOpened.show;

  return (
    <Fragment>
      {condition && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="app_modal_backdrop"
        ></motion.div>
      )}
    </Fragment>
  );
}
