import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Add, CaretDown, Remove } from '@/components/shared/svgs/icons';

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

export function Timeframe() {
  const [value, setValue] = useState(1);

  const handleDecrease = () => {
    setValue((prev) => {
      return Math.max(1, prev - 1);
    });
  };

  const handleIncrease = () => {
    setValue((prev) => {
      return Math.min(30, prev + 1);
    });
  };

  return (
    <div className="app_timeframe_popover app_create_position_popover flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex justify-end">
          <button type="button">
            <div className="flex items-center gap-3 app_timeframe_popover__period">
              <p className="app_timeframe_popover__period__text">Days</p>
              <CaretDown width={14} height={14} fill="#9A9A9A" />
            </div>
          </button>
        </div>

        <div className="app_timeframe_popover__time flex flex-col items-center">
          <div className="flex items-center gap-4">
            <button type="button" onClick={handleDecrease}>
              <div className="app_timeframe_popover__time__button">
                <Remove />
              </div>
            </button>
            <div className="app_timeframe_popover__time__value flex justify-center">
              {value
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

          <p className="app_timeframe_popover__time__label">Days</p>
        </div>
      </div>

      <p className="app_timeframe_popover__title">TIMEFRAME</p>
    </div>
  );
}
