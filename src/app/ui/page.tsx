'use client';
import { RenderIf } from '@/components/shared';
import { AuthWrapper, CreateAccount, Login, SelectAvatar, Welcome } from '@/components/shared/auth';
import { useAppContext } from '@/state/context';
import React from 'react';

export default function Page() {
  const { state } = useAppContext();

  return (
    <div className="bg-[#c4c4c4] p-6">
      <p>Hello from ui</p>
      <div className="flex justify-center gap-6">
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
      </div>
    </div>
  );
}
