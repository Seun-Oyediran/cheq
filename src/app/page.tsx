'use client';
import React from 'react';
import {
  Balance,
  OpenWagers,
  QuickMatch,
  RecentActiivity,
  ShareCheq,
  Tokens,
  TopGainers,
  TrendingTokens,
} from '@/components/home';

export default function Home() {
  return (
    <main className="app_home">
      <div className="container">
        <Balance />
      </div>

      <div className="container">
        <div className="flex justify-center">
          <OpenWagers />
        </div>
      </div>

      <div className="container">
        <div className="flex gap-5">
          <TrendingTokens />

          <TopGainers />

          <QuickMatch />
        </div>
      </div>

      <div className="container">
        <Tokens />
      </div>

      <div className="app_home__recent__activities">
        <div className="container">
          <div className="app_home__recent__activities__flex">
            <RecentActiivity />
            <ShareCheq />
          </div>
        </div>
      </div>
    </main>
  );
}
