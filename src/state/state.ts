import { type IAuthModalVariants } from '@/lib/utils/static';

export type ITheme = 'light' | 'dark';

export const initialAppState = {
  authModal: {
    show: false,
    variant: 'login' as IAuthModalVariants,
  },
};

export type AppState = ReturnType<() => typeof initialAppState>;