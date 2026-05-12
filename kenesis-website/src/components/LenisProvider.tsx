'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';

// Lenis and GSAP are loaded dynamically after hydration so they are excluded
// from the critical JS bundle. This keeps First Load JS small on all pages.

interface LenisContextValue {
  lenis: unknown | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<unknown | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      import('@studio-freight/lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([{ default: Lenis }, { default: gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const lenis = new Lenis({
        smoothWheel: !prefersReduced,
        syncTouch: true,
        syncTouchLerp: 0.075,
        touchInertiaMultiplier: 25,
        autoRaf: false,
        lerp: 0.1,
        duration: 1.0,
        wheelMultiplier: 1.0,
      } as never);

      lenisRef.current = lenis;

      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      lenis.on('scroll', ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const t1 = setTimeout(() => ScrollTrigger.refresh(), 1500);
      const t2 = setTimeout(() => ScrollTrigger.refresh(), 5000);

      cleanupRef.current = () => {
        clearTimeout(t1);
        clearTimeout(t2);
        gsap.ticker.remove(tick);
        lenis.destroy();
        ScrollTrigger.killAll();
      };
    });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </LenisContext.Provider>
  );
}
