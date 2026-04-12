'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- Context ---

interface LenisContextValue {
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({ lenis: null });

export const useLenis = () => useContext(LenisContext);

// --- Provider ---

interface LenisProviderProps {
  children: ReactNode;
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin before any scroll-driven animations
    gsap.registerPlugin(ScrollTrigger);

    // Check prefers-reduced-motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize Lenis with smooth scrolling (disabled if reduced motion)
    // autoRaf: false because we drive Lenis manually via GSAP ticker
    const lenisInstance = new Lenis({
      smoothWheel: !prefersReduced,
      syncTouch: true,        // Sync touch events with Lenis for consistent behavior
      syncTouchLerp: 0.075,   // Lighter lerp for touch — closer to native feel
      touchInertiaMultiplier: 25, // Natural touch momentum
      autoRaf: false,
      lerp: 0.1,
      duration: 1.0,
      wheelMultiplier: 1.0,
    } as any);

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // Link Lenis scroll events to ScrollTrigger.update()
    lenisInstance.on('scroll', ScrollTrigger.update);

    // Link gsap.ticker to lenis.raf so Lenis uses GSAP's frame loop
    const tickerCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);

    // Disable GSAP lag smoothing for consistent scroll-driven animation timing
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after dynamic content loads
    // This recalculates all pin positions and scroll heights
    const refresh1 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    const refresh2 = setTimeout(() => ScrollTrigger.refresh(), 5000);

    // Cleanup on unmount
    return () => {
      clearTimeout(refresh1);
      clearTimeout(refresh2);
      gsap.ticker.remove(tickerCallback);
      lenisInstance.destroy();
      ScrollTrigger.killAll();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  );
}
