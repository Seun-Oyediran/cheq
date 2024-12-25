import React, { useEffect, useRef, useState } from 'react';
import { ArrowPrice, Base, Search } from './svgs/icons';
import { TokenIcon } from '../ui';
import home from '@/lib/assets/home';
import useOutsideClick from '@/hooks/use-outside-click';

interface IPopoverContent {
  isOpen: boolean;
}

function PopoverContent(props: IPopoverContent) {
  const { isOpen } = props;

  return (
    <div className={`w-full app_header_search_popover ${isOpen ? 'open' : ''}`}>
      <div className="flex flex-col gap-4 py-4">
        <h4 className="app_header_search_popover__title">Tokens</h4>

        <div className="">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <button key={index} type="button" className="w-full app_header_search_popover__btn">
                <div className="app_header_search_popover__item flex justify-between">
                  <div className="flex gap-2">
                    <div className="app_header_search_popover__item__icon">
                      <TokenIcon src={home.degenLayer} size={32} />
                      <div className="app_header_search_popover__item__icon__base">
                        <Base />
                      </div>
                    </div>
                    <div>
                      <p className="app_header_search_popover__item__name">DEGENLAYER</p>
                      <p className="app_header_search_popover__item__address flex gap-1 items-end">
                        <span>DEGEN</span>
                        0x0293...0293
                      </p>
                    </div>
                  </div>

                  <div className="">
                    <p className="app_header_search_popover__item__price">0.0293</p>
                    <div className="flex gap-1 items-center">
                      <ArrowPrice positive />
                      <p className="app_header_search_popover__item__change">0.0293</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export function HeaderSearch() {
  const [searchModal, setSearchModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === '/') {
      setSearchModal(true);
    }
  };

  const callback = () => {
    setSearchModal(false);
  };

  const ref = useOutsideClick<HTMLDivElement>(callback);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (searchModal && inputRef?.current) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [searchModal]);

  return (
    <div className={`app_header__middle flex-1 ${searchModal ? 'open' : ''}`} ref={ref}>
      <div className="app_header__middle__search flex items-center gap-2">
        <Search />
        <input
          ref={inputRef}
          type="text"
          className="app_header__middle__search__input"
          placeholder="Search Markets"
          onFocus={() => {
            // setSearchModal(true);
          }}
        />
        <div className="app_header__middle__search__icon">
          <p className="app_header__middle__search__icon__text">/</p>
        </div>
      </div>
      <PopoverContent isOpen={searchModal} />
    </div>
  );
}
