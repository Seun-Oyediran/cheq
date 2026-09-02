'use client';

import React, { useState, useRef, useId, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { Button } from '@/components/ui';
import { updateAuthModal } from '@/state/reducer';
import { useAppContext } from '@/state/context';
import { CheckIcon, ChevronLeftIcon, CopyIcon, XIcon } from 'lucide-react';
import {
  COLORS,
  FRAME_D,
  FACE_D,
  PATHS,
  IDLE_ANIMATIONS,
  type ColorScheme,
} from '@/lib/avatar-shapes';

function CopyButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-[#9B9FA4] hover:text-[#F9F9F9] transition-colors relative"
      style={{ width: 12, height: 12 }}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <CopyIcon size={12} color="#F9F9F9" />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.5 }}
        transition={{ duration: 0.15 }}
      >
        <CheckIcon size={12} color="#F9F9F9" />
      </motion.span>
    </button>
  );
}

function AvatarFace({
  exprIdx,
  color,
  size,
}: {
  exprIdx: number;
  color: ColorScheme;
  size: number;
}) {
  const uid = useId();
  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  const prevIdx = useRef(exprIdx);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    const mouth = mouthRef.current;
    if (!left || !right || !mouth) return;

    if (stopRef.current) {
      stopRef.current();
      stopRef.current = null;
    }

    const newPaths = PATHS[exprIdx];
    const idle = IDLE_ANIMATIONS[exprIdx];
    const changed = prevIdx.current !== exprIdx;
    prevIdx.current = exprIdx;

    const startIdle = () => {
      const cL = animate(
        left,
        { d: idle.left },
        { duration: idle.duration, times: idle.times, repeat: Infinity, ease: 'linear' }
      );
      const cR = animate(
        right,
        { d: idle.right },
        { duration: idle.duration, times: idle.times, repeat: Infinity, ease: 'linear' }
      );
      stopRef.current = () => {
        cL.stop();
        cR.stop();
      };
    };

    if (changed) {
      const cL = animate(left, { d: newPaths.left }, { duration: 0.4 });
      const cR = animate(right, { d: newPaths.right }, { duration: 0.4 });
      const cM = animate(mouth, { d: newPaths.mouth }, { duration: 0.4 });
      stopRef.current = () => {
        cL.stop();
        cR.stop();
        cM.stop();
      };
      void Promise.all([cL, cR, cM]).then(startIdle);
    } else {
      left.setAttribute('d', newPaths.left);
      right.setAttribute('d', newPaths.right);
      mouth.setAttribute('d', newPaths.mouth);
      startIdle();
    }

    return () => {
      if (stopRef.current) {
        stopRef.current();
        stopRef.current = null;
      }
    };
  }, [exprIdx]);

  const fillId = `welcome-fill${uid}`;
  const borderId = `welcome-border${uid}`;

  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <defs>
        <linearGradient id={fillId} x1="20" x2="20" y1="-3" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0.299" style={{ stopColor: color.gradientFrom }} />
          <stop offset="1" style={{ stopColor: color.gradientTo }} />
        </linearGradient>
        <linearGradient
          id={borderId}
          x1="20"
          x2="20"
          y1="54.5"
          y2="-5"
          gradientUnits="userSpaceOnUse"
        >
          <stop style={{ stopColor: color.borderTo }} />
          <stop offset="1" style={{ stopColor: color.borderFrom }} />
        </linearGradient>
      </defs>
      <rect width="39" height="39" x="0.5" y="0.5" rx="9.5" style={{ fill: color.bg }} />
      <rect
        width="39"
        height="39"
        x="0.5"
        y="0.5"
        fill="none"
        stroke={`url(#${borderId})`}
        rx="9.5"
      />
      <path d={FRAME_D} fill={`url(#${fillId})`} />
      <path d={FACE_D} style={{ fill: color.bg }} />
      <path ref={leftRef} fill={`url(#${fillId})`} />
      <path ref={rightRef} fill={`url(#${fillId})`} />
      <path ref={mouthRef} fill={`url(#${fillId})`} />
    </svg>
  );
}

export function Welcome() {
  const { state, dispatch } = useAppContext();
  const username = state.authModal.username;
  const color = COLORS[2];

  return (
    <div className="app_login h-full flex flex-col app_select_avatar px-6! bg-[#1E1E1E] py-7!">
      <div className="relative flex items-center justify-center pt-2! pb-6!">
        <button
          type="button"
          className="absolute left-0"
          onClick={() => {
            dispatch(updateAuthModal({ show: true, variant: 'selectAvatar' }));
          }}
        >
          <ChevronLeftIcon size={18} color="#9B9FA4" />
        </button>
        <h3 className="app_login__top__title__text text-[#F9F9F9CC]!">Welcome to Cheq</h3>
        <button
          type="button"
          className="absolute right-0"
          onClick={() => {
            dispatch(updateAuthModal({ show: false }));
          }}
        >
          <XIcon size={18} color="#9B9FA4" />
        </button>
      </div>

      <div className="flex-1">
        <div className="flex justify-center pt-4! pb-10.5!">
          <div className="relative">
            <div
              className="absolute"
              style={{ inset: -8, borderRadius: 17.5, border: `1.5px solid ${color.borderTo}12` }}
            />
            <div
              className="absolute"
              style={{ inset: -4, borderRadius: 13.5, border: `1.5px solid ${color.borderTo}33` }}
            />
            <AvatarFace exprIdx={2} color={color} size={40} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 justify-center pt-0! pb-11!">
          <h2 className="text-sm font-medium text-[#F9F9F9]">{username || 'Anonymous'}</h2>
          <div className="flex items-center gap-1">
            <p className="text-[13px] text-[#F9F9F980]">0x27...0293</p>
            <CopyButton address="0x2734B3C027f8B1e305C3A8E7a6D2f0293" />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <Button
          className="w-full h-12 bg-[#f9f9f9] hover:bg-[#f9f9f9] rounded-full text-[#0b0b0b] shadow-[0px_0px_0px_1px_#0000000A]"
          onClick={() => {
            dispatch(updateAuthModal({ show: false }));
          }}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
}
