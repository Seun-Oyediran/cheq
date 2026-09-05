'use client';
import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Agentation } from 'agentation';
import { Layout } from './layout';

/**
 * Routes that render bare: no header, no modal backdrop, and none of the dev
 * overlays. /record exists to be screen-captured, and an inspector or an
 * annotation pin in the corner ends up in the recording.
 */
const BARE_ROUTES = ['/record'];

export function Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((r) => pathname?.startsWith(r));

  if (bare) return <>{children}</>;

  return (
    <>
      <Layout>{children}</Layout>
      {process.env.NODE_ENV === 'development' && <Agentation endpoint="http://localhost:4747" />}
      {/* Mesurer is off. The package is still installed and the client
          boundary it needs is still at shared/mesurer-overlay — to bring it
          back, render <MesurerOverlay /> here alongside Agentation. */}
    </>
  );
}
