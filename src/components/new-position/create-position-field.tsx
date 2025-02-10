import React, { type ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretDown } from '../shared/svgs/icons';
import useOutsideClick from '@/hooks/use-outside-click';

interface IProps {
  label?: string;
  info?: ReactNode;
  popover?: ReactNode;
  value?: ReactNode;
  popoverClassName?: string;
}

export function CreatePositionField(props: IProps) {
  const { label, info, popover, value, popoverClassName } = props;
  const [isOpen, setIsOpen] = useState(false);

  const callback = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick<HTMLDivElement>(callback);

  return (
    <div className="app_create_position_field flex flex-col gap-2">
      <h4 className="app_create_position_field__label">{label}</h4>

      <div className="flex flex-col gap-1">
        <div className="app_create_position_field__relative" ref={ref}>
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
            className="w-full flex"
          >
            <div className="app_create_position_field__input flex-1 flex items-center gap-3">
              <div className="app_create_position_field__input__text text-left flex-1">{value}</div>

              <CaretDown width={16} height={16} fill="#5F6368" />
            </div>
          </button>
          <AnimatePresence initial={false} mode="wait">
            {isOpen && (
              <motion.div
                className={`app_create_position_field__input__popover flex ${popoverClassName}`}
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: {
                    maxHeight: '210px',
                    transition: { duration: 0.2 },
                    zIndex: 99,
                  },
                  collapsed: {
                    maxHeight: '0px',
                    transition: { duration: 0.2 },
                    zIndex: 2,
                  },
                }}
              >
                {popover}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="app_create_position_field__info">{info}</div>
      </div>
    </div>
  );
}
