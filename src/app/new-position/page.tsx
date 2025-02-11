'use client';
import React from 'react';
import { Tokens } from '@/components/home';
import { CreatePosition, TokenInfo } from '@/components/new-position';
import { Public } from '@/components/shared/svgs/icons';

export default function Page() {
  return (
    <div className="app_new_position flex flex-1">
      <div className="container flex flex-1">
        <div className="app_new_position__flex flex-1 w-full">
          <CreatePosition />

          <div className="app_new_position__right scrollbar flex flex-col gap-14 w-full">
            <TokenInfo />

            <div className="flex flex-col w-full gap-3">
              <div className="w-full">
                <Tokens />
              </div>

              <div className="flex flex-col gap-1 app_new_position__bottom__info">
                <Public />
                <p className="app_new_position__bottom__info__text">
                  We use publicly available data from the blockchain, as well as data procured by
                  cheq and related sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
