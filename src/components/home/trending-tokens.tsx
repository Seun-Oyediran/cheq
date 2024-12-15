import React from 'react';
import Link from 'next/link';
import { ArrowPrice, CaretDown, Language, More, SellTag, StarFilled } from '../shared/svgs/icons';
import home from '@/lib/assets/home';
import { TokenIcon } from '../ui';

interface IStatsItem {
  label?: string;
  value?: string;
}

function StatsItem(props: IStatsItem) {
  const { label, value } = props;

  return (
    <div className="app_trending_tokens__body__stats__item flex flex-col gap-1">
      <p className="app_trending_tokens__body__stats__item__label">{label}</p>

      <p className="app_trending_tokens__body__stats__item__value">{value}</p>
    </div>
  );
}

export function TrendingTokens() {
  return (
    <div className="app_trending_tokens flex-1">
      <div className="app_trending_tokens__header flex justify-between items-center">
        <div className="flex items-center gap-1">
          <SellTag />
          <h4 className="app_trending_tokens__header__text">Trending Tokens</h4>
        </div>

        <button type="button" className="app_trending_tokens__header__btn flex items-center">
          <p className="app_trending_tokens__header__btn__text">By Marketcap</p>
          <CaretDown />
        </button>
      </div>

      <div className="app_trending_tokens__body flex-1 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <div className="app_trending_tokens__body__header flex justify-between items-center">
            <TokenIcon src={home.degen} size={32} />

            <div className="flex items-center">
              <More />
              <StarFilled />
            </div>
          </div>

          <div className="">
            <div className="app_trending_tokens__body__name">
              <h4 className="app_trending_tokens__body__name__text">DEGEN</h4>
              <Link href="#" className="app_trending_tokens__body__name__link">
                <Language />
              </Link>
            </div>

            <div className="app_trending_tokens__body__price flex items-center justify-between">
              <h4 className="app_trending_tokens__body__price__text">$0.0218</h4>

              <div className="flex items-center gap-1">
                <ArrowPrice />
                <p className="app_trending_tokens__body__price__change">
                  <span className="app_trending_tokens__body__price__change__negative">0.03%</span>{' '}
                  (Past hour)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="app_trending_tokens__body__divider"></div>

        <div className="flex flex-col gap-2 app_trending_tokens__body__stats">
          <h5 className="app_trending_tokens__body__stats__title">Stats</h5>
          <div className="app_trending_tokens__body__stats__con">
            <StatsItem label="Market Cap" value="$215,417,598.65" />
            <StatsItem label="24h Volume" value="$22,091,928.09" />
            <StatsItem label="Circulating supply" value="8,928,982" />
            <StatsItem label="14 week high" value="$0.629" />
            <StatsItem label="14 week low" value="$0.0129" />
          </div>
        </div>
      </div>
    </div>
  );
}
