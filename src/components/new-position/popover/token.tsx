import React from 'react';
import { Search } from '@/components/shared/svgs/icons';
import { TokenInfo } from '@/components/ui';

export function Token() {
  return (
    <div className="app_token_popover app_create_position_popover flex flex-col gap-4">
      <div className="app_token_popover__top flex items-center gap-2">
        <Search />
        <input
          className="app_token_popover__top__input w-full"
          placeholder="Search Markets"
          type="text"
        />
      </div>

      <div className="app_token_popover__body scrollbar flex flex-col gap-4">
        <TokenInfo />
        <TokenInfo />
        <TokenInfo />
        <TokenInfo />
        <TokenInfo />
      </div>
    </div>
  );
}
