import { type IAuthModalVariants } from '@/lib/utils/static';
import { ActionType, type AppActions } from './actions';
import { type AppState } from './state';

export function appReducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case ActionType.UpdateAuthModal:
      return {
        ...state,
        authModal: {
          show: action.payload.show,
          variant: action.payload.variant,
        },
      };

    default:
      return state;
  }
}

interface IUpdateAuthModal {
  show: boolean;
  variant?: IAuthModalVariants;
}
export const updateAuthModal = ({ show, variant = 'login' }: IUpdateAuthModal) => ({
  type: ActionType.UpdateAuthModal,
  payload: {
    show,
    variant,
  },
});
