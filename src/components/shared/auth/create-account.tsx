'use client';
import React, { useState, useEffect, useRef } from 'react';
import { type InputState } from './input-validation-icon';
import { Button } from '@/components/ui';
import { useAppContext } from '@/state/context';
import { updateAuthModal } from '@/state/reducer';
import { Back, Close } from '../svgs/icons';
import { AuthIconButton } from './auth-icon-button';
import { AuthCtaContent } from './auth-cta-content';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  EASE_OUT,
  EXIT_SCALE,
  ENTER_DURATION,
  EXIT_DURATION,
  ENTER_DELAY,
  EXIT_DELAY,
  SLOT_ENTER_SPRING,
  AUTH_SUBMIT_DELAY_MS,
  SLOT_ENTER_SCALE,
  CROSSFADE_S,
  CROSSFADE_EASE,
} from '@/lib/utils/static';

// Same choreography as the modal's screen-to-screen transition: the outgoing
// element scales outward as it fades, and the incoming one starts fading in
// while that is still running, so the two cross over and the slot is never
// empty. Constants are shared, so the two stay in step if either is retuned.
const BUTTON_SLOT_TRAVEL = 80;

// The disclaimer leaves by growing to 103% and then sinking, mirroring the
// button that rises past it. The y leg is delayed by half the exit so the
// growth reads first rather than the two happening at once.
const DISCLAIMER_EXIT_SCALE = 1.03;

const SLOT_VARIANTS = {
  enter: { opacity: 0, scale: DISCLAIMER_EXIT_SCALE, y: BUTTON_SLOT_TRAVEL },
  open: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      // Springs with overshoot; opacity stays a plain tween, since a bouncing
      // fade reads as a flicker rather than as weight.
      scale: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      y: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      opacity: { duration: ENTER_DURATION, ease: EASE_OUT, delay: ENTER_DELAY },
    },
  },
  collapsed: {
    opacity: 0,
    scale: DISCLAIMER_EXIT_SCALE,
    y: BUTTON_SLOT_TRAVEL,
    transition: {
      scale: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
      // The sink used to be delayed by half the exit, by which point the fade
      // had already finished — so the downward motion was invisible. It now
      // starts a quarter in.
      y: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY + EXIT_DURATION / 4 },
      // Same duration and easing as the button's fade in, so the two cross at
      // a matched rate rather than the text snapping out first.
      opacity: {
        duration: SLOT_ENTER_SPRING.duration,
        ease: EASE_OUT,
        delay: EXIT_DELAY,
      },
    },
  },
};

// The button starts at 90% and rises from the bottom of the card to its resting
// position. The slot's transform-origin is its own centre (verified: 152px 27px
// on a 304x54 box), so the scale opens symmetrically from the middle — both
// edges move outward by the same amount rather than one side leading.
const BUTTON_ENTER_SCALE = 0.9;

const BUTTON_SLOT_VARIANTS = {
  enter: { opacity: 0, y: BUTTON_SLOT_TRAVEL, scale: BUTTON_ENTER_SCALE },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      y: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      scale: { ...SLOT_ENTER_SPRING, delay: ENTER_DELAY },
      // Fades continuously across the same window as the rise, so it is fully
      // opaque exactly as it lands rather than finishing early.
      opacity: {
        duration: SLOT_ENTER_SPRING.duration,
        ease: EASE_OUT,
        delay: ENTER_DELAY,
      },
    },
  },
  collapsed: {
    opacity: 0,
    y: BUTTON_SLOT_TRAVEL,
    scale: BUTTON_ENTER_SCALE,
    transition: { duration: EXIT_DURATION, ease: EASE_OUT, delay: EXIT_DELAY },
  },
};

const MESSAGE_ERROR_COLOR = '#F36C78';

// The tail leaves downward and the replacement arrives from above, so the two
// read as one continuous movement in one direction rather than a swap. Both
// pass through a blur, which is what keeps two legible strings from sitting on
// top of each other mid-hand-off.
const TAIL_TRAVEL = 7;
const TAIL_VARIANTS = {
  enter: { opacity: 0, y: -TAIL_TRAVEL, filter: 'blur(4px)' },
  open: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      y: { duration: CROSSFADE_S, ease: EASE_OUT, delay: EXIT_DELAY + CROSSFADE_S * 0.3 },
      opacity: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY + CROSSFADE_S * 0.3 },
      filter: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY + CROSSFADE_S * 0.3 },
    },
  },
  collapsed: {
    opacity: 0,
    y: TAIL_TRAVEL,
    filter: 'blur(4px)',
    transition: {
      y: { duration: CROSSFADE_S, ease: EASE_OUT, delay: EXIT_DELAY },
      opacity: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
      filter: { duration: CROSSFADE_S, ease: CROSSFADE_EASE, delay: EXIT_DELAY },
    },
  },
};

/**
 * The messages, split at the words they share rather than diffed at runtime.
 *
 * Diffing looked right and was wrong: on the frame the message changes, the
 * element leaving still holds the whole previous sentence — it was rendered
 * before any prefix was known — so the shared words appear twice, once in the
 * static prefix and once inside the fading copy. Declaring the split means both
 * renders already agree on where the sentence divides, and the prefix is
 * simply an element whose key never changed.
 */
