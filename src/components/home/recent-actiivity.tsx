'use client';
import React from 'react';
import { RecentActivityItem, TimeOptions } from '../shared/home';
import { Info } from '../shared/svgs/icons';

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
  return (
    <div className="app_recent_activity flex flex-col flex-1 gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <h4 className="app_recent_activity__title">Recent Activity</h4>

          <Info width={18} height={18} />
        </div>
        <div className="app_recent_activity__time__options">
          <TimeOptions layoutId="home" />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex flex-col gap-5 flex-1">
          <RecentActivityItem data={leftData} duration={2} />
        </div>

        <div className="flex flex-col gap-5 flex-1 ]">
          <RecentActivityItem data={rightData} duration={3.2} />
        </div>
      </div>
    </div>
  );
}
