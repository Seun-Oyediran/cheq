'use client';
import React from 'react';
import Image from 'next/image';
import auth from '@/lib/assets/auth';
import { type StaticImport } from 'next/dist/shared/lib/get-img-props';
import { RenderIf } from '../render-if';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';

interface IWallet {
  insatlled?: boolean;
  recent?: boolean;
  name: string;
  icon: string | StaticImport;
  onClick?: () => void;
}

function Wallet(props: IWallet) {
  const { name, icon, insatlled = false, recent = false, onClick } = props;

  return (
    <button type="button" className="w-full" onClick={onClick}>
      <div className="flex justify-between app_login__wallet items-center">
        <div className="flex items-center gap-2">
          <Image src={icon} alt="wallets" className="app_login__wallet__icon" />
          <h4 className="app_login__wallet__name">{name}</h4>
        </div>

        <RenderIf condition={recent}>
          <div className="app_login__wallet__recent">
            <p className="app_login__wallet__recent__text">Recent</p>
          </div>
        </RenderIf>

        <RenderIf condition={insatlled}>
          <p className="app_login__wallet__installed">Installed</p>
        </RenderIf>
      </div>
    </button>
  );
}

export function Login() {
  const { dispatch } = useAppContext();

  return (
    <div className="app_login h-full flex flex-col justify-between gap-5">
      <div className="app_login__top flex flex-col gap-7">
        <div className="app_login__top__title flex flex-col gap-1">
          <h3 className="app_login__top__title__text">Log In</h3>
          <p className="app_login__top__title__info">How would you like to Log in</p>
        </div>

        <div className="app_login__top__email flex items-center gap-1">
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="app_login__top__email__input flex-1"
          />

          <button type="button" className="app_login__top__email__btn">
            Continue
          </button>
        </div>

        <div className="app_login__top__divider">
          <div className="app_login__top__divider__line"></div>
          <p className="app_login__top__divider__text">or</p>
        </div>
      </div>

      <div className="app_login__bottom flex flex-col gap-3">
        <Wallet
          name="Metamask"
          icon={auth.metamask}
          recent
          onClick={() => {
            dispatch(
              updateAuthModal({
                show: true,
                variant: 'createAccount',
              })
            );
          }}
        />
        <Wallet name="Phantom EVM" icon={auth.phantom} recent />
        <Wallet name="WalletConnect" icon={auth.walletconnect} insatlled />
        <Wallet name="Coinbase Wallet" icon={auth.coinbase} />
        <Wallet name="Coinbase" icon={auth.coinbase} />
      </div>
    </div>
  );
}
