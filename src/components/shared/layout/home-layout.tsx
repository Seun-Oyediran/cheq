import React, { Fragment, type ReactNode } from 'react';
import { Footer } from '../footer';

interface IProps {
  children: ReactNode;
}

export function HomeLayout(props: IProps) {
  const { children } = props;

  return (
    <Fragment>
      <div className="app_layout__ctt">{children}</div>
      <div className="app_layout__footer">
        <Footer />
      </div>
    </Fragment>
  );
}
