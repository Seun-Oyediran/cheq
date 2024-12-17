import React from 'react';
import { motion } from 'framer-motion';

interface IProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

export function SkeletonLoader(props: IProps) {
  const { borderRadius = '30px', height = '16px', width = '100px' } = props;

  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius,
      }}
      className="app_skeleton_loader"
    ></motion.div>
  );
}
