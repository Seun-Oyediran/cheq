import React, { Fragment } from 'react';
import { TokenIcon } from '../ui';
import home from '@/lib/assets/home';
import { ArrowPrice, CaretDown, Globe, Star, Twitter } from '../shared/svgs/icons';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TimeOptions } from '../shared/home';
import Link from 'next/link';

const amplitude = 20;
const frequency = 2;
const phaseShift = 0;
const verticalShift = amplitude;
const numPoints = 50;
const range = 2 * Math.PI;

const _data: Array<{ x: number; y: number }> = [];
for (let i = 0; i <= numPoints; i++) {
  const x = (i / numPoints) * range;
  const y = amplitude * Math.sin(frequency * x + phaseShift) + verticalShift;
  _data.push({ x, y });
}

interface IStatsItem {
  label: string;
  value: string;
}

function StatsItem(props: IStatsItem) {
  const { label, value } = props;

  return (
    <div className="flex flex-col gap-1 app_token_info__right__stats__item">
      <p className="app_token_info__right__stats__item__label">{label}</p>
      <p className="app_token_info__right__stats__item__value">{value}</p>
    </div>
  );
}

export function TokenInfo() {
  return (
    <div className="app_token_info">
      <div className="app_token_info__left flex flex-col justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="app_token_info__left__name flex items-center gap-2">
              <TokenIcon src={home.base} size={28} />
              <h4 className="app_token_info__left__name__text">
                Base <span>ETH</span>
              </h4>
            </div>

            <button type="button">
              <Star fill="#9B9FA4" />
            </button>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="app_token_info__left__price">$3,600</h3>

            <div className="flex items-center gap-1">
              <ArrowPrice positive />
              <h4 className="app_token_info__left__change">74.3K%</h4>
            </div>
          </div>
        </div>

        <div className="app_token_info__left__chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={300}
              height={100}
              data={_data}
              margin={{ top: 50, right: 0, left: 0, bottom: 50 }}
            >
              <Line
                type="monotone"
                dataKey="y"
                stroke="#e3e3e3"
                strokeWidth={2}
                dot={() => {
                  return <Fragment></Fragment>;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center">
          <TimeOptions />
        </div>
      </div>

      <div className="app_token_info__right flex flex-col gap-5 justify-between">
        <div className="flex flex-col gap-4">
          <h4 className="app_token_info__right__title">Stats</h4>

          <div className="flex items-center gap-2 justify-between">
            <StatsItem label="Market Cap" value="$43.89B" />
            <StatsItem label="TVL" value="$4.89B" />
            <StatsItem label="FDV" value="$43.89B" />
            <StatsItem label="1 day volume" value="$43.89B" />
          </div>
        </div>

        <div className="app_token_info__right__divider"></div>

        <div className="app_token_info__right__info flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="app_token_info__right__info__title">Info</h4>

            <div className="flex items-center gap-3">
              <Link href="#">
                <div className="app_token_info__right__info__social">
                  <Twitter width={16} height={16} fill="#9B9FA4" />
                </div>
              </Link>

              <Link href="#">
                <div className="app_token_info__right__info__social">
                  <Globe />
                </div>
              </Link>
            </div>
          </div>

          <p className="app_token_info__right__info__details">
            Base is a smart contract platform that enables developers to build tokens and
            decentralized applications (dapps). Base is the native currency for the Base platform
            and also works as the transaction fees to miners on the Base network.
          </p>

          <div className="flex items-center">
            <h4 className="app_token_info__right__info__docs">Read Docs</h4>

            <CaretDown transform="rotate(-90)" fill="#9B9FA4" />
          </div>
        </div>
      </div>
    </div>
  );
}
