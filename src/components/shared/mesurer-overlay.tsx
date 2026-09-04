'use client';
import React from 'react';
import { Mesurer } from 'mesurer';
import 'mesurer/styles.css';

/**
 * Mesurer ships without a 'use client' directive of its own, so importing it
 * straight into the root layout put its createContext call in a server
 * component and blew up the render. This file is the client boundary it needs.
 */
export function MesurerOverlay() {
  return <Mesurer />;
}
