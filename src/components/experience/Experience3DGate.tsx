'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const ExperienceCanvas = dynamic(() => import('./ExperienceCanvas').then((m) => m.ExperienceCanvas), {
  ssr: false,
  loading: () => null,
});

export function Experience3DGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') ?? c.getContext('webgl');
      if (!gl) return;
    } catch {
      return;
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <ExperienceCanvas />
    </div>
  );
}