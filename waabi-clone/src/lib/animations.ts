import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// --- Option Interfaces ---

export interface FadeUpOptions {
  delay?: number;    // default 0
  duration?: number; // default 0.8
  y?: number;        // default 30 (pixels)
  ease?: string;     // default 'expo.out'
}

export interface ClipRevealOptions {
  delay?: number;    // default 0
  duration?: number; // default 1.1
  ease?: string;     // default 'expo.out'
}

export interface ParallaxOptions {
  factor?: number; // default 0.4
  start?: string;  // default 'top bottom'
  end?: string;    // default 'bottom top'
}

export interface StaggerOptions {
  staggerMs?: number;                    // default 120
  animation?: 'fadeUp' | 'clipReveal';   // default 'fadeUp'
}

// --- Reduced Motion Detection ---

let _reducedMotionCached: boolean | null = null;

/**
 * Reads and caches `window.matchMedia('(prefers-reduced-motion: reduce)')`.
 * Returns `true` if the user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (_reducedMotionCached !== null) return _reducedMotionCached;
  if (typeof window === 'undefined') return false;
  _reducedMotionCached = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return _reducedMotionCached;
}

/**
 * Reset the cached reduced motion value. Useful for testing.
 */
export function _resetReducedMotionCache(): void {
  _reducedMotionCached = null;
}

// --- Animation Utilities ---

/**
 * Fade-up entrance animation.
 * Animates from { opacity: 0, y } to { opacity: 1, y: 0 }.
 * Applies `will-change: transform` before animation.
 * Returns the tween (or a no-op tween if reduced motion).
 */
export function fadeUp(
  el: Element | null,
  options?: FadeUpOptions,
): gsap.core.Tween | null {
  if (!el) return null;

  const {
    delay = 0,
    duration = 0.8,
    y = 30,
    ease = 'expo.out',
  } = options ?? {};

  const htmlEl = el as HTMLElement;

  if (prefersReducedMotion()) {
    // Set final state immediately — no animation
    gsap.set(el, { opacity: 1, y: 0, clearProps: 'willChange' });
    return null;
  }

  // Apply will-change before animation for GPU acceleration
  htmlEl.style.willChange = 'transform';

  const tween = gsap.fromTo(
    el,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      onComplete() {
        // Clean up will-change after animation completes
        htmlEl.style.willChange = 'auto';
      },
    },
  );

  return tween;
}

/**
 * Clip-reveal animation.
 * Animates from { yPercent: 100 } to { yPercent: 0 } within an overflow-hidden parent.
 * Applies `will-change: transform` before animation.
 * Returns the tween (or null if reduced motion).
 */
export function clipReveal(
  el: Element | null,
  options?: ClipRevealOptions,
): gsap.core.Tween | null {
  if (!el) return null;

  const {
    delay = 0,
    duration = 1.1,
    ease = 'expo.out',
  } = options ?? {};

  const htmlEl = el as HTMLElement;

  if (prefersReducedMotion()) {
    // Set final state immediately — no animation
    gsap.set(el, { yPercent: 0, clearProps: 'willChange' });
    return null;
  }

  // Apply will-change before animation for GPU acceleration
  htmlEl.style.willChange = 'transform';

  const tween = gsap.fromTo(
    el,
    { yPercent: 100 },
    {
      yPercent: 0,
      duration,
      delay,
      ease,
      onComplete() {
        htmlEl.style.willChange = 'auto';
      },
    },
  );

  return tween;
}

/**
 * Scroll-driven parallax.
 * Creates a ScrollTrigger where translateY = progress × parentHeight × factor.
 * Applies `will-change: transform` before animation.
 * Returns the ScrollTrigger instance (or null if reduced motion / no element).
 */
export function bindParallax(
  mediaEl: Element | null,
  options?: ParallaxOptions,
): ScrollTrigger | null {
  if (!mediaEl) return null;

  const {
    factor = 0.4,
    start = 'top bottom',
    end = 'bottom top',
  } = options ?? {};

  if (prefersReducedMotion()) {
    // No parallax for reduced motion
    return null;
  }

  const htmlEl = mediaEl as HTMLElement;

  // Apply will-change before animation for GPU acceleration
  htmlEl.style.willChange = 'transform';

  const parentEl = htmlEl.parentElement;
  const parentHeight = parentEl ? parentEl.offsetHeight : 0;

  const trigger = ScrollTrigger.create({
    trigger: parentEl || mediaEl,
    start,
    end,
    onUpdate(self) {
      const yOffset = self.progress * parentHeight * factor;
      gsap.set(mediaEl, { y: yOffset });
    },
    onLeave() {
      htmlEl.style.willChange = 'auto';
    },
    onLeaveBack() {
      htmlEl.style.willChange = 'auto';
    },
    onEnter() {
      htmlEl.style.willChange = 'transform';
    },
    onEnterBack() {
      htmlEl.style.willChange = 'transform';
    },
  });

  return trigger;
}

/**
 * Stagger children animation.
 * Applies fadeUp (or clipReveal) to each direct child of `container`
 * with a configurable stagger delay (default 120ms).
 * Returns an array of tweens for cleanup.
 */
export function staggerChildren(
  container: Element | null,
  options?: StaggerOptions,
): (gsap.core.Tween | null)[] {
  if (!container) return [];

  const {
    staggerMs = 120,
    animation = 'fadeUp',
  } = options ?? {};

  const children = Array.from(container.children);
  const tweens: (gsap.core.Tween | null)[] = [];

  const animFn = animation === 'clipReveal' ? clipReveal : fadeUp;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const delay = (i * staggerMs) / 1000; // convert ms to seconds for GSAP
    const tween = animFn(child, { delay });
    tweens.push(tween);
  }

  return tweens;
}

// --- Cleanup Helpers ---

/**
 * Kill a tween and reset will-change on the element.
 */
export function cleanupTween(tween: gsap.core.Tween | null, el?: Element | null): void {
  if (tween) {
    tween.kill();
  }
  if (el) {
    (el as HTMLElement).style.willChange = 'auto';
  }
}

/**
 * Kill a ScrollTrigger and reset will-change on the element.
 */
export function cleanupScrollTrigger(st: ScrollTrigger | null, el?: Element | null): void {
  if (st) {
    st.kill();
  }
  if (el) {
    (el as HTMLElement).style.willChange = 'auto';
  }
}
