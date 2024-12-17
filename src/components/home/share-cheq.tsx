import React from 'react';
import { Share } from '../shared/svgs/icons';

export function ShareCheq() {
  return (
    <div className="app_share_cheq flex flex-col gap-4 justify-center">
      <div className="flex flex-col gap-4 app_share_cheq__top">
        <h4 className="app_share_cheq__title">Unlock perks when you refer cheq to your friends</h4>

        <div className="flex">
          <button type="button">
            <div className="flex gap-2 items-center app_share_cheq__btn">
              <Share />
              <p>Share Cheq</p>
            </div>
          </button>
        </div>
      </div>

      <div className="app_share_cheq__divider"></div>

      <div className="flex flex-col gap-4 app_share_cheq__bottom">
        <h5 className="app_share_cheq__list__title">How it works</h5>
        <ol className="flex flex-col gap-4 app_share_cheq__list">
          <li className="app_share_cheq__list__item">
            Click share Cheq to copy your unique referral link.
          </li>
          <li className="app_share_cheq__list__item">
            Share your referral link with your friends.
          </li>
          <li className="app_share_cheq__list__item">
            Once your friends register and place a wager your referral in counted
          </li>
        </ol>
      </div>
    </div>
  );
}
