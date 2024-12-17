'use client';
import React from 'react';
import { InputCheck } from '../svgs/icons';
import { Button } from '@/components/ui';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';

export function CreateAccount() {
  const { dispatch } = useAppContext();

  return (
    <div className="app_login h-full flex flex-col justify-between app_create_account">
      <div className="app_login__top flex flex-col gap-7">
        <div className="app_login__top__title flex flex-col gap-1">
          <h3 className="app_login__top__title__text">Create account</h3>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-col gap-2">
            <p className="app_create_account__input__label">Create Username</p>
            <div className="app_login__top__email flex items-center gap-1">
              <input type="text" className="app_login__top__email__input flex-1" />

              <InputCheck />
            </div>
          </div>
          <p className="app_create_account__input__info">
            Your username is public and can be changed at any time.
          </p>
        </div>
      </div>

      <div className="app_create_account__bottom flex flex-col gap-7">
        <div className="flex gap-2 app_create_account__bottom__terms">
          <div className="app_create_account__bottom__terms__box"></div>
          <p className="app_create_account__bottom__terms__text">
            By trading you agree to the terms of use and attest you are not a US person, are not
            located in the USA, and are not the resident or located in a restricted location.
          </p>
        </div>

        <div className="">
          <Button
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: true,
                  variant: 'selectAvatar',
                })
              );
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
