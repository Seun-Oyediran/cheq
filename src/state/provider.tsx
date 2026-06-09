'use client';
import React, { type ReactNode, useReducer } from 'react';
import { AppContext } from './context';
import { appReducer } from './reducer';
import { initialAppState } from './state';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface IProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export default function Provider(props: IProps) {
  const { children } = props;
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AppContext.Provider>
  );
}
