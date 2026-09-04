import { type IAuthModalVariants } from '@/lib/utils/static';

export type ITheme = 'light' | 'dark';

export const initialAppState = {
  authModal: {
    show: false,
    variant: 'login' as IAuthModalVariants,
    username: '',
    // The avatar the user builds on Select avatar, carried to Welcome so the
    // final screen shows the one they made rather than a hardcoded default.
    colorIdx: 2,
    exprIdx: 2,
  },
  positionOpened: {
    show: false,
  },
};

export type AppState = ReturnType<() => typeof initialAppState>;
