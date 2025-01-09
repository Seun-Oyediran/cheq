import React from 'react';
import { Avi } from '../shared';
import { Settings } from '../shared/svgs/icons';
import { Button, TokenIcon } from '../ui';
import { CreatePositionField } from './create-position-field';
import { Metric, PositionType, Timeframe, Token } from './popover';
import home from '@/lib/assets/home';

function TokenValue() {
  return (
    <div className="app_token_value flex items-center gap-2">
      <TokenIcon src={home.degen} size={24} />
      <p>DEGEN/WETH</p>
    </div>
  );
}

export function CreatePosition() {
  return (
    <div className="app_create_position flex flex-col justify-between gap-3 scrollbar">
      <div className="app_create_position__top flex-1">
        <div className="app_create_position__header flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Avi size={40} />

            <button type="button">
              <Settings />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="app_create_position__header__name">Basegod69</p>

            <p className="app_create_position__header__balance">$982.21</p>
          </div>
        </div>

        <div className="app_create_position__body flex flex-col gap-4">
          <CreatePositionField
            label="Token or Memecoin"
            value={<TokenValue />}
            popover={<Token />}
          />

          <CreatePositionField label="Metric" popover={<Metric />} value="FDV" />

          <CreatePositionField label="Position type" popover={<PositionType />} value="Public" />

          <CreatePositionField label="Timeframe" popover={<Timeframe />} value="Public" />
        </div>
      </div>

      <div className="app_create_position__footer flex flex-col gap-4">
        <div className="app_create_position__footer__ctt flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="app_create_position__footer__ctt__text">Total Stake</p>
            <p className="app_create_position__footer__ctt__text">$250</p>
          </div>

          <div className="app_create_position__footer__ctt__divider"></div>

          <div className="flex justify-between items-center">
            <p className="app_create_position__footer__ctt__text">Total Stake</p>
            <p className="app_create_position__footer__ctt__text">$250</p>
          </div>
        </div>
        <Button className="app_create_position__footer__btn">Open New position</Button>
      </div>
    </div>
  );
}
