'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseAnimateOnViewOptions {
  threshold?: number;       // default 0.15 (trigger at 15% visibility)
  rootMargin?: string;      // default '0px 0px -15% 0px' (trigger at ~85% viewport)
  once?: boolean;           // default true
  onEnter?: (el: Element) => void;  // callback when element enters
}

/**
 * IntersectionObserver-based hook for one-shot entrance animations.
 * Returns `{ isInView: boolean }`.
 *
 * Fallback: if IntersectionObserver is not supported, elements are shown
 * in their final state immediately (isInView defaults to true).
 */
export function useAnimateOnView(
  ref: React.RefObject<Element>,
  options?: UseAnimateOnViewOptions,
): { isInView: boolean } {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -15% 0px',
    once = true,
    onEnter,
  } = options ?? {};

  // If IntersectionObserver is not supported, default to visible
  const supportsIO = typeof window !== 'undefined' && 'IntersectionObserver' in window;
  const [isInView, setIsInView] = useState(!supportsIO);

  // Stable ref for the onEnter callback to avoid re-creating the observer
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: no IntersectionObserver support
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      onEnterRef.current?.(el);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsInView(true);
            onEnterRef.current?.(entry.target);

            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);

  return { isInView };
}
