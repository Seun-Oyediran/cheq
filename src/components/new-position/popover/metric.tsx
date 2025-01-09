import { MintMark, Paid, Trending } from '@/components/shared/svgs/icons';
import React from 'react';

export function Metric() {
  return (
    <div className="app_position_type_popover app_create_position_popover flex flex-col gap-4">
      <p className="app_create_position_popover__title">Type of position</p>

      <div className="app_position_type_popover__body flex flex-col gap-4">
        <button className="w-full text-left">
          <div className="app_position_type_popover__body__item flex items-center gap-2">
            <div className="app_position_type_popover__body__item__icon">
              <MintMark />
            </div>

            <div className="">
              <p className="app_position_type_popover__body__item__name">FDV</p>

              <p className="app_position_type_popover__body__item__info">Fully Diluted Value</p>
            </div>
          </div>
        </button>

        <button className="w-full text-left">
          <div className="app_position_type_popover__body__item flex items-center gap-2">
            <div className="app_position_type_popover__body__item__icon">
              <Paid />
            </div>

            <div className="">
              <p className="app_position_type_popover__body__item__name">MARKETCAP</p>

              <p className="app_position_type_popover__body__item__info">
                The marketcap of a memecoin or token
              </p>
            </div>
          </div>
        </button>

        <button className="w-full text-left">
          <div className="app_position_type_popover__body__item flex items-center gap-2">
            <div className="app_position_type_popover__body__item__icon">
              <Trending width={14} height={14} fill="#5F6368" />
            </div>

            <div className="">
              <p className="app_position_type_popover__body__item__name">PRICE CHANGES</p>

              <p className="app_position_type_popover__body__item__info">
                Predict how many percent token price will change
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
