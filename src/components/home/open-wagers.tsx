import React from 'react';
import Link from 'next/link';
import { Info } from '../shared/svgs/icons';

export function OpenWagers() {
  return (
    <div className="app_open_wagers flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h5 className="app_open_wagers__title">You have no open Wagers yet</h5>
        <p className="app_open_wagers__connect">
          Connect your EVM wallet to begin your Cheq journey
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Link href="#">
          <button className="app_open_wagers__create__position">Create New Position</button>
        </Link>
        <div className="flex items-center gap-1 justify-center">
          <p className="app_open_wagers__learn">Learn how bets work</p>

          <Info />
        </div>
      </div>
    </div>
  );
}
