import React from 'react';
import { Avi } from '../shared';
import { Settings } from '../shared/svgs/icons';
import { Button } from '../ui';

export function CreatePosition() {
  return (
    <div className="app_create_position flex flex-col justify-between">
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
