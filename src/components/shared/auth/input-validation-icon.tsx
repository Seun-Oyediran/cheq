'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { type MotionValue, motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { interpolate } from 'flubber';

export type InputState = 'idle' | 'busy' | 'done' | 'error';

const BADGE_OUTER = "M6.688 17.655l-1.209-2.042-2.291-.5a.79.79 0 0 1-.5-.323.77.77 0 0 1-.146-.573l.229-2.354-1.563-1.792A.78.78 0 0 1 1 9.53q0-.314.208-.542l1.563-1.792-.23-2.354a.77.77 0 0 1 .147-.573.79.79 0 0 1 .5-.323l2.291-.5 1.209-2.041a.82.82 0 0 1 1.041-.334l2.167.917 2.166-.917a.82.82 0 0 1 1.042.333l1.208 2.042 2.292.5q.313.063.5.323a.77.77 0 0 1 .146.573l-.23 2.354 1.563 1.792a.78.78 0 0 1 .209.542q0 .313-.209.541l-1.562 1.792.229 2.354q.042.313-.146.573a.79.79 0 0 1-.5.323l-2.291.5-1.209 2.042a.82.82 0 0 1-.458.364.8.8 0 0 1-.584-.03l-2.166-.918-2.167.917a.82.82 0 0 1-1.042-.333Z";

const CHECKMARK = "M9.02 10.113 7.814 8.926a.78.78 0 0 0-.573-.23.81.81 0 0 0-.594.25.8.8 0 0 0-.23.584q0 .354.23.583l1.792 1.792a.8.8 0 0 0 .583.25.8.8 0 0 0 .583-.25l3.542-3.542a.76.76 0 0 0 .24-.583.85.85 0 0 0-.833-.844.78.78 0 0 0-.595.24z";

const edgePaths: Record<InputState, string> = {
  idle: "M9.896 1.031C14.59 1.031 18.396 4.837 18.396 9.531C18.396 14.225 14.59 18.031 9.896 18.031C5.202 18.031 1.396 14.225 1.396 9.531C1.396 4.837 5.202 1.031 9.896 1.031Z",
  busy: BADGE_OUTER,
  done: BADGE_OUTER,
  error: "M9.896 1.031C14.59 1.031 18.396 4.837 18.396 9.531C18.396 14.225 14.59 18.031 9.896 18.031C5.202 18.031 1.396 14.225 1.396 9.531C1.396 4.837 5.202 1.031 9.896 1.031Z",
};

const cutoutPaths: Record<InputState, string> = {
  idle: "M9.896 3.031C13.486 3.031 16.396 5.941 16.396 9.531C16.396 13.121 13.486 16.031 9.896 16.031C6.306 16.031 3.396 13.121 3.396 9.531C3.396 5.941 6.306 3.031 9.896 3.031Z",
  busy: "M7.771 16.155l2.125-.917 2.166.917 1.167-2 2.292-.542-.209-2.333 1.542-1.75-1.541-1.792.13-1.455a1 1 0 0 0-.783-1.066l-1.43-.312-1.21-2-2.124.916-2.167-.916-1.166 2-2.292.5.208 2.333L2.938 9.53l1.541 1.75-.208 2.375 2.292.5z",
  done: "M7.32 15.408a1 1 0 0 0 1.252.401l1.324-.57 1.356.573a1 1 0 0 0 1.254-.417l.723-1.24 1.449-.343a1 1 0 0 0 .766-1.062l-.132-1.47.967-1.097a1 1 0 0 0 .007-1.313l-.974-1.132.13-1.455a1 1 0 0 0-.782-1.066l-1.43-.312-.758-1.254a1 1 0 0 0-1.252-.4l-1.324.57-1.357-.573a1 1 0 0 0-1.253.417l-.723 1.24-1.43.312a1 1 0 0 0-.784 1.066l.13 1.455-.974 1.132a1 1 0 0 0 .008 1.313l.966 1.097-.131 1.498a1 1 0 0 0 .783 1.064l1.431.313z",
  error: "M9.896 3.031C13.486 3.031 16.396 5.941 16.396 9.531C16.396 13.121 13.486 16.031 9.896 16.031C6.306 16.031 3.396 13.121 3.396 9.531C3.396 5.941 6.306 3.031 9.896 3.031Z",
};

