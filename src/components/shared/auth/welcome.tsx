import { Button } from '@/components/ui';
import React from 'react';
import { Avi } from '../avi';
import { updateAuthModal } from '@/state/reducer';
import { useAppContext } from '@/state/context';

export function Welcome() {
  const { dispatch } = useAppContext();

  return (
    <div className="app_login h-full flex flex-col justify-center app_create_account app_auth_welcome gap-7">
      <div className="app_login__top flex flex-col gap-7">
        <div className="app_login__top__title flex flex-col gap-1">
          <h3 className="app_login__top__title__text">Hey Basegod69</h3>
        </div>
      </div>

      <div className="app_auth_welcome__logo flex justify-center">
        <Avi size={80} padding={30} />
      </div>

      <div className="flex flex-col gap-4 app_auth_welcome__welcome">
        <h5 className="app_auth_welcome__welcome__message">Welcome to Cheq</h5>
        <p className="app_auth_welcome__welcome__details">The Largest Base prediction Market</p>
      </div>

      <div className="mt-3">
        <div className="">
          <Button
            onClick={() => {
              dispatch(
                updateAuthModal({
                  show: false,
                })
              );
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
}
