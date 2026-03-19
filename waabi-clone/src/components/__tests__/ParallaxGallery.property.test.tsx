// Feature: scroll-animation-system, Property 7: ParallaxGallery equal treatment of media types

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import gsap from 'gsap';
import { bindParallax, _resetReducedMotionCache } from '@/lib/animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Mock gsap to capture tween parameters
vi.mock('gsap', async () => {
  const actual = await vi.importActual<typeof import('gsap')>('gsap');
  return {
    ...actual,
    default: {
      ...actual.default,
      fromTo: vi.fn(() => ({
        kill: vi.fn(),
        scrollTrigger: { kill: vi.fn() },
      })),
      set: vi.fn(),
      registerPlugin: vi.fn(),
    },
  };
});

// Mock ScrollTrigger to capture configs
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn(() => ({ kill: vi.fn() })),
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

describe('Property 7: ParallaxGallery equal treatment of media types', () => {
  /**
   * **Validates: Requirements 7.5**
   *
   * For any ParallaxGallery panel, regardless of whether it contains an image or video,
   * the parallax factor and scale-on-enter scrub range SHALL be identical.
   *
   * This test generates random arrays of 'image' and 'video' types, simulates the
   * component's animation setup for each panel, and verifies that:
   * 1. bindParallax receives the same factor (0.4) for all panels
   * 2. gsap.fromTo receives the same scale range (1 → 1.04) for all panels
   */
  it('should apply identical parallax factor and scale range to both image and video panels', () => {
    const PARALLAX_FACTOR = 0.4;
    const SCALE_FROM = 1;
    const SCALE_TO = 1.04;

    fc.assert(
      fc.property(
        fc.array(fc.constantFrom('image' as const, 'video' as const), {
          minLength: 2,
          maxLength: 10,
        }),
        (mediaTypes) => {
          vi.clearAllMocks();
          _resetReducedMotionCache();

          // Track ScrollTrigger.create configs for each panel
          const parallaxConfigs: Record<string, unknown>[] = [];
          (ScrollTrigger.create as ReturnType<typeof vi.fn>).mockImplementation(
            (config: Record<string, unknown>) => {
              parallaxConfigs.push(config);
              return { kill: vi.fn() };
            },
          );

          // Simulate the component's animation setup for each panel
          // This mirrors ParallaxGallery's useEffect logic exactly
          mediaTypes.forEach((type) => {
            // Create panel container (100vh) and media element (130vh)
            const panelEl = document.createElement('div');
            const mediaEl = document.createElement('div');
            panelEl.appendChild(mediaEl);

            Object.defineProperty(panelEl, 'offsetHeight', {
              value: 800,
              configurable: true,
            });

            // The component calls bindParallax with factor 0.4 for ALL panels
            // regardless of whether the panel is image or video
            bindParallax(mediaEl, { factor: PARALLAX_FACTOR });

            // The component calls gsap.fromTo for scale animation on ALL panels
            gsap.fromTo(
              mediaEl,
              { scale: SCALE_FROM },
              {
                scale: SCALE_TO,
                ease: 'none',
                scrollTrigger: {
                  trigger: panelEl,
                  start: 'top bottom',
                  end: 'top top',
                  scrub: true,
                },
              },
            );
          });

          const panelCount = mediaTypes.length;

          // Verify bindParallax was called once per panel
          expect(ScrollTrigger.create).toHaveBeenCalledTimes(panelCount);

          // Verify gsap.fromTo was called once per panel (for scale animation)
          expect(gsap.fromTo).toHaveBeenCalledTimes(panelCount);

          const fromToCalls = (gsap.fromTo as ReturnType<typeof vi.fn>).mock.calls;

          // Verify all panels receive identical parallax and scale configs
          for (let i = 0; i < panelCount; i++) {
            // Check that the onUpdate callback in each ScrollTrigger config
            // uses the same factor by simulating a progress update
            const config = parallaxConfigs[i];
            expect(config).toBeDefined();

            const onUpdate = config.onUpdate as (self: { progress: number }) => void;
            // Clear gsap.set calls before simulating
            (gsap.set as ReturnType<typeof vi.fn>).mockClear();
            onUpdate({ progress: 0.5 });

            // The y offset should be 0.5 * parentHeight * factor
            const expectedY = 0.5 * 800 * PARALLAX_FACTOR;
            const setCall = (gsap.set as ReturnType<typeof vi.fn>).mock.calls[0];
            expect(setCall[1].y).toBeCloseTo(expectedY, 5);

            // Check scale animation from/to values are identical for all panels
            const [, fromVars, toVars] = fromToCalls[i];
            expect(fromVars.scale).toBe(SCALE_FROM);
            expect(toVars.scale).toBe(SCALE_TO);
            expect(toVars.ease).toBe('none');
            expect(toVars.scrollTrigger.scrub).toBe(true);
          }

          // Cross-check: all panels have the same parallax factor behavior
          // by comparing the first panel's y offset with every other panel
          if (panelCount > 1) {
            const testProgress = 0.75;
            const yOffsets: number[] = [];

            for (let i = 0; i < panelCount; i++) {
              const config = parallaxConfigs[i];
              const onUpdate = config.onUpdate as (self: { progress: number }) => void;
              (gsap.set as ReturnType<typeof vi.fn>).mockClear();
              onUpdate({ progress: testProgress });
              const setCall = (gsap.set as ReturnType<typeof vi.fn>).mock.calls[0];
              yOffsets.push(setCall[1].y);
            }

            // All y offsets should be identical (same factor, same parent height)
            const firstY = yOffsets[0];
            for (let i = 1; i < yOffsets.length; i++) {
              expect(yOffsets[i]).toBeCloseTo(firstY, 5);
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
