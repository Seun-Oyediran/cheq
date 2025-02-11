'use client';
import React, { useState } from 'react';
import { CaretDown, FilterList, ShowChart, Trophy } from '../shared/svgs/icons';
import { TokenIcon } from '../ui';
import home from '@/lib/assets/home';

const options = [
  { id: 1, label: 'FDV' },
  { id: 2, label: 'Volume' },
  { id: 3, label: 'Marketcap' },
  { id: 4, label: 'Open bets' },
];

export function Tokens() {
  const [selectedOption, setSelectedOption] = useState(options[0].label);

  return (
    <div className="app_home_tokens flex flex-col gap-6">
      <div className="app_home_tokens__options flex items-center gap-2">
        {options.map((item) => (
          <button
            key={item.id}
            className={`app_home_tokens__options__btn ${selectedOption === item.label && 'active'}`}
            type="button"
            onClick={() => {
              setSelectedOption(item.label);
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
              <div className="flex items-center app_home_tokens__filter__left__time__first">
                <p className="app_home_tokens__filter__left__time__text">Last 24 hours</p>
                <CaretDown fill="#9B9FA4" />
              </div>
              <div className="app_home_tokens__filter__left__time__con">
                <p className="app_home_tokens__filter__left__time__text">5M</p>
              </div>
              <div className="app_home_tokens__filter__left__time__con">
                <p className="app_home_tokens__filter__left__time__text">1H</p>
              </div>
              <div className="app_home_tokens__filter__left__time__con">
                <p className="app_home_tokens__filter__left__time__text">6H</p>
              </div>
              <div className="app_home_tokens__filter__left__time__con">
                <p className="app_home_tokens__filter__left__time__text">1D</p>
              </div>
              <div className="app_home_tokens__filter__left__time__con">
                <p className="app_home_tokens__filter__left__time__text">1W</p>
              </div>
            </div>

            <div className="app_home_tokens__filter__left__top flex items-center gap-1">
              <ShowChart />
              <p className="app_home_tokens__filter__left__top__text">Top</p>
            </div>
          </div>

          <div className="app_home_tokens__filter__right">
            <div className="app_home_tokens__filter__right__rank flex items-center gap-1">
              <Trophy width={16} height={16} fill="#9B9FA4" />
              <p className="app_home_tokens__filter__right__rank__text">Rank By: Trending</p>
              <CaretDown fill="#9B9FA4" />
            </div>

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
                <th className="app_home_tokens__table__ctt__thead__th">5M</th>
                <th className="app_home_tokens__table__ctt__thead__th">1HR</th>
                <th className="app_home_tokens__table__ctt__thead__th">24H TXNS</th>
                <th className="app_home_tokens__table__ctt__thead__th">24H VOLUME</th>
                <th className="app_home_tokens__table__ctt__thead__th">LIQUIDITY</th>
                <th className="app_home_tokens__table__ctt__thead__th">HOLDERS</th>
              </tr>
            </thead>
            <tbody className="app_home_tokens__table__ctt__tbody">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="app_home_tokens__table__ctt__tbody__td">
                      <div className="app_home_tokens__table__ctt__tbody__td__token">
                        <div className="flex items-center gap-1">
                          <p className="app_home_tokens__table__ctt__tbody__td__token__index">
                            {index + 1}
                          </p>
                          <TokenIcon size={28} src={home.degen} />
                        </div>
                        <h4 className="app_home_tokens__table__ctt__tbody__td__token__name">
                          DEGEN/WETH
                        </h4>
                        <p className="app_home_tokens__table__ctt__tbody__td__token__unit">DEGEN</p>
                      </div>
                    </td>

                    <td className="app_home_tokens__table__ctt__tbody__td">$0.003</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$0.003</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$0.003</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$0.003</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$0.003</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$56.9M</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">$10.3M</td>
                    <td className="app_home_tokens__table__ctt__tbody__td">509</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
