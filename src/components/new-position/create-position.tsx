import React, { useRef, useState } from 'react';
import { Avi, RenderIf } from '../shared';
import { Settings } from '../shared/svgs/icons';
import { Button, TokenIcon } from '../ui';
import { CreatePositionField } from './create-position-field';
import {
  ConditionOptions,
  MarketConditions,
  Metric,
  PositionType,
  Timeframe,
  Token,
} from './popover';
import home from '@/lib/assets/home';

function TokenValue() {
  return (
    <div className="app_token_value flex items-center gap-2">
      <TokenIcon src={home.degen} size={24} />
      <p>DEGEN/WETH</p>
    </div>
  );
}

function AmountInput() {
  const [value, setValue] = useState('');

  const hasValue = value !== '';

  return (
    <div className="flex-1 app_create_position__stake__field">
      <RenderIf condition={hasValue}>
        <p className="app_create_position__stake__field__prefix">$</p>
      </RenderIf>
      <input
        type="number"
        placeholder="Minimum 5$"
        className={`w-full app_create_position__stake__field__input ${
          hasValue ? 'has__value' : ''
        }`}
        value={value}
        onChange={(e) => {
          setValue(e?.target?.value);
        }}
      />
    </div>
  );
}

export function CreatePosition() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={containerRef}
      className="app_create_position flex flex-col justify-between gap-3 scrollbar"
    >
      <div className="app_create_position__top flex-1">
        <div className="app_create_position__header flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Avi size={40} />

            <button type="button">
              <Settings />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <p className="app_create_position__header__name">Basegod69</p>

            <p className="app_create_position__header__balance">$982.21</p>
          </div>
        </div>

        <div className="app_create_position__body flex flex-col gap-4">
          <CreatePositionField
            label="Token or Memecoin"
            value={<TokenValue />}
            popover={<Token />}
          />

          <CreatePositionField
            label="Metric"
            popover={<Metric />}
            value="FDV"
            info="FDV’s are affected by token price"
          />

          <CreatePositionField label="Position type" popover={<PositionType />} value="Public" />

          <div className="app_create_position__condition">
            <h4 className="app_create_position_field__label">Condition definition</h4>
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <div className="app_create_position__condition__big">
                  <CreatePositionField
                    label=""
                    popover={<MarketConditions />}
                    value="FDV"
                    popoverClassName="market_conditions_popover"
                  />
                </div>

                <div className="app_create_position__condition__small">
                  <CreatePositionField
                    label=""
                    popover={<ConditionOptions />}
                    value="$100M"
                    popoverClassName="conditions_options_popover"
                  />
                </div>
              </div>

              <p className="app_create_position_field__info">
                Condition definitions can’t be altered once bet is placed
              </p>
            </div>
          </div>

          <CreatePositionField
            label="Timeframe"
            onBeforePopover={() => {
              if (!containerRef?.current) return;
              containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }}
            popover={<Timeframe />}
            value="Public"
          />

          <div className="flex flex-col gap-2 app_create_position__stake">
            <h4 className="app_create_position_field__label">Stake amount</h4>
            <div className="flex items-center gap-3">
              <AmountInput />

              <div className="flex items-center gap-2">
                <button>
                  <div className="app_create_position__stake__btn">
                    <p className="app_create_position__stake__btn__text">25%</p>
                  </div>
                </button>

                <button>
                  <div className="app_create_position__stake__btn">
                    <p className="app_create_position__stake__btn__text">50%</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="app_create_position__footer flex flex-col gap-4">
        <div className="app_create_position__footer__ctt flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <p className="app_create_position__footer__ctt__text">Total Stake</p>
            <p className="app_create_position__footer__ctt__text">$250</p>
          </div>

          <div className="app_create_position__footer__ctt__divider"></div>

          <div className="flex justify-between items-center">
            <p className="app_create_position__footer__ctt__text">Total Stake</p>
            <p className="app_create_position__footer__ctt__text">$250</p>
          </div>
        </div>
        <Button className="app_create_position__footer__btn">Open New position</Button>
      </div>
    </div>
  );
}
