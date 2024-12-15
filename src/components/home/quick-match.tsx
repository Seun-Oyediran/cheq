import React from 'react';
import { ArrowForward, NewReleases } from '../shared/svgs/icons';
import { QuickMatchCard } from '../shared/home';

export function QuickMatch() {
  return (
    <div className="app_trending_tokens flex-1">
      <div className="app_trending_tokens__header flex justify-between items-center">
        <div className="flex items-center gap-1">
          <NewReleases />
          <h4 className="app_trending_tokens__header__text">Quick Match</h4>
        </div>

        <div className="flex justify-center items-center p-2">
          <ArrowForward />
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        <QuickMatchCard name="Blvckish" address="0xfd18...378a" aviVariant="aquafresh" />
        <QuickMatchCard isAnonymous variant="accept" aviVariant="lightgray" />
      </div>
    </div>
  );
}
