import { type IAuthModalVariants } from '@/lib/utils/static';
import { ActionType, type UpdatePositionOpenedModal, type AppActions } from './actions';
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

    case ActionType.UpdatePositionOpenedModal:
      return {
        ...state,
        positionOpened: {
          show: action.payload.show,
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

export const updatePositionOpenedModal = (show: boolean): UpdatePositionOpenedModal => {
  return {
    type: ActionType.UpdatePositionOpenedModal,
    payload: {
      show,
    },
  };
};
