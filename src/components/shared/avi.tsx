import React from 'react';
import { BoxLogo } from './svgs/icons';
import { aviVariants, type IAviVariants } from '@/lib/utils/static';

interface IProps {
  size?: number;
  className?: string;
  variant?: IAviVariants;
}

export function Avi(props: IProps) {
  const { size = 32, className = '', variant = 'aquafresh' } = props;

  return (
    <div
      className={`app_avi flex justify-center items-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, background: aviVariants[variant].bg }}
    >
      <BoxLogo width={size - 12} height={size - 12} fill={aviVariants[variant].fill} />
    </div>
  );
}
