'use client';
import React, { useEffect } from 'react';
import { RenderIf } from '@/components/shared';
import { AuthWrapper, CreateAccount, Login, SelectAvatar } from '@/components/shared/auth';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';

/**
 * The auth modal alone, on a flat surface, for screen capture.
 *
 * Not the real modal: no Dialog, no backdrop, no page chrome — those are what
 * /record exists to leave out. It renders the same screen components the app
 * does, so what is recorded is the real thing rather than a mock-up of it, and
 * the flow is driven by clicking through exactly as a user would.
 *
 * Press R to jump back to the first screen without leaving the page, so a take
 * can be restarted without a reload flashing in the recording.
 */
export default function RecordPage() {
  const { state, dispatch } = useAppContext();
  const { variant } = state.authModal;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'r' && e.key !== 'R') return;
      if (document.activeElement instanceof HTMLInputElement) return;
      dispatch(updateAuthModal({ show: false }));
      dispatch(updateAuthModal({ show: true, variant: 'login' }));
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [dispatch]);

  return (
    <div
      className="fixed inset-0 grid place-items-center overflow-hidden"
      style={{ background: '#f9f9f9' }}
    >
      {/* The card is width:100% and takes its size from the dialog that
          normally holds it, so it needs the same 360px constraint here or it
          spreads to the viewport. Matches .app_auth_popover. */}
      <div style={{ width: '100%', maxWidth: 360 }}>
        <AuthWrapper>
          <RenderIf condition={variant === 'selectAvatar' || variant === 'welcome'}>
            <SelectAvatar />
          </RenderIf>

          <RenderIf condition={variant === 'login'}>
            <Login />
          </RenderIf>

          <RenderIf condition={variant === 'createAccount'}>
            <CreateAccount />
          </RenderIf>
        </AuthWrapper>
      </div>
    </div>
  );
}
