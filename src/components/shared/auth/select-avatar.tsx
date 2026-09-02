'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { motion, animate } from 'framer-motion';
import { useAppContext } from '@/state/context';
import { Button } from '@/components/ui';
import { updateAuthModal } from '@/state/reducer';
import { ChevronLeftIcon, XIcon } from 'lucide-react';
import {
  COLORS,
  EXPRESSIONS,
  FRAME_D,
  FACE_D,
  PATHS,
  IDLE_ANIMATIONS,
  type ColorScheme,
} from '@/lib/avatar-shapes';

function AvatarFace({
  exprIdx,
  color,
  size,
  borderRef,
}: {
  exprIdx: number;
  color: ColorScheme;
  size: number;
  borderRef?: React.Ref<SVGRectElement>;
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

  const fillId = `avatar-fill${uid}`;
  const borderId = `avatar-border${uid}`;

  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <defs>
        <linearGradient id={fillId} x1="20" x2="20" y1="-3" y2="40" gradientUnits="userSpaceOnUse">
          <stop
            offset="0.299"
            style={{ stopColor: color.gradientFrom, transition: 'stop-color 250ms ease' }}
          />
          <stop
            offset="1"
            style={{ stopColor: color.gradientTo, transition: 'stop-color 250ms ease' }}
          />
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
      <rect
        width="39"
        height="39"
        x="0.5"
        y="0.5"
        rx="9.5"
        style={{ fill: color.bg, transition: 'fill 250ms ease 80ms' }}
      />
      <rect
        ref={borderRef}
        width="39"
        height="39"
        x="0.5"
        y="0.5"
        fill="none"
        stroke={`url(#${borderId})`}
        rx="9.5"
      />
      <path d={FRAME_D} fill={`url(#${fillId})`} />
      <path d={FACE_D} style={{ fill: color.bg, transition: 'fill 250ms ease 40ms' }} />
      <path ref={leftRef} fill={`url(#${fillId})`} />
      <path ref={rightRef} fill={`url(#${fillId})`} />
      <path ref={mouthRef} fill={`url(#${fillId})`} />
    </svg>
  );
}

