import { type IAuthModalVariants } from '@/lib/utils/static';

export enum ActionType {
  UpdateAuthModal,
  UpdatePositionOpenedModal,
}

export interface UpdateAuthModal {
  type: ActionType.UpdateAuthModal;
  payload: {
    show: boolean;
    variant: IAuthModalVariants;
  };
}

export interface UpdatePositionOpenedModal {
  type: ActionType.UpdatePositionOpenedModal;
  payload: {
    show: boolean;
  };
}

export type AppActions = UpdateAuthModal | UpdatePositionOpenedModal;
