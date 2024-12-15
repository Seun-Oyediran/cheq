'use client';
import React, { useEffect, useState } from 'react';
import { RecentActivityItem, TimeOptions } from '../shared/home';
import { Info } from '../shared/svgs/icons';
import { AnimatePresence } from 'framer-motion';

const leftData = [
  { id: 1, name: 'Basegod69', action: 'Signed up' },
  { id: 2, name: 'Fezcr', action: 'Opened a position' },
  { id: 3, name: 'Grey.base', action: 'Signed up' },
  { id: 4, name: 'Incognito', action: 'Signed up' },
];

const rightData = [
  { id: 1, name: 'Blvkishh ', action: 'Signed up' },
  { id: 2, name: 'Cryptokelz', action: 'Closed a position' },
  { id: 3, name: 'Basegod69', action: 'Signed up' },
  { id: 4, name: 'Akira', action: 'Signed up' },
];

export function RecentActiivity() {
  const [leftLiveData, setLeftLiveData] = useState(leftData);
  const [rightLiveData, setRightLiveData] = useState(rightData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeftLiveData((prevData) => {
        const updatedData = [...prevData];
        const firstElement = updatedData.shift();
        if (firstElement) {
          firstElement.id += 4;
          updatedData.push(firstElement);
        }
        return updatedData;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRightLiveData((prevData) => {
        const updatedData = [...prevData];
        const firstElement = updatedData.shift();
        if (firstElement) {
          firstElement.id += 4;
          updatedData.push(firstElement);
        }
        return updatedData;
      });
    }, 2700);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app_recent_activity flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <h4 className="app_recent_activity__title">Recent Activity</h4>

          <Info width={18} height={18} />
        </div>
        <div className="">
          <TimeOptions />
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        <div className="flex items-center gap-5">
          <div className="flex flex-col gap-5 flex-1">
            {leftLiveData.map((item) => (
              <RecentActivityItem
                key={item.id}
                action={item.action}
                id={item.id}
                name={item.name}
              />
            ))}
          </div>

          <div className="flex flex-col gap-5 flex-1">
            {rightLiveData.map((item) => (
              <RecentActivityItem
                key={item.id}
                action={item.action}
                id={item.id}
                name={item.name}
              />
            ))}
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
