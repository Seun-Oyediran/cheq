import { Lock, LockOpen } from '@/components/shared/svgs/icons';
import React from 'react';

export function PositionType() {
  return (
    <div className="app_position_type_popover app_create_position_popover flex flex-col gap-4">
      <p className="app_create_position_popover__title">Type of position</p>

      <div className="app_position_type_popover__body flex flex-col gap-4">
        <button className="w-full text-left">
          <div className="app_position_type_popover__body__item flex items-center gap-2">
            <div className="app_position_type_popover__body__item__icon">
              <Lock />
            </div>

            <div className="">
              <p className="app_position_type_popover__body__item__name">Public positions</p>

              <p className="app_position_type_popover__body__item__info">
                Anyone can match your bet
              </p>
            </div>
          </div>
        </button>

        <button className="w-full text-left">
          <div className="app_position_type_popover__body__item flex items-center gap-2">
            <div className="app_position_type_popover__body__item__icon">
              <LockOpen />
            </div>

            <div className="">
              <p className="app_position_type_popover__body__item__name">Private positions</p>

              <p className="app_position_type_popover__body__item__info">
                Invite opponent with a secure link
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