export function SelectAvatar() {
  const { state, dispatch } = useAppContext();
  const [exprIdx, setExprIdx] = useState(2);
  const [colorIdx, setColorIdx] = useState(2);
  const [selectedColorIdx, setSelectedColorIdx] = useState(2);
  const [showExpressions, setShowExpressions] = useState(false);
  const _username = state.authModal.username;
  const avatarBorderRef = useRef<SVGRectElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const avatarWrapperRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  const wait = async (ms: number) => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const handleColorChange = async (newIdx: number) => {
    if (newIdx === selectedColorIdx || animatingRef.current) return;
    animatingRef.current = true;
    setSelectedColorIdx(newIdx);

    const wrapper = avatarWrapperRef.current;
    const border = avatarBorderRef.current;
    const inner = innerRingRef.current;
    const outer = outerRingRef.current;
    if (!wrapper || !border || !inner || !outer) {
      setColorIdx(newIdx);
      animatingRef.current = false;
      return;
    }

    // 1. Fade rings + spin to edge-on (270°: 1.5 visible rotations)
    for (const el of [border as unknown as HTMLElement, inner, outer]) {
      el.style.transition = 'opacity 120ms ease';
      el.style.opacity = '0';
    }
    wrapper.style.transition = 'transform 650ms cubic-bezier(0.4, 0, 1, 1)';
    wrapper.style.transform = 'scale(1.15) translateY(-6px) rotateY(450deg)';
    await wait(660);

    // 2. Final half-turn out + land (completes 3rd visible rotation)
    wrapper.style.transition = 'none';
    wrapper.style.transform = 'scale(1.15) translateY(-6px) rotateY(-90deg)';
    void wrapper.offsetHeight;
    wrapper.style.transition = 'transform 500ms cubic-bezier(0, 0, 0.08, 1)';
    wrapper.style.transform = '';
    await wait(240);

    setColorIdx(newIdx);

    // 4. Fade borders + rings back in (staggered)
    (border as unknown as HTMLElement).style.transition = 'opacity 200ms ease';
    (border as unknown as HTMLElement).style.opacity = '1';
    inner.style.transition = 'opacity 200ms ease 60ms';
    inner.style.opacity = '1';
    outer.style.transition = 'opacity 200ms ease 120ms';
    outer.style.opacity = '1';
    await wait(330);

    animatingRef.current = false;
  };

  const color = COLORS[colorIdx];

  return (
    <div className="app_login h-full flex flex-col app_select_avatar px-6! bg-[#1E1E1E] py-7!">
      <div className="relative flex items-center justify-center pt-2! pb-6!">
        <button
          type="button"
          className="absolute left-0"
          onClick={() => {
            dispatch(updateAuthModal({ show: true, variant: 'createAccount' }));
          }}
        >
          <ChevronLeftIcon size={18} color="#9B9FA4" />
        </button>
        <h3 className="app_login__top__title__text text-[#F9F9F9CC]!">Select your avatar</h3>
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
          <div className="relative" style={{ perspective: 600 }}>
            <div
              ref={outerRingRef}
              className="absolute"
              style={{ inset: -8, borderRadius: 17.5, border: `1.5px solid ${color.borderTo}12` }}
            />
            <div
              ref={innerRingRef}
              className="absolute"
              style={{ inset: -4, borderRadius: 13.5, border: `1.5px solid ${color.borderTo}33` }}
            />
            <div ref={avatarWrapperRef} style={{ transformStyle: 'preserve-3d' }}>
              {/* Front face */}
              <div style={{ backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}>
                <AvatarFace exprIdx={exprIdx} color={color} size={40} borderRef={avatarBorderRef} />
              </div>
              {/* Edge layers */}
              {[1, 0, -1, -2].map((z) => (
                <div
                  key={z}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 9.5,
                    background: color.gradientTo,
                    transform: `translateZ(${z}px)`,
                    transition: 'background 250ms ease',
                  }}
                />
              ))}
              {/* Back face */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg) translateZ(2px)',
                }}
              >
                <AvatarFace exprIdx={exprIdx} color={color} size={40} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center" style={{ height: 26 }}>
          {showExpressions ? (
            <div className="flex justify-center gap-2 items-center">
              {EXPRESSIONS.map((expr, i) => {
                const p = PATHS[i];
                const active = exprIdx === i;
                const btnSize = active ? 26 : 16;
                return (
                  <div
                    key={expr.key}
                    className="flex items-center justify-center"
                    // style={{ width: 26, height: 26 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setExprIdx(i);
                      }}
                      className="cursor-pointer overflow-hidden"
                      style={{ borderRadius: 3, backgroundColor: active ? '#292929' : '#29292980' }}
                      animate={{ width: btnSize, height: btnSize }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <svg viewBox="12 14 16 9" className="w-full h-full">
                        <path d={p.left} fill="#FFFFFF" />
                        <path d={p.right} fill="#FFFFFF" />
                      </svg>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center gap-2 items-center">
              {COLORS.map((c, i) => {
                const active = selectedColorIdx === i;
                const btnSize = active ? 23 : 16;
                return (
                  <div
                    key={c.key}
                    className="flex items-center justify-center"
                    // style={{ width: 23, height: 23 }}
                  >
                    <motion.button
                      onClick={() => {
                        void handleColorChange(i);
                      }}
                      className={`rounded-full overflow-hidden cursor-pointer ${active ? 'ring-1 ring-white' : ''}`}
                      animate={{ width: btnSize, height: btnSize, rotate: active ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <svg viewBox="0 0 32 32" className="w-full h-full">
                        <circle cx="16" cy="16" r="16" fill={c.gradientFrom} />
                        <path d="M32 0 L32 32 L0 32 Z" fill={c.gradientTo} />
                      </svg>
                    </motion.button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex justify-center mt-4!">
          <Button
            className="h-6.5 px-2! bg-[#292929] rounded-[30px] text-[#F9F9F9E5]!"
            style={{ fontSize: 12 }}
            onClick={() => {
              setShowExpressions((v) => !v);
            }}
          >
            Customize
          </Button>
        </div>
      </div>

      <div className="mb-3">
        <Button
          className="w-full h-12 bg-[#f9f9f9] hover:bg-[#f9f9f9] rounded-full text-[#0b0b0b] shadow-[0px_0px_0px_1px_#0000000A]"
          onClick={() => {
            dispatch(
              updateAuthModal({
                show: true,
                variant: 'welcome',
              })
            );
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
