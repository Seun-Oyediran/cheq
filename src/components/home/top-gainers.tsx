import React, { Fragment } from 'react';
import { Add, ArrowPrice, CaretDown, Trending } from '../shared/svgs/icons';
import { TokenIcon } from '../ui';
import home from '@/lib/assets/home';
import { RenderIf } from '../shared';

interface ITopGainerItem {
  isLast?: boolean;
  index: number;
  name?: string;
  unit?: string;
}

const data = [
  { id: 1, name: 'KEYCAT', unit: 'DGN' },
  { id: 2, name: 'RKT', unit: 'DGN' },
  { id: 3, name: 'AIXBT', unit: 'DGN' },
  { id: 4, name: 'MICRO', unit: 'DGN' },
];

function TopGainerItem(props: ITopGainerItem) {
  const { isLast, index, name, unit } = props;

  return (
    <Fragment>
      <div className="app_top_gainers__item flex justify-between">
        <div className="app_top_gainers__item__left flex items-center gap-4">
          <p className="app_top_gainers__item__index">{index + 1}</p>
          <TokenIcon src={index % 2 === 0 ? home.degen : home.base} />
          <div className="">
            <h4 className="app_top_gainers__item__left__name">{name}</h4>
            <h5 className="app_top_gainers__item__left__unit">{unit}</h5>
          </div>
        </div>

        <div className="app_top_gainers__item__right flex items-center gap-4">
          <div className="">
            <h4 className="app_top_gainers__item__right__price">$0.0218</h4>

            <div className="flex items-center gap-1">
              <ArrowPrice positive />
              <h5 className="app_top_gainers__item__right__change">74.3K%</h5>
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
        {data.map((item, index) => (
          <TopGainerItem
            key={item.id}
            name={item.name}
            unit={item.unit}
            index={index}
            isLast={index === 3}
          />
        ))}
      </div>
    </div>
  );
}
