import React from 'react';
import home from '@/lib/assets/home';
import { TokenIcon } from './token-icon';
import { Base } from '../shared/svgs/icons';

export function TokenInfo() {
  return (
    <div className="flex gap-2">
      <div className="app_header_search_popover__item__icon">
        <TokenIcon src={home.degenLayer} size={32} />
        <div className="app_header_search_popover__item__icon__base">
          <Base />
        </div>
      </div>
      <div>
        <p className="app_header_search_popover__item__name">DEGENLAYER</p>
        <p className="app_header_search_popover__item__address flex gap-1 items-end">
          <span>DEGEN</span>
          0x0293...0293
        </p>
      </div>
    </div>
  );
}
