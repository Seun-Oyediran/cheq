import React from 'react';
import {
  Balance,
  OpenWagers,
  QuickMatch,
  RecentActiivity,
  Tokens,
  TopGainers,
  TrendingTokens,
} from '@/components/home';

export default function Home() {
  return (
    <main className="app_home">
      <Balance />

      <div className="flex justify-center">
        <OpenWagers />
      </div>

      <div className="flex gap-5">
        <TrendingTokens />

        <TopGainers />

        <QuickMatch />
      </div>

      <div className="">
        <Tokens />
      </div>

      <div>
        <RecentActiivity />
      </div>
    </main>
  );
}
