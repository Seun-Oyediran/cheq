import React, { type ReactNode } from 'react';
import { Header } from '../header';
import { Footer } from '../footer';
import { ModalBackdrop } from '../modal-backdrop';

interface IProps {
  children: ReactNode;
}

export default function AppLayout(props: IProps) {
  const { children } = props;

  return (
    <main className="app_layout">
      <div className="app_layout__header">
        <Header />
      </div>
      <div className="app_layout__main">
        <div className="app_layout__ctt">{children}</div>
        <div className="app_layout__footer">
          <Footer />
        </div>
      </div>
      <ModalBackdrop />
    </main>
  );
}
