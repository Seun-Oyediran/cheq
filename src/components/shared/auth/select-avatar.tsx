import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '@/state/context';
import { Button } from '@/components/ui';
import { Avi } from '../avi';
import { updateAuthModal } from '@/state/reducer';
import { type IAviVariants } from '@/lib/utils/static';

const conVariants = {
  hover: {
    width: '72px',
    height: '72px',
    borderRadius: '14px',
  },
};

const svgVariants = {
  hover: {
    width: '58px',
    height: '58px',
  },
};

const variantOptions: IAviVariants[] = ['sapphire', 'white', 'aquafresh', 'tangerine', 'mantis'];

export function SelectAvatar() {
  const { dispatch } = useAppContext();
  const [selectedAvatar, setSelectedAvatar] = useState<IAviVariants>('black');

  return (
    <div className="app_login h-full flex flex-col justify-between gap-14 app_select_avatar">
      <div className="app_login__top__title flex flex-col gap-1">
        <h3 className="app_login__top__title__text">Select your avatar</h3>
      </div>

      <div className="flex justify-center app_select_avatar__icons items-end">
        {variantOptions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setSelectedAvatar(item);
            }}
          >
            <motion.div className="app_select_avatar__icons__item" whileHover="hover">
              <Avi
                size={56}
                variant={item}
                conVariants={conVariants}
                svgVariants={svgVariants}
                borderRadius={11}
              />
            </motion.div>
          </button>
        ))}
      </div>

      <div className="app_select_avatar__info flex flex-col gap-2 items-center">
        <Avi variant={selectedAvatar} size={72} padding={8} borderRadius={14} />

        <div className="flex flex-col gap-1">
          <h4 className="app_select_avatar__info__name">Basegod69</h4>
          <p className="app_select_avatar__info__address">0x27...0293</p>
        </div>
      </div>

      <div className="mb-3">
        <Button
          onClick={() => {
            dispatch(
              updateAuthModal({
                show: true,
                variant: 'welcome',
              })
            );
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
