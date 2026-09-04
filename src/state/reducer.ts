import { type IAuthModalVariants } from '@/lib/utils/static';
import { ActionType, type UpdatePositionOpenedModal, type AppActions } from './actions';
import { type AppState } from './state';

export function appReducer(state: AppState, action: AppActions): AppState {
  switch (action.type) {
    case ActionType.UpdateAuthModal:
      return {
        ...state,
        authModal: {
          ...state.authModal,
          show: action.payload.show,
          variant: action.payload.variant,
          // Closing wipes the draft username, so every fresh open of the modal
          // starts with an empty field. It has to happen here rather than in
          // the input's own state: the store outlives CreateAccount's unmount
          // and the field seeds itself from it, so the previous attempt came
          // back the next time the modal was opened. The screen-to-screen
          // handoffs all pass show: true, so the value still carries from
          // Username through to Select avatar.
          ...(action.payload.show
            ? action.payload.username !== undefined && { username: action.payload.username }
            : { username: '' }),
          ...(action.payload.colorIdx !== undefined && { colorIdx: action.payload.colorIdx }),
          ...(action.payload.exprIdx !== undefined && { exprIdx: action.payload.exprIdx }),
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
  username?: string;
  colorIdx?: number;
  exprIdx?: number;
}
export const updateAuthModal = ({
  show,
  variant = 'login',
  username,
  colorIdx,
  exprIdx,
}: IUpdateAuthModal) => ({
  type: ActionType.UpdateAuthModal,
  payload: {
    show,
    variant,
    username,
    colorIdx,
    exprIdx,
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
