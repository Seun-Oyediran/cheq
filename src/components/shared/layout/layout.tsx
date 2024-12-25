import React, { type ReactNode } from 'react';
import { Header } from '../header';
import { ModalBackdrop } from '../modal-backdrop';

interface IProps {
  children: ReactNode;
}

export function Layout(props: IProps) {
  const { children } = props;

  return (
    <main className="app_layout">
      <div className="app_layout__header">
        <Header />
      </div>
      <div className="app_layout__main">{children}</div>
      <ModalBackdrop />
    </main>
  );
}
