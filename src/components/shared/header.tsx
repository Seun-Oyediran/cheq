'use client';
import React from 'react';
import Link from 'next/link';
import { Popover } from 'react-tiny-popover';
import { Logo, LogoText, Search } from './svgs/icons';
import routes from '@/lib/routes';
import { AuthWrapper, CreateAccount, Login, SelectAvatar, Welcome } from './auth';
import { RenderIf } from './render-if';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';

export function Header() {
  const { state, dispatch } = useAppContext();

  const showPopover = () => {
    dispatch(
      updateAuthModal({
        show: true,
        variant: 'login',
      })
    );
  };

  return (
    <div className="app_header">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10 flex-1">
          <Link href={routes.home.path}>
            <div className="flex items-center gap-2">
              <Logo />
              <LogoText />
            </div>
          </Link>

          <div className="app_header__links flex items-center">
            <Link href={routes.home.path}>
              <button className="app_header__links__item" type="button">
                Explore
              </button>
            </Link>

            <Link href={routes.home.path}>
              <button className="app_header__links__item" type="button">
                Dexscan
              </button>
            </Link>

            <Link href={routes.home.path}>
              <button className="app_header__links__item" type="button">
                Ranks
              </button>
            </Link>
          </div>
        </div>

        <div className="app_header__middle flex-1">
          <div className="app_header__middle__search flex items-center gap-2">
            <Search />
            <input
              type="text"
              className="app_header__middle__search__input"
              placeholder="Search Markets"
            />
            <div className="app_header__middle__search__icon">
              <p className="app_header__middle__search__icon__text">/</p>
            </div>
          </div>
        </div>

        <div className="app_header__auth flex items-center justify-end flex-1">
          <button className="app_header__auth__btn" type="button" onClick={showPopover}>
            Log In
          </button>
          <Popover
            isOpen={state.authModal.show}
            positions={['bottom']}
            align="end"
            padding={24}
            onClickOutside={() => {
              dispatch(
                updateAuthModal({
                  show: false,
                })
              );
            }}
            content={
              <AuthWrapper>
                <RenderIf condition={state.authModal.variant === 'welcome'}>
                  <Welcome />
                </RenderIf>

                <RenderIf condition={state.authModal.variant === 'selectAvatar'}>
                  <SelectAvatar />
                </RenderIf>

                <RenderIf condition={state.authModal.variant === 'login'}>
                  <Login />
                </RenderIf>

                <RenderIf condition={state.authModal.variant === 'createAccount'}>
                  <CreateAccount />
                </RenderIf>
              </AuthWrapper>
            }
          >
            <button
              className="app_header__auth__btn app_header__auth__btn__signup"
              type="button"
              onClick={showPopover}
            >
              Sign Up
            </button>
          </Popover>
        </div>
      </div>
    </div>
  );
}
