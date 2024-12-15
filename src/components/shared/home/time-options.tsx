'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const options = [
  { id: 1, label: '5M' },
  { id: 2, label: '1H' },
  { id: 3, label: '6H' },
  { id: 4, label: '1D' },
  { id: 5, label: '1W' },
];

export function TimeOptions() {
  const [active, setActive] = useState(options[0].label);

  return (
    <div className="app_time_options">
      {options.map((item) => (
        <button
          key={item.id}
          type="button"
          className="app_time_options__item"
          onClick={() => {
            setActive(item?.label);
          }}
        >
          <div className="app_time_options__item__ctt">
            <p className="app_time_options__item__ctt__text">{item.label}</p>
          </div>
          {active === item?.label && (
            <motion.div
              layoutId="app_time_options"
              className="app_time_options__item__bg"
            ></motion.div>
          )}
        </button>
      ))}
    </div>
  );
}
