import React, { useState } from 'react';
import Link from 'next/link';
import { Popover } from 'react-tiny-popover';
import { Info } from '../shared/svgs/icons';
import routes from '@/lib/routes';

function PopoverContent() {
  return (
    <div className="app_open_wagers__popover">
      <p className="app_open_wagers__popover__text">
        Bets are made on memecoins created on the base chain, Players can bet on metrics of the
        memecoins against other players.
      </p>
    </div>
  );
}

export function OpenWagers() {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="app_open_wagers flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h5 className="app_open_wagers__title">You have no open Wagers yet</h5>
        <p className="app_open_wagers__connect">
          Connect your EVM wallet to begin your Cheq journey
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Link href={routes.newPosition.path}>
          <button className="app_open_wagers__create__position">Create New Position</button>
        </Link>
        <div className="flex items-center gap-1 justify-center">
          <p className="app_open_wagers__learn">Learn how bets work</p>

          <Popover
            isOpen={showPopover}
            positions={['top', 'bottom']}
            align="center"
            padding={8}
            content={<PopoverContent />}
            onClickOutside={() => {
              setShowPopover(false);
            }}
          >
            <button
              type="button"
              onClick={() => {
                setShowPopover(true);
              }}
            >
              <Info />
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