const contentLeft: Record<InputState, string> = {
  idle: "M6 9L8.333 9L8.333 11L6 11A1 1 0 0 1 5 10A1 1 0 0 1 6 9Z",
  busy: "M6.25 8C6.94 8 7.5 8.56 7.5 9.25C7.5 9.94 6.94 10.5 6.25 10.5C5.56 10.5 5 9.94 5 9.25C5 8.56 5.56 8 6.25 8Z",
  done: CHECKMARK,
  error: "M6 9L8.333 9L8.333 11L6 11A1 1 0 0 1 5 10A1 1 0 0 1 6 9Z",
};

const contentMid: Record<InputState, string> = {
  idle: "M8.333 9L11.667 9L11.667 11L8.333 11Z",
  busy: "M9.75 8C10.44 8 11 8.56 11 9.25C11 9.94 10.44 10.5 9.75 10.5C9.06 10.5 8.5 9.94 8.5 9.25C8.5 8.56 9.06 8 9.75 8Z",
  done: CHECKMARK,
  error: "M8.333 9L11.667 9L11.667 11L8.333 11Z",
};

const contentRight: Record<InputState, string> = {
  idle: "M11.667 9L14 9A1 1 0 0 1 15 10A1 1 0 0 1 14 11L11.667 11Z",
  busy: "M13.25 8C13.94 8 14.5 8.56 14.5 9.25C14.5 9.94 13.94 10.5 13.25 10.5C12.56 10.5 12 9.94 12 9.25C12 8.56 12.56 8 13.25 8Z",
  done: CHECKMARK,
  error: "M11.667 9L14 9A1 1 0 0 1 15 10A1 1 0 0 1 14 11L11.667 11Z",
};

const COLORS: Record<InputState, string> = {
  idle: '#9B9FA4',
  busy: '#00C978',
  done: '#00C978',
  error: '#F36C78',
};

const FLUBBER_OPTS = { maxSegmentLength: 1 };

const BOUNCE_STYLE = `
@keyframes dot-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-0.8px); }
}
`;

function useFlubber(from: string, to: string, progress: MotionValue<number>) {
  const interp = useMemo(() => {
    if (from === to) return () => to;
    try {
      return interpolate(from, to, FLUBBER_OPTS);
    } catch {
      return (t: number) => (t < 0.5 ? from : to);
    }
  }, [from, to]);

  return useTransform(progress, (t) => interp(t));
}

export function InputValidationIcon({ state }: { state: InputState }) {
  const progress = useMotionValue(0);
  const [current, setCurrent] = useState(state);
  const [bouncing, setBouncing] = useState(false);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (styleRef.current) return;
    const style = document.createElement('style');
    style.textContent = BOUNCE_STYLE;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => {
      style.remove();
      styleRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (state === current) return;

    progress.set(0);

    const startMorph = () => {
      const controls = animate(progress, 1, {
        duration: 0.45,
        ease: [0.4, 0, 0.2, 1],
        onComplete: () => {
          setCurrent(state);
          if (state === 'busy') { setBouncing(true); }
        },
      });
      return controls.stop;
    };

    if (current === 'busy') {
      setBouncing(false);
      const timer = setTimeout(startMorph, 200);
      return () => { clearTimeout(timer); };
    }

    return startMorph();
  }, [state, current, progress]);

  const edgeD = useFlubber(edgePaths[current], edgePaths[state], progress);
  const cutoutD = useFlubber(cutoutPaths[current], cutoutPaths[state], progress);
  const leftD = useFlubber(contentLeft[current], contentLeft[state], progress);
  const midD = useFlubber(contentMid[current], contentMid[state], progress);
  const rightD = useFlubber(contentRight[current], contentRight[state], progress);

  const bounceStyle = (delay: string): React.CSSProperties =>
    bouncing ? { animation: `dot-bounce 0.5s ease-in-out ${delay} infinite` } : {};

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
      <motion.path
        d={edgeD}
        fill={COLORS[current]}
        animate={{ fill: COLORS[state] }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      />
      <motion.path d={cutoutD} fill="#FFFFFF" />
      <g style={bounceStyle('0s')}>
        <motion.path
          d={leftD}
          fill={COLORS[current]}
          animate={{ fill: COLORS[state] }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </g>
      <g style={bounceStyle('0.15s')}>
        <motion.path
          d={midD}
          fill={COLORS[current]}
          animate={{ fill: COLORS[state] }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </g>
      <g style={bounceStyle('0.3s')}>
        <motion.path
          d={rightD}
          fill={COLORS[current]}
          animate={{ fill: COLORS[state] }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </g>
    </svg>
  );
}