const MESSAGES = {
  idle: { prefix: 'This username', tail: 'is public and can be seen by others.' },
  taken: { prefix: 'This username', tail: 'has been taken' },
  empty: { prefix: '', tail: 'Please enter a username' },
} as const;

/**
 * The message under the field. Whatever the outgoing and incoming lines share
 * at the front stays put and only recolours; the rest is what animates.
 *
 * "This username" opens both the helper and the taken error, so on that change
 * only "is public and can be seen by others." leaves and only "has been taken"
 * arrives — the sentence corrects itself rather than being replaced. The prefix
 * is animated too, on its own key, so the empty-field error (which shares
 * nothing) still moves as a whole. It just never fires when the key holds.
 */
function InputMessage({ kind }: { kind: keyof typeof MESSAGES }) {
  const { prefix, tail } = MESSAGES[kind];
  const error = kind !== 'idle';

  return (
    <p
      className="app_create_account__input__info"
      style={{
        color: error ? MESSAGE_ERROR_COLOR : undefined,
        transition: `color ${CROSSFADE_S}s ${CROSSFADE_EASE}`,
      }}
    >
      <span className="inline-flex overflow-hidden align-bottom">
        <AnimatePresence initial={false} mode="popLayout">
          {prefix ? (
            <motion.span
              key={prefix}
              className="whitespace-pre"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={TAIL_VARIANTS}
            >
              {prefix}{' '}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
      <span className="inline-flex overflow-hidden align-bottom">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={tail}
            className="whitespace-pre"
            initial="enter"
            animate="open"
            exit="collapsed"
            variants={TAIL_VARIANTS}
          >
            {tail}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}

// How long the field waits after the last keystroke before it judges the name.
// It was a full second, which is long enough that the verdict felt like it had
// nothing to do with what was just typed. 380ms still clears a fast typist's
// gaps — the check does not fire per character — while landing close enough to
// the last key that the two read as connected.
const VALIDATE_DEBOUNCE_MS = 380;

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
    }, VALIDATE_DEBOUNCE_MS);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value]);

  return state;
}

export function CreateAccount() {
  const { state: appState, dispatch } = useAppContext();
  const [username, setUsername] = useState(appState.authModal.username || '');
  const [submitError, setSubmitError] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputState = useInputValidation(username);
  // The Continue button only takes the disclaimer's place once the username is
  // long enough to be plausible — swapping on the first keystroke made the
  // legal copy flicker away before anyone could read it.
  const MIN_USERNAME_LENGTH = 5;
  const hasInput = username.trim().length >= MIN_USERNAME_LENGTH;
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
    }, AUTH_SUBMIT_DELAY_MS);
  };

  return (
    <div className="app_login h-full flex flex-col gap-6 app_create_account py-8! px-7!">
      <div className="app_login__top flex flex-col gap-7">
        <div className="relative flex items-center justify-center py-2!">
          <AuthIconButton
          side="left"
          onClick={() => {
            dispatch(updateAuthModal({ show: true, variant: 'login' }));
          }}
        >
          <Back />
        </AuthIconButton>
          <h3 className="app_login__top__title__text">Username</h3>
          <AuthIconButton
          side="right"
          onClick={() => {
            dispatch(updateAuthModal({ show: false }));
          }}
        >
          <Close />
        </AuthIconButton>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {/* <p className="app_create_account__input__label">Create Username</p> */}
            <div
              className={`app_login__top__email flex items-center gap-1${
                showError ? ' app_login__top__email--error' : ''
              }`}
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
            </div>
          </div>
          <InputMessage kind={showError ?? 'idle'} />
        </div>
      </div>

      {/* One slot: the disclaimer holds the space until the field has content,
          then the Continue button takes its place. Fixed height so the swap
          happens in place rather than shifting the layout around it. */}
      <div className="app_create_account__bottom">
        <AnimatePresence initial={false}>
          {hasInput ? (
            <motion.div
              key="cta"
              data-slot="cta"
              className="app_create_account__bottom__slot"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={BUTTON_SLOT_VARIANTS}
            >
              <Button
                // Two separate hover effects had to go: the global
                // `button:hover { opacity: .8 }` in _reset.scss (important is
                // needed, since an unlayered rule outranks plain utilities), and
                // the Button variant's own hover:bg-primary/80 fade.
                // disabled:opacity-100 keeps it black while the spinner runs: a
                // loader is progress, not a disabled affordance. `disabled` is
                // kept so it still blocks clicks and reads as busy to AT.
                className="w-full h-12 app_create_account__continue hover:opacity-100! hover:bg-primary! disabled:opacity-100!"
                onClick={handleSubmit}
                disabled={loading}
              >
                <AuthCtaContent loading={loading}>Continue</AuthCtaContent>
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="terms"
              data-slot="terms"
              className="app_create_account__bottom__slot"
              initial="enter"
              animate="open"
              exit="collapsed"
              variants={SLOT_VARIANTS}
            >
              <p className="app_create_account__bottom__terms__text">
                By clicking Continue you agree to our{' '}
                <Link className="underline" href="#">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link className="underline" href="#">
                  Privacy Policy
                </Link>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
