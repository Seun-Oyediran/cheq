import React from 'react';
import { MintMark, Paid } from '@/components/shared/svgs/icons';
import { RenderIf } from '@/components/shared';

interface IMarketConditionItem {
  color?: 'green' | 'blue';
  name?: string;
  details?: string;
}

function MarketConditionItem(props: IMarketConditionItem) {
  const { color = 'green', details, name } = props;

  return (
    <button>
      <div className="app_market_conditions_item flex gap-2">
        <div className={`app_market_conditions_item__icon ${color}`}>
          <RenderIf condition={color === 'green'}>
            <MintMark width={20} height={21} fill="white" />
          </RenderIf>

          <RenderIf condition={color === 'blue'}>
            <Paid width={20} height={21} fill="white" />
          </RenderIf>
        </div>

        <div>
          <p className="app_market_conditions_item__name">{name}</p>
          <p className="app_market_conditions_item__details">{details}</p>
        </div>
      </div>
    </button>
  );
}

export function MarketConditions() {
  return (
    <div className="app_position_type_popover app_create_position_popover flex flex-col gap-4">
      <p className="app_create_position_popover__title">Market Conditions</p>

      <div className="app_token_popover__body market_conditions scrollbar flex flex-col gap-4">
        <MarketConditionItem name="FDV" details="Fully Dilluted Value" />

        <MarketConditionItem
          name="Marketcap"
          details="The marketcap of a memecoin or token"
          color="blue"
        />

        <MarketConditionItem
          name="Price Changes"
          details="Predict token price changes"
          color="blue"
        />
      </div>
    </div>
  );
}
