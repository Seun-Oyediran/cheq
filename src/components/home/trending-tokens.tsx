'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowPrice, CaretDown, Language, More, SellTag, StarFilled } from '../shared/svgs/icons';
import { TokenIcon } from '../ui';
import { useFetchCoinstats } from '@/services/tokens';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatLargeNumber, formatSupply } from '@/lib/utils';

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

type SortOption =
  | 'marketCap'
  | 'price'
  | 'volume'
  | 'priceChange1h'
  | 'priceChange1d'
  | 'priceChange7d';

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'price', label: 'Price' },
  { value: 'volume', label: 'Volume' },
  { value: 'priceChange1h', label: '1h Change' },
  { value: 'priceChange1d', label: '24h Change' },
  { value: 'priceChange7d', label: '7d Change' },
];

export function TrendingTokens() {
  const [sortBy, setSortBy] = useState<SortOption>('marketCap');
  const data = useFetchCoinstats({ sortBy, limit: 10 });

  const topToken = data?.result?.[0];

  const selectedSortLabel = sortOptions.find((opt) => opt.value === sortBy)?.label || 'Market Cap';

  return (
    <div className="app_trending_tokens flex-1">
      <div className="app_trending_tokens__header flex justify-between items-center">
        <div className="flex items-center gap-1">
          <SellTag />
          <h4 className="app_trending_tokens__header__text">Trending Tokens</h4>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="app_trending_tokens__header__btn flex items-center">
              <p className="app_trending_tokens__header__btn__text">By {selectedSortLabel}</p>
              <CaretDown />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuRadioGroup
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as SortOption);
              }}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="app_trending_tokens__body flex-1 flex flex-col gap-3">
        {!topToken ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <div className="app_trending_tokens__body__header flex justify-between items-center">
                <TokenIcon src={topToken.icon} size={32} />

                <div className="flex items-center">
                  <More />
                  <StarFilled />
                </div>
              </div>

              <div className="">
                <div className="app_trending_tokens__body__name">
                  <h4 className="app_trending_tokens__body__name__text">{topToken.symbol}</h4>
                  <Link
                    href={topToken.twitterUrl || topToken.explorers?.[0] || '#'}
                    className="app_trending_tokens__body__name__link"
                  >
                    <Language />
                  </Link>
                </div>

                <div className="app_trending_tokens__body__price flex items-center justify-between">
                  <h4 className="app_trending_tokens__body__price__text">
                    {formatLargeNumber(topToken.price)}
                  </h4>

                  <div className="flex items-center gap-1">
                    <ArrowPrice />
                    <p className="app_trending_tokens__body__price__change">
                      <span
                        className={
                          topToken.priceChange1h >= 0
                            ? 'app_trending_tokens__body__price__change__positive'
                            : 'app_trending_tokens__body__price__change__negative'
                        }
                      >
                        {topToken.priceChange1h >= 0 ? '+' : ''}
                        {topToken.priceChange1h?.toFixed(2)}%
                      </span>{' '}
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
                <StatsItem label="Market Cap" value={formatSupply(topToken.marketCap)} />
                <StatsItem label="24h Volume" value={formatSupply(topToken.volume)} />
                <StatsItem
                  label="Circulating supply"
                  value={formatSupply(topToken.availableSupply)}
                />
                <StatsItem label="24h Change" value={`${topToken.priceChange1d?.toFixed(2)}%`} />
                <StatsItem label="7d Change" value={`${topToken.priceChange1w?.toFixed(2)}%`} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
