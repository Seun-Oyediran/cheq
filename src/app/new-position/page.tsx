'use client';
import { CreatePosition, TokenInfo } from '@/components/new-position';
import React from 'react';

export default function Page() {
  return (
    <div className="app_new_position flex flex-1">
      <div className="container flex flex-1">
        <div className="app_new_position__flex flex-1">
          <CreatePosition />

          <div className="app_new_position__right">
            <TokenInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
