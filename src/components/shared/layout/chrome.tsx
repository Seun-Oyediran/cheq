'use client';
import React, { type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
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
      {/* Both dev overlays are off. Agentation's launcher sits bottom-right and
          was showing up in screen recordings of the real site, where BARE_ROUTES
          does not apply. Mesurer is off too.

          To bring either back, render it here behind the NODE_ENV check:
            <Agentation endpoint="http://localhost:4747" />
            <MesurerOverlay />
          Annotations stop being collected while Agentation is not mounted. */}
    </>
  );
}
