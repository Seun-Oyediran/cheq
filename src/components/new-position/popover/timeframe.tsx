'use client';
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Add, CaretDown, Remove } from '@/components/shared/svgs/icons';
import { spring } from '@/lib/utils/static';

interface IAnimatedNumber {
  value: number;
}

function AnimatedNumber(props: IAnimatedNumber) {
  const { value } = props;

  return (
    <motion.div
      animate={{
        y: `${-72 * value}px`,
      }}
      transition={spring}
      className="flex flex-col app_timeframe_popover__time__value__animated"
    >
      {Array(10)
        .fill(0)
        .map((_, index) => (
          <h2 key={index} className="app_timeframe_popover__time__value__text">
            {index}
          </h2>
        ))}
    </motion.div>
  );
}

const timeOptions = [
  { id: 1, label: 'Days', value: 'days' },
  { id: 2, label: 'Weeks', value: 'weeks' },
  { id: 3, label: 'Months', value: 'months' },
];

const maxNumber = {
  days: 30,
  weeks: 4,
  months: 1,
};

type IDurationType = keyof typeof maxNumber;

export function Timeframe() {
  const [durationType, setDurationType] = useState<IDurationType>('days');
  const [duration, setDuration] = useState({ days: 1, weeks: 1, months: 1 });
  const [durationTypePopover, setDurationTypePopover] = useState(false);

  const handleDecrease = () => {
    setDuration((prev) => ({
      ...prev,
      [durationType]: Math.max(1, prev?.[durationType] - 1),
    }));
  };

  const handleIncrease = () => {
    setDuration((prev) => ({
      ...prev,
      [durationType]: Math.min(maxNumber?.[durationType], prev?.[durationType] + 1),
    }));
  };

  useEffect(() => {
    setDurationTypePopover(false);
  }, [durationType]);

  return (
    <div className="app_timeframe_popover app_create_position_popover flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end app_timeframe_popover__options">
          <button
            type="button"
            onClick={() => {
              setDurationTypePopover((prev) => !prev);
            }}
          >
            <div className="flex items-center justify-between gap-3 app_timeframe_popover__period">
              <p className="app_timeframe_popover__period__text capitalize">{durationType}</p>
              <CaretDown width={14} height={14} fill="#9A9A9A" />
            </div>
          </button>
          <AnimatePresence initial={false} mode="wait">
            {durationTypePopover && (
              <motion.div
                className="app_timeframe_popover__options__absolute"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: {
                    maxHeight: '100px',
                    transition: { duration: 0.2 },
                  },
                  collapsed: {
                    maxHeight: '0px',
                    transition: { duration: 0.2 },
                  },
                }}
              >
                <div className="app_timeframe_popover__options__dropdown flex flex-col gap-1">
                  {timeOptions.map((item) => (
                    <button
                      type="button"
                      key={item?.id}
                      onClick={() => {
                        setDurationType(item?.value as IDurationType);
                      }}
                    >
                      <p className="app_timeframe_popover__options__dropdown__item">
                        {item?.label}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="app_timeframe_popover__time flex flex-col items-center">
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleDecrease}>
              <div className="app_timeframe_popover__time__button">
                <Remove />
              </div>
            </button>
            <div className="app_timeframe_popover__time__value flex justify-center">
              {duration?.[durationType]
                .toString()
                .split('')
                .map((digit, index) => (
                  <AnimatedNumber key={index} value={Number(digit)} />
                ))}
            </div>

            <button type="button" onClick={handleIncrease}>
              <div className="app_timeframe_popover__time__button">
                <Add width={16} height={16} />
              </div>
            </button>
          </div>

          <p className="app_timeframe_popover__time__label capitalize">{durationType}</p>
        </div>
      </div>

      <p className="app_timeframe_popover__title">TIMEFRAME</p>
    </div>
  );
}
