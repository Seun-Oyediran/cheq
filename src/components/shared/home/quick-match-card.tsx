import React from 'react';
import { Avi } from '../avi';
import { type IAviVariants } from '@/lib/utils/static';

interface IProps {
  name?: string;
  address?: string;
  variant?: 'pending' | 'accept';
  isAnonymous?: boolean;
  aviVariant?: IAviVariants;
}

export function QuickMatchCard(props: IProps) {
  const { name, variant = 'pending', isAnonymous = false, address, aviVariant } = props;

  const _name = isAnonymous ? 'anonymous' : name;

  return (
    <div className={`app_quick_match_card flex-1 flex flex-col justify-between gap-3 ${_name}`}>
      <div className="flex flex-col gap-3 items-center justify-between px-3">
        <div className="flex flex-col gap-2 items-center">
          <Avi variant={aviVariant} />

          <div className="">
            <h4 className="app_quick_match_card__name">{_name}</h4>
            <p className="app_quick_match_card__address">
              {isAnonymous ? '**************' : address}
            </p>
          </div>
        </div>

        <h3 className="app_quick_match_card__amount">$500</h3>

        <div className={`app_quick_match_card__action ${variant}`}>
          <p className="app_quick_match_card__action__text">{variant} Match</p>
        </div>
      </div>

      <div className="">
        <div className="app_quick_match_card__details bottom">
          <p className="app_quick_match_card__details__text">
            DGN MC to $270M - <span className="app_quick_match_card__details__text__val">YES</span>
          </p>
        </div>

        <div className="app_quick_match_card__details">
          <p className="app_quick_match_card__details__text">
            Reward Pool <span className="app_quick_match_card__details__text__val">$950</span>
          </p>
        </div>
      </div>
    </div>
  );
}
