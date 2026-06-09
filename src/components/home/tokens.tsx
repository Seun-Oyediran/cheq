'use client';
import React, { useState } from 'react';
import { CaretDown, FilterList, ShowChart, Trophy } from '../shared/svgs/icons';
import { TokenIcon } from '../ui';
import { useFetchCoinstats } from '@/services/tokens';
import { formatLargeNumber, formatSupply } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type SortOption = 'marketCap' | 'volume' | 'price' | 'priceChange1d';

const options: Array<{ id: number; label: string; sortBy: SortOption }> = [
  { id: 1, label: 'FDV', sortBy: 'price' },
  { id: 2, label: 'Volume', sortBy: 'volume' },
  { id: 3, label: 'Marketcap', sortBy: 'marketCap' },
  { id: 4, label: 'Open bets', sortBy: 'priceChange1d' },
];

const timePeriods = [
  { id: '24h', label: 'Last 24 hours' },
  { id: '5m', label: '5M' },
  { id: '1h', label: '1H' },
  { id: '6h', label: '6H' },
  { id: '1d', label: '1D' },
  { id: '1w', label: '1W' },
];

const rankByOptions = [
  { value: 'rank', label: 'Rank' },
  { value: 'marketCap', label: 'Market Cap' },
  { value: 'volume', label: 'Volume' },
  { value: 'price', label: 'Price' },
  { value: 'priceChange1h', label: '1h Change' },
  { value: 'priceChange1d', label: '24h Change' },
  { value: 'priceChange7d', label: '7d Change' },
];

export function Tokens() {
  const [selectedOption, setSelectedOption] = useState(options[2]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('24h');
  const [rankBy, setRankBy] = useState<SortOption>('marketCap');

  const data = useFetchCoinstats({ sortBy: selectedOption.sortBy, limit: 20 });

  const tokens = data?.result || [];

  return (
    <div className="app_home_tokens flex flex-col gap-6">
      <div className="app_home_tokens__options flex items-center gap-2">
        {options.map((item) => (
          <button
            key={item.id}
            className={`app_home_tokens__options__btn ${selectedOption.id === item.id && 'active'}`}
            type="button"
            onClick={() => {
              setSelectedOption(item);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="app_home_tokens__title">Tokens</h3>
        <div className="app_home_tokens__filter">
          <div className="app_home_tokens__filter__left">
            <div className="app_home_tokens__filter__left__time">
              {timePeriods.map((period, index) => (
                <div
                  key={period.id}
                  className={`flex items-center ${
                    index === 0
                      ? 'app_home_tokens__filter__left__time__first'
                      : 'app_home_tokens__filter__left__time__con'
                  } ${selectedTimePeriod === period.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTimePeriod(period.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <p className="app_home_tokens__filter__left__time__text">{period.label}</p>
                  {index === 0 && <CaretDown fill="#9B9FA4" />}
                </div>
              ))}
            </div>

            <div className="app_home_tokens__filter__left__top flex items-center gap-1">
              <ShowChart />
              <p className="app_home_tokens__filter__left__top__text">Top</p>
            </div>
          </div>

          <div className="app_home_tokens__filter__right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="app_home_tokens__filter__right__rank flex items-center gap-1">
                  <Trophy width={16} height={16} fill="#9B9FA4" />
                  <p className="app_home_tokens__filter__right__rank__text">
                    Rank By: {rankByOptions.find((opt) => opt.value === rankBy)?.label}
                  </p>
                  <CaretDown fill="#9B9FA4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuRadioGroup
                  value={rankBy}
                  onValueChange={(value) => {
                    setRankBy(value as SortOption);
                    setSelectedOption({
                      ...selectedOption,
                      sortBy: value as SortOption,
                    });
                  }}
                >
                  {rankByOptions.map((option) => (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <button className="app_home_tokens__filter__right__filter" type="button">
              <FilterList />
            </button>
          </div>
        </div>
      </div>

      <div className="app_home_tokens__table__wrapper">
        <div className="app_home_tokens__table scrollbar">
          <table className="table-auto app_home_tokens__table__ctt w_full">
            <thead className="app_home_tokens__table__ctt__thead">
              <tr>
                <th className="app_home_tokens__table__ctt__thead__th">Token Name</th>
                <th className="app_home_tokens__table__ctt__thead__th">Price</th>
                <th className="app_home_tokens__table__ctt__thead__th">FDV</th>
                <th className="app_home_tokens__table__ctt__thead__th">1H</th>
                <th className="app_home_tokens__table__ctt__thead__th">24H</th>
                <th className="app_home_tokens__table__ctt__thead__th">7D</th>
                <th className="app_home_tokens__table__ctt__thead__th">24H VOLUME</th>
                <th className="app_home_tokens__table__ctt__thead__th">MARKET CAP</th>
                <th className="app_home_tokens__table__ctt__thead__th">SUPPLY</th>
              </tr>
            </thead>
            <tbody className="app_home_tokens__table__ctt__tbody">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={9} className="app_home_tokens__table__ctt__tbody__td text-center py-8">
                    <p className="text-muted-foreground">Loading...</p>
                  </td>
                </tr>
              ) : (
                tokens.map((token, index) => (
                  <tr key={token.id}>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      <div className="app_home_tokens__table__ctt__tbody__td__token">
                        <div className="flex items-center gap-1">
                          <p className="app_home_tokens__table__ctt__tbody__td__token__index">
                            {index + 1}
                          </p>
                          <TokenIcon size={28} src={token.icon} />
                        </div>
                        <h4 className="app_home_tokens__table__ctt__tbody__td__token__name">
                          {token.name}
                        </h4>
                        <p className="app_home_tokens__table__ctt__tbody__td__token__unit">
                          {token.symbol}
                        </p>
                      </div>
                    </td>

                    <td className="app_home_tokens__table__ctt__tbody__td">
                      {formatLargeNumber(token.price)}
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      {formatSupply(token.fullyDilutedValuation)}
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      <span
                        className={
                          token.priceChange1h >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {token.priceChange1h >= 0 ? '+' : ''}
                        {token.priceChange1h?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      <span
                        className={
                          token.priceChange1d >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {token.priceChange1d >= 0 ? '+' : ''}
                        {token.priceChange1d?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      <span
                        className={
                          token.priceChange1w >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {token.priceChange1w >= 0 ? '+' : ''}
                        {token.priceChange1w?.toFixed(2)}%
                      </span>
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      {formatSupply(token.volume)}
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      {formatSupply(token.marketCap)}
                    </td>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      {formatSupply(token.availableSupply)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
