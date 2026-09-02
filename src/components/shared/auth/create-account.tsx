'use client';
import React, { useState, useEffect, useRef } from 'react';
import { InputValidationIcon, type InputState } from './input-validation-icon';
import { Button } from '@/components/ui';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';
import { ChevronLeftIcon, XIcon, LoaderIcon, Loader2Icon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const TAKEN_USERNAMES = ['kurosawa', 'satoshi', 'vitalik', 'nakamoto', 'cheq'];

function useInputValidation(value: string): InputState {
  const [state, setState] = useState<InputState>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!value.trim()) {
      setState('idle');
      return;
    }
    setState('busy');
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const taken = TAKEN_USERNAMES.includes(value.trim().toLowerCase());
      setState(taken ? 'error' : 'done');
    }, 1000);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value]);

  return state;
}

export function CreateAccount() {
  const { state: appState, dispatch } = useAppContext();
  const [username, setUsername] = useState(appState.authModal.username || '');
  const [agreed, setAgreed] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputState = useInputValidation(username);
  const showError =
    submitError && !username.trim() ? 'empty' : inputState === 'error' ? 'taken' : null;

  const handleSubmit = () => {
    if (!username.trim() || inputState === 'error') {
      setSubmitError(true);
      return;
    }
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      dispatch(
        updateAuthModal({
          show: true,
          variant: 'selectAvatar',
          username,
        })
      );
      setLoading(false);
    }, 800);
  };

  return (
    <div className="app_login h-full flex flex-col gap-6 app_create_account py-8! px-7!">
      <div className="app_login__top flex flex-col gap-7">
        <div className="relative flex items-center justify-center py-2!">
          <button
            type="button"
            className="absolute left-0"
            onClick={() => {
              dispatch(updateAuthModal({ show: true, variant: 'login' }));
            }}
          >
            <ChevronLeftIcon size={18} color="#9B9FA4" />
          </button>
          <h3 className="app_login__top__title__text">Username</h3>
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

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {/* <p className="app_create_account__input__label">Create Username</p> */}
            <div
              className="app_login__top__email flex items-center gap-1"
              style={showError ? { borderColor: '#F36C78' } : undefined}
            >
              <input
                type="text"
                placeholder="@username"
                className="app_login__top__email__input flex-1"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setSubmitError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />

              <InputValidationIcon state={showError === 'empty' ? 'error' : inputState} />
            </div>
          </div>
          {showError ? (
            <p className="app_create_account__input__info" style={{ color: '#F36C78' }}>
              {showError === 'empty' ? 'Please enter a username' : 'This username has been taken'}
            </p>
          ) : (
            <p className="app_create_account__input__info">
              Your username is public and can be seen by others.
            </p>
          )}
        </div>
      </div>

      <div className="app_create_account__bottom flex flex-col gap-12">
        <div className="flex gap-2 app_create_account__bottom__terms">
          <Checkbox
            checked={agreed}
            onCheckedChange={(val) => {
              setAgreed(val);
            }}
            className="size-5 shrink-0 rounded-[5px] border-[#dcdcdc] cursor-pointer data-checked:border-[#0B0B0B] data-checked:bg-[#0B0B0B] data-checked:text-[#F9F9F9]"
          />
          <p className="app_create_account__bottom__terms__text">
            By trading you agree to the terms of use and attest you are not a US person, are not
            located in the USA, and are not the resident or located in a restricted location.
          </p>
        </div>

        <div className="">
          <Button className="w-full h-12 rounded-full" onClick={handleSubmit} disabled={loading}>
            Continue
            {loading && <Loader2Icon size={16} className="animate-spin" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
