'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Avi } from '../avi';

interface IProps {
  id: number;
  name: string;
  action: string;
}

const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 300,
};

export function RecentActivityItem(props: IProps) {
  const { action, id, name } = props;

  return (
    <motion.div
      id={`${id}`}
      layout
      initial={{
        y: '100%',
        opacity: 0.3,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      exit={{
        y: '-100%',
        opacity: 0.3,
      }}
      transition={spring}
      className="app_recent_activity_item flex justify-between items-center gap-4"
    >
      <div className="app_recent_activity_item__left flex gap-2 items-center">
        <div className="">
          <Avi variant="platinum" size={40} />
        </div>
        <div className="">
          <h4 className="app_recent_activity_item__left__name">{name}</h4>
          <p className="app_recent_activity_item__left__address">0x9283...92839</p>
        </div>
      </div>
      <div className="app_recent_activity_item__right">
        <h4 className="app_recent_activity_item__left__name right">{action}</h4>
        <p className="app_recent_activity_item__left__address right">30s Ago</p>
      </div>
    </motion.div>
  );
}
