import React, { useEffect } from 'react';
import Link from 'next/link';
import { Popover } from 'react-tiny-popover';
import { motion } from 'framer-motion';
import { useAppContext } from '@/state/context';
import { updatePositionOpenedModal } from '@/state/reducer';
import { Copy, KidStar } from '../shared/svgs/icons';
import { Button } from '../ui';
import { Avi } from '../shared';

interface IAnimatedStar {
  top?: number;
  left?: number;
  scale?: number;
}

function AnimatedStar(props: IAnimatedStar) {
  const { left = 0, top = 0, scale = 1 } = props;

  return (
    <motion.div
      className="app_position_opened__icon__star"
      style={
        {
          // top: `${top}px`,
          // left: `${left}px`,
        }
      }
      animate={{
        scale,
        top,
        left,
        transition: {
          // repeat: Infinity,
          // duration: 5,
          // repeatType: 'reverse',
        },
      }}
      initial={{
        scale: scale - 0.5,
        top,
        left,
      }}
    >
      <KidStar />
    </motion.div>
  );
}

function PositionOpenedPopover() {
  return (
    <div className="app_position_opened flex flex-col gap-10">
      <div className=" flex justify-center">
        <div className="app_position_opened__icon">
          <Avi size={80} />
          <AnimatedStar left={-30} top={-20} />
          <AnimatedStar left={-30} top={20} scale={0.75} />
          <AnimatedStar left={-30} top={65} scale={0.5} />

          <AnimatedStar left={90} top={-25} />
          <AnimatedStar left={85} top={25} scale={0.75} />
          <AnimatedStar left={80} top={60} scale={0.5} />
        </div>
      </div>

      <div className="app_position_opened__center flex flex-col gap-6">
        <div className="app_position_opened__center__title flex flex-col gap-1">
          <h1 className="app_position_opened__center__title__text">Position Opened</h1>
          <p className="app_position_opened__center__title__details">
            Sit Back and watch the charts
          </p>
        </div>

        <div className="app_position_opened__center__title">
          <p className="app_position_opened__center__title__details">
            You can manage your positions from{' '}
            <Link className="app_position_opened__center__title__details__link" href={'#'}>
              Open Positions
            </Link>
          </p>
        </div>

        <div className="app_position_opened__center__referral flex justify-center">
          <button>
            <div className="flex items-center gap-2 app_position_opened__center__referral__btn">
              <Copy />
              <p className="app_position_opened__center__referral__text">Copy referral</p>
            </div>
          </button>
        </div>
      </div>
      <div>
        <Button className="app_create_position__footer__btn" onClick={() => {}}>
          Continue
        </Button>
      </div>
    </div>
  );
}

export function PositionOpened() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    // dispatch(updatePositionOpenedModal(true));
  }, []);

  return (
    <Popover
      isOpen={state.positionOpened.show}
      positions={['top', 'bottom']}
      align="center"
      padding={24}
      containerClassName="app_auth_popover"
      onClickOutside={() => {
        dispatch(updatePositionOpenedModal(false));
      }}
      content={<PositionOpenedPopover />}
    >
      <p className="app_new_position__bottom__info__text">
        Cheq is not directly in control of any memecoins or tokens
      </p>
    </Popover>
  );
}
