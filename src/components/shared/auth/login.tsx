'use client';
import React from 'react';
import Image from 'next/image';
import auth from '@/lib/assets/auth';
import { type StaticImport } from 'next/dist/shared/lib/get-img-props';
import { RenderIf } from '../render-if';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';
import { XIcon } from 'lucide-react';
import Link from 'next/link';

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
        <div className="flex items-center justify-between w-full">
          <h4 className="app_login__wallet__name">{name}</h4>
          <div>
            <Image src={icon} alt="wallets" className="app_login__wallet__icon" />
          </div>
        </div>

        {/* <RenderIf condition={recent}>
          <div className="app_login__wallet__recent">
            <p className="app_login__wallet__recent__text">Recent</p>
          </div>
        </RenderIf>

        <RenderIf condition={insatlled}>
          <p className="app_login__wallet__installed">Installed</p>
        </RenderIf> */}
      </div>
    </button>
  );
}

export function Login() {
  const { dispatch } = useAppContext();

  return (
    <div className="app_login h-full flex flex-col">
      <div className="px-7! pt-6! flex flex-col min-h-0">
        <div className="app_login__top flex flex-col shrink-0">
          <div className="relative flex items-center justify-center pb-7!">
            <h3 className="app_login__top__title__text">Log In</h3>
            <button
              type="button"
              className="absolute right-0"
              onClick={() => {
                dispatch(updateAuthModal({ show: false }));
              }}
            >
              <XIcon size={18} color="#9B9FA4" />
            </button>
          </div>

          <div className="app_login__top__email flex items-center gap-1">
            <input
              type="email"
              placeholder="email@gmail.com"
              className="app_login__top__email__input flex-1"
            />

            <button type="button" className="app_login__top__email__btn">
              Continue
            </button>
          </div>

          <div className="app_login__top__divider py-4!">
            {/* <div className="app_login__top__divider__line"></div> */}
            <p className="app_login__top__divider__text leading-5!">Select a wallet below</p>
          </div>
        </div>

        <div className="app_login__bottom flex flex-col gap-3 overflow-y-auto pb-4!">
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
          <Wallet
            name="Phantom EVM"
            icon={auth.phantom}
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
          <Wallet
            name="WalletConnect"
            icon={auth.walletconnect}
            insatlled
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'createAccount',
                })
              );
            }}
          />
          <Wallet
            name="Rainbow"
            icon={auth.rainbow}
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'createAccount',
                })
              );
            }}
          />
          <Wallet
            name="Coinbase"
            icon={auth.coinbase}
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'createAccount',
                })
              );
            }}
          />
          <Wallet
            name="Rabby"
            icon={auth.rabby}
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'createAccount',
                })
              );
            }}
          />
        </div>
      </div>
      <div className="shrink-0 bg-[#F3F3F3] w-full py-4! px-14! rounded-b-2xl">
        <p className="text-center text-[#585858]! font-[13px]">
          By connecting your wallet you agree to the{' '}
          <Link className="underline" href="#">
            Terms of Privacy
          </Link>{' '}
          and{' '}
          <Link className="underline" href="#">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
