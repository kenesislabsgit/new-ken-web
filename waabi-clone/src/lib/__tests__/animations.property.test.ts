import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import gsap from 'gsap';
import { fadeUp, clipReveal, bindParallax, staggerChildren, cleanupTween, cleanupScrollTrigger, _resetReducedMotionCache } from '../animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Feature: scroll-animation-system, Property 1: fadeUp tween configuration

// Mock gsap.fromTo to capture tween parameters
vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    default: {
      ...actual.default,
      fromTo: vi.fn(() => ({ kill: vi.fn() })),
      set: vi.fn(),
      registerPlugin: vi.fn(),
    },
  };
});

// Mock ScrollTrigger to avoid side effects
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(),
    killAll: vi.fn(),
  },
}));

// Mock matchMedia to return prefers-reduced-motion: false
beforeEach(() => {
  _resetReducedMotionCache();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('Property 1: fadeUp tween configuration', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For any DOM element passed to fadeUp(el, { delay }), the resulting GSAP tween
   * SHALL animate from { opacity: 0, y: 30 } to { opacity: 1, y: 0 }
   * with duration 0.8s, ease 'expo.out', and the specified delay value.
   */
  it('should configure gsap.fromTo with correct from/to values, duration, ease, and delay', () => {
    fc.assert(
      fc.property(
        fc.record({ delay: fc.float({ min: 0, max: 2, noNaN: true }) }),
        ({ delay }) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          const el = document.createElement('div');
          fadeUp(el, { delay });

          expect(gsap.fromTo).toHaveBeenCalledTimes(1);

          const [target, fromVars, toVars] = (gsap.fromTo as ReturnType<typeof vi.fn>).mock.calls[0];

          // Target is the element
          expect(target).toBe(el);

          // From values: opacity 0, y 30
          expect(fromVars).toEqual({ opacity: 0, y: 30 });

          // To values: opacity 1, y 0, duration 0.8, ease expo.out, delay matches input
          expect(toVars.opacity).toBe(1);
          expect(toVars.y).toBe(0);
          expect(toVars.duration).toBe(0.8);
          expect(toVars.ease).toBe('expo.out');
          expect(toVars.delay).toBe(delay);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 2: clipReveal tween configuration

describe('Property 2: clipReveal tween configuration', () => {
  /**
   * **Validates: Requirements 3.2**
   *
   * For any DOM element passed to clipReveal(el, { delay }), the resulting GSAP tween
   * SHALL animate from { yPercent: 100 } to { yPercent: 0 }
   * with duration 1.1s, ease 'expo.out', and the specified delay value.
   */
  it('should configure gsap.fromTo with correct from/to values, duration, ease, and delay', () => {
    fc.assert(
      fc.property(
        fc.record({ delay: fc.float({ min: 0, max: 2, noNaN: true }) }),
        ({ delay }) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          const el = document.createElement('div');
          clipReveal(el, { delay });

          expect(gsap.fromTo).toHaveBeenCalledTimes(1);

          const [target, fromVars, toVars] = (gsap.fromTo as ReturnType<typeof vi.fn>).mock.calls[0];

          // Target is the element
          expect(target).toBe(el);

          // From values: yPercent 100
          expect(fromVars).toEqual({ yPercent: 100 });

          // To values: yPercent 0, duration 1.1, ease expo.out, delay matches input
          expect(toVars.yPercent).toBe(0);
          expect(toVars.duration).toBe(1.1);
          expect(toVars.ease).toBe('expo.out');
          expect(toVars.delay).toBe(delay);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 3: bindParallax scroll-driven translateY

describe('Property 3: bindParallax scroll-driven translateY', () => {
  /**
   * **Validates: Requirements 3.3, 7.3**
   *
   * For any DOM element and parallax factor f, calling bindParallax(el, { factor: f })
   * SHALL create a ScrollTrigger where at any scroll progress p in [0, 1],
   * the element's translateY equals p × parentHeight × f.
   */
  it('should set translateY to progress × parentHeight × factor on scroll update', () => {
    const PARENT_HEIGHT = 800;

    fc.assert(
      fc.property(
        fc.record({
          factor: fc.float({ min: Math.fround(0.1), max: 1, noNaN: true }),
          progress: fc.float({ min: 0, max: 1, noNaN: true }),
        }),
        ({ factor, progress }) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          // Create a parent element with a known offsetHeight
          const parent = document.createElement('div');
          Object.defineProperty(parent, 'offsetHeight', {
            value: PARENT_HEIGHT,
            configurable: true,
          });

          // Create the media element as a child of parent
          const mediaEl = document.createElement('div');
          parent.appendChild(mediaEl);

          // Make ScrollTrigger.create capture the config
          let capturedConfig: Record<string, unknown> | null = null;
          (ScrollTrigger.create as ReturnType<typeof vi.fn>).mockImplementation(
            (config: Record<string, unknown>) => {
              capturedConfig = config;
              return { kill: vi.fn() };
            },
          );

          bindParallax(mediaEl, { factor });

          // ScrollTrigger.create should have been called
          expect(ScrollTrigger.create).toHaveBeenCalledTimes(1);
          expect(capturedConfig).not.toBeNull();

          // Simulate the onUpdate callback with the given progress
          const onUpdate = capturedConfig!.onUpdate as (self: { progress: number }) => void;
          onUpdate({ progress });

          // Verify gsap.set was called with the correct y value
          const expectedY = progress * PARENT_HEIGHT * factor;
          expect(gsap.set).toHaveBeenCalledWith(mediaEl, { y: expectedY });
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 4: staggerChildren delay sequence

describe('Property 4: staggerChildren delay sequence', () => {
  /**
   * **Validates: Requirements 3.4**
   *
   * For any container element with N children, calling staggerChildren(container, { staggerMs })
   * SHALL apply fadeUp to each child i with delay i × staggerMs milliseconds
   * (converted to seconds as i × staggerMs / 1000 for GSAP).
   */
  it('should apply fadeUp to each child with delay i × staggerMs / 1000', () => {
    fc.assert(
      fc.property(
        fc.record({
          childCount: fc.integer({ min: 1, max: 20 }),
          staggerMs: fc.integer({ min: 50, max: 500 }),
        }),
        ({ childCount, staggerMs }) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          // Create a container with N children
          const container = document.createElement('div');
          const children: HTMLElement[] = [];
          for (let i = 0; i < childCount; i++) {
            const child = document.createElement('div');
            container.appendChild(child);
            children.push(child);
          }

          staggerChildren(container, { staggerMs });

          // gsap.fromTo should have been called once per child
          expect(gsap.fromTo).toHaveBeenCalledTimes(childCount);

          const calls = (gsap.fromTo as ReturnType<typeof vi.fn>).mock.calls;

          for (let i = 0; i < childCount; i++) {
            const [target, fromVars, toVars] = calls[i];

            // Target is the i-th child
            expect(target).toBe(children[i]);

            // From values match fadeUp defaults
            expect(fromVars).toEqual({ opacity: 0, y: 30 });

            // Delay should be i × staggerMs / 1000 (ms converted to seconds)
            const expectedDelay = (i * staggerMs) / 1000;
            expect(toVars.delay).toBeCloseTo(expectedDelay, 10);

            // Other fadeUp defaults should be present
            expect(toVars.opacity).toBe(1);
            expect(toVars.y).toBe(0);
            expect(toVars.duration).toBe(0.8);
            expect(toVars.ease).toBe('expo.out');
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 5: will-change applied to all animated elements

describe('Property 5: will-change applied to all animated elements', () => {
  /**
   * **Validates: Requirements 3.5, 16.1**
   *
   * For any DOM element animated by fadeUp, clipReveal, or bindParallax,
   * the element SHALL have will-change: transform set on it before the animation begins.
   */
  it('should set will-change: transform on the element for all animation types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('fadeUp' as const, 'clipReveal' as const, 'bindParallax' as const),
        (animationType) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          const el = document.createElement('div');

          if (animationType === 'bindParallax') {
            // bindParallax requires a parent element
            const parent = document.createElement('div');
            Object.defineProperty(parent, 'offsetHeight', {
              value: 600,
              configurable: true,
            });
            parent.appendChild(el);

            (ScrollTrigger.create as ReturnType<typeof vi.fn>).mockImplementation(
              (config: Record<string, unknown>) => ({ kill: vi.fn() }),
            );

            bindParallax(el, { factor: 0.4 });
          } else if (animationType === 'fadeUp') {
            fadeUp(el);
          } else {
            clipReveal(el);
          }

          // will-change should be 'transform' after calling the animation function
          expect(el.style.willChange).toBe('transform');
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 6: Cleanup on unmount

describe('Property 6: Cleanup on unmount', () => {
  /**
   * **Validates: Requirements 16.3**
   *
   * For any DOM element that was animated by fadeUp, clipReveal, or bindParallax,
   * when the owning React component unmounts, the element's will-change property
   * SHALL be reset to 'auto' and all associated GSAP tweens/ScrollTriggers SHALL be killed.
   */
  it('should reset will-change to auto and kill tweens/ScrollTriggers after cleanup', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('fadeUp' as const, 'clipReveal' as const, 'bindParallax' as const),
        (animationType) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          const el = document.createElement('div');
          const killFn = vi.fn();

          if (animationType === 'bindParallax') {
            // bindParallax requires a parent element
            const parent = document.createElement('div');
            Object.defineProperty(parent, 'offsetHeight', {
              value: 600,
              configurable: true,
            });
            parent.appendChild(el);

            const mockST = { kill: killFn };
            (ScrollTrigger.create as ReturnType<typeof vi.fn>).mockReturnValue(mockST);

            const st = bindParallax(el, { factor: 0.4 });

            // will-change should be 'transform' before cleanup
            expect(el.style.willChange).toBe('transform');

            // Simulate unmount cleanup
            cleanupScrollTrigger(st as unknown as ScrollTrigger, el);

            // Verify kill was called on the ScrollTrigger
            expect(killFn).toHaveBeenCalledTimes(1);

            // Verify will-change is reset to 'auto'
            expect(el.style.willChange).toBe('auto');
          } else {
            // fadeUp and clipReveal return tweens
            const mockTween = { kill: killFn };
            (gsap.fromTo as ReturnType<typeof vi.fn>).mockReturnValue(mockTween);

            let tween: gsap.core.Tween | null;
            if (animationType === 'fadeUp') {
              tween = fadeUp(el);
            } else {
              tween = clipReveal(el);
            }

            // will-change should be 'transform' before cleanup
            expect(el.style.willChange).toBe('transform');

            // Simulate unmount cleanup
            cleanupTween(tween, el);

            // Verify kill was called on the tween
            expect(killFn).toHaveBeenCalledTimes(1);

            // Verify will-change is reset to 'auto'
            expect(el.style.willChange).toBe('auto');
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: scroll-animation-system, Property 13: Reduced motion disables all animations

describe('Property 13: Reduced motion disables all animations', () => {
  /**
   * **Validates: Requirements 17.1, 17.2**
   *
   * For any element that would be animated by fadeUp, clipReveal, or bindParallax,
   * when prefers-reduced-motion: reduce is active, the utility SHALL set the element
   * to its final state immediately (no tween created) and bindParallax SHALL be a
   * no-op (no ScrollTrigger created).
   */
  it('should set final state immediately with no tween created when reduced motion is active', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('fadeUp' as const, 'clipReveal' as const, 'bindParallax' as const),
          reducedMotion: fc.constant(true),
        }),
        ({ type }) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          // Mock matchMedia to return prefers-reduced-motion: true
          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query: string) => ({
              matches: true,
              media: query,
              onchange: null,
              addListener: vi.fn(),
              removeListener: vi.fn(),
              addEventListener: vi.fn(),
              removeEventListener: vi.fn(),
              dispatchEvent: vi.fn(),
            })),
          });

          const el = document.createElement('div');

          if (type === 'fadeUp') {
            const result = fadeUp(el);

            // Should return null (no tween created)
            expect(result).toBeNull();

            // gsap.fromTo should NOT have been called
            expect(gsap.fromTo).not.toHaveBeenCalled();

            // gsap.set should have been called with final state
            expect(gsap.set).toHaveBeenCalledWith(el, {
              opacity: 1,
              y: 0,
              clearProps: 'willChange',
            });
          } else if (type === 'clipReveal') {
            const result = clipReveal(el);

            // Should return null (no tween created)
            expect(result).toBeNull();

            // gsap.fromTo should NOT have been called
            expect(gsap.fromTo).not.toHaveBeenCalled();

            // gsap.set should have been called with final state
            expect(gsap.set).toHaveBeenCalledWith(el, {
              yPercent: 0,
              clearProps: 'willChange',
            });
          } else {
            // bindParallax
            const parent = document.createElement('div');
            Object.defineProperty(parent, 'offsetHeight', {
              value: 800,
              configurable: true,
            });
            parent.appendChild(el);

            const result = bindParallax(el);

            // Should return null (no ScrollTrigger created)
            expect(result).toBeNull();

            // ScrollTrigger.create should NOT have been called
            expect(ScrollTrigger.create).not.toHaveBeenCalled();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
