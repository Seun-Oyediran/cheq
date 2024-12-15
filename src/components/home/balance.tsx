import React from 'react';
import { Asterik, Star, Trophy } from '../shared/svgs/icons';

export function Balance() {
  return (
    <div className="app_home_balance flex justify-between items-center">
      <div className="">
        <Trophy />
      </div>

      <div className="flex justify-between items-center gap-4">
        <button type="button" className="">
          <Asterik />
        </button>
        <button type="button" className="app_home_balance__star">
          <Star />
        </button>
      </div>
    </div>
  );
}
