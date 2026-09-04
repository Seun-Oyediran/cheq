export const footerData = [
  {
    id: 1,
    title: 'Resources',
    items: [
      { id: 1, label: 'FAQ', path: '#' },
      { id: 2, label: 'Privacy', path: '#' },
      { id: 3, label: 'Newsletter', path: '#' },
    ],
  },

  {
    id: 2,
    title: 'Developers',
    items: [
      { id: 1, label: 'Documentation', path: '#' },
      { id: 2, label: 'Support', path: '#' },
    ],
  },

  {
    id: 3,
    title: 'Need Help?',
    items: [
      { id: 1, label: 'Contact Us', path: '#' },
      { id: 2, label: 'Help center', path: '#' },
    ],
  },
];

export const aviVariants = {
  aquafresh: {
    fill: '#5CFE9D',
    bg: '#C5FFDC',
  },
  tangerine: {
    fill: '#E4813F',
    bg: '#FFDB99',
  },
  mantis: {
    fill: '#4AB271',
    bg: '#C5FFDC',
  },
  white: {
    fill: '#ffffff',
    bg: '#A0A0A0',
  },

  sapphire: {
    fill: '#425EB9',
    bg: '#B0CCFF',
  },

  lightgray: {
    fill: '#efefef',
    bg: '#d7d7d7',
  },

  platinum: {
    fill: '#e4e4e4',
    bg: '#f5f5f5',
  },

  black: {
    fill: '#878787',
    bg: '#000',
  },
};

export type IAviVariants = keyof typeof aviVariants;

export const aviVariantsArray: IAviVariants[] = [
  'aquafresh',
  'black',
  'lightgray',
  'mantis',
  'platinum',
  'sapphire',
  'tangerine',
  'white',
];

export const authModalVariants = {
  login: {
    // Four wallet rows visible at a time, with the top ~20% of the fifth
    // showing as a scroll hint. Rows are 48px on a 56px pitch (8px gap), so the
    // list needs 3*56 + 48 + 8 + 9.6 = 233.6px; it measured 300.9 at 565, so
    // 565 - 67.3 = 497.7 -> 498.
    height: '498px',
  },
  createAccount: {
    // Content is 270px: 64px vertical padding, 134px header + input block, a
    // 24px gap, and a 48px bottom slot. The slot is fixed height, so this holds
    // for both the disclaimer and the Continue button that replaces it.
    height: '270px',
  },
  selectAvatar: {
    height: '402px',
  },

  welcome: {
    // Taller than Select avatar. The avatar opens to 160 on this screen and the
    // identity block goes under it: at 402 the address line landed on top of
    // the Done button with 43px of room for a 44px block, and the full wallet
    // address wraps to a second line on top of that. The card grows as the
    // avatar does, on the same spring, so the two read as one movement.
    height: '464px',
  },
};

export type IAuthModalVariants = keyof typeof authModalVariants;

export const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 150,
};

export const snappySpring = {
  type: 'spring',
  damping: 28,
  stiffness: 350,
};

// Auth modal transition. EXIT_SCALE is keyed to the blue CTA: it is 312px wide
// inside a 360px card, and should grow to leave a 10px gutter each side, so the
// target width is 360 - 20 = 340 and the scale is 340 / 312 = 1.0897.
// ENTER_SCALE is where incoming content starts.
// Strong ease-out throughout: ease-in withholds movement for the first third
// of the animation, which is exactly when the eye is watching.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EXIT_SCALE = 1.0897;
export const ENTER_SCALE = 0.98;
// Auth modal height. Separate from the shared `spring` above, which the home
// feed and the timeframe popover also use.
//
// One spring for every variant change. There used to be two — a snappier one
// applied only when the target was createAccount — which meant the same modal
// moved at two different speeds depending on where it was going: 337ms for a
// 195px change, but 889ms for a 22px one. A single spring keeps the feel
// consistent and lets distance alone decide how long a move takes.
//
// Tuned to 70% of the original settle time: settle scales with sqrt(m/k), so
// k / 0.7^2 = k * 2.04, and damping rises by 1 / 0.7 to hold the original
// damping ratio — it lands sooner without becoming bouncier.
export const authHeightSpring = {
  type: 'spring',
  // Critically damped so it does not bounce: damping = 2 * sqrt(stiffness).
  // Stiffness is k / 1.3^2 to stretch the settle by 30% (714 -> 422), and
  // damping follows at 2 * sqrt(422) = 41.1 to hold the ratio at 1.0.
  damping: 41.1,
  stiffness: 422,
};
// Choreography: the card height morphs first, then the content scales and
// fades out, and the incoming content starts fading in while that fade is still
// running — so the two cross over and a title is always on screen.
// The slot swap (disclaimer <-> Continue) springs in with a deliberate
// overshoot. Distinct from the card's height spring, which is critically
// damped precisely so it does NOT bounce — this one is meant to.
export const SLOT_ENTER_SPRING = {
  type: 'spring',
  duration: 0.585,
  // Overshoot is exponential in this value, not linear: framer maps bounce b to
  // a damping ratio of 1 - b, and the step-response overshoot is
  // exp(-pi*z / sqrt(1 - z^2)) times the travel. 0.38 measured 0.99%; halving
  // the parameter to 0.19 gave 0.16%, an 84% cut rather than 50%. Solving the
  // model for half of 0.99% lands on 0.288.
  bounce: 0.288,
};

// A spring can only overshoot in proportion to how far it travels. At the
// modal's 0.98 entry scale the swap moved 0.02, so even a high bounce produced
// a 0.2% overshoot — invisible. Starting further back gives it something to
// overshoot with.
export const SLOT_ENTER_SCALE = 0.88;

export const EXIT_DELAY = 0.05;
export const ENTER_DELAY = 0.08;
// The opacity legs get their own timing. EASE_OUT is deliberately front-loaded
// — good for the scale, wrong for a cross-fade, where it dumps almost all the
// change in the first third and reads as a pop. easeInOut spreads it across the
// window instead.
export const CROSSFADE_S = 0.24;
export const CROSSFADE_EASE = 'easeInOut' as const;

export const EXIT_DURATION = 0.127;
export const ENTER_DURATION = 0.109;

// Stand-in for the network call each auth step will eventually make. It exists
// so the CTA's loading state is reachable; replace it with the real request.
export const AUTH_SUBMIT_DELAY_MS = 800;
