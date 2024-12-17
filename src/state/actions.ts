import { type IAuthModalVariants } from '@/lib/utils/static';

export enum ActionType {
  UpdateAuthModal,
}

export interface UpdateAuthModal {
  type: ActionType.UpdateAuthModal;
  payload: {
    show: boolean;
    variant: IAuthModalVariants;
  };
}

export type AppActions = UpdateAuthModal;
