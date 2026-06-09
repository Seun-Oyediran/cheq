'use client';

import React, { Fragment } from 'react';
import { Add, ArrowPrice, CaretDown, Trending } from '../shared/svgs/icons';
import { TokenIcon } from '../ui';
import { RenderIf } from '../shared';
import { useFetchCoinstats } from '@/services/tokens';
import { formatLargeNumber } from '@/lib/utils';

interface ITopGainerItem {
  isLast?: boolean;
  index: number;
  name?: string;
  symbol?: string;
  price?: number;
  priceChange1d?: number;
  icon?: string;
}

function TopGainerItem(props: ITopGainerItem) {
  const { isLast, index, name, symbol, price, priceChange1d, icon } = props;

  const isPositive = (priceChange1d ?? 0) >= 0;

  return (
    <Fragment>
      <div className="app_top_gainers__item flex justify-between">
        <div className="app_top_gainers__item__left flex items-center gap-4">
          <p className="app_top_gainers__item__index">{index + 1}</p>
          <TokenIcon src={icon} />
          <div className="">
            <h4 className="app_top_gainers__item__left__name">{name}</h4>
            <h5 className="app_top_gainers__item__left__unit">{symbol}</h5>
          </div>
        </div>

        <div className="app_top_gainers__item__right flex items-center gap-4">
          <div className="">
            <h4 className="app_top_gainers__item__right__price">
              {formatLargeNumber(price)}
            </h4>

            <div className="flex items-center gap-1">
              <ArrowPrice positive={isPositive} />
              <h5 className="app_top_gainers__item__right__change">
                {isPositive ? '+' : ''}
                {priceChange1d?.toFixed(2)}%
              </h5>
            </div>
          </div>

          <button type="button" className="app_top_gainers__item__right__add">
            <Add />
          </button>
        </div>
      </div>

      <RenderIf condition={!isLast}>
        <div className="app_trending_tokens__body__divider"></div>
      </RenderIf>
    </Fragment>
  );
}

export function TopGainers() {
  const data = useFetchCoinstats({ sortBy: 'rank', limit: 4 });

  const topGainers = data?.result?.slice(0, 4) || [];

  return (
    <div className="app_trending_tokens app_top_gainers flex-1">
      <div className="app_trending_tokens__header flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Trending />
          <h4 className="app_trending_tokens__header__text">Top gainers</h4>
        </div>

        <button type="button" className="app_trending_tokens__header__btn flex items-center">
          <p className="app_trending_tokens__header__btn__text app_top_gainers__header__btn__text">
            View all
          </p>
          <CaretDown transform="rotate(270)" fill="#9B9FA4" />
        </button>
      </div>

      <div className="app_trending_tokens__body app_top_gainers__body flex-1 flex flex-col">
        {topGainers.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          topGainers.map((item, index) => (
            <TopGainerItem
              key={item.id}
              name={item.name}
              symbol={item.symbol}
              price={item.price}
              priceChange1d={item.priceChange1d}
              icon={item.icon}
              index={index}
              isLast={index === 3}
            />
          ))
        )}
      </div>
    </div>
  );
}
