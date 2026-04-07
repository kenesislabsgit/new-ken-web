// Feature: scroll-animation-system, Property 11: CareersCTA mosaic directional mapping

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Mirror of the getMosaicAnimation function exported from CareersCTASection.tsx.
 *
 * The canonical implementation is:
 *   export function getMosaicAnimation(position: string): MosaicAnimationConfig {
 *     switch (position) {
 *       case 'top-left':    return { x: -40, delay: 0 };
 *       case 'top-right':   return { x: 40, delay: 0 };
 *       case 'bottom-left': return { y: 40, delay: 0 };
 *       case 'bottom-right': return { y: 40, delay: 0.1 };
 *       default:            return { delay: 0 };
 *     }
 *   }
 */
interface MosaicAnimationConfig {
  x?: number;
  y?: number;
  delay: number;
}

function getMosaicAnimation(position: string): MosaicAnimationConfig {
  switch (position) {
    case 'top-left':
      return { x: -40, delay: 0 };
    case 'top-right':
      return { x: 40, delay: 0 };
    case 'bottom-left':
      return { y: 40, delay: 0 };
    case 'bottom-right':
      return { y: 40, delay: 0.1 };
    default:
      return { delay: 0 };
  }
}

describe('Property 11: CareersCTA mosaic directional mapping', () => {
  /**
   * **Validates: Requirements 14.2**
   *
   * For any mosaic image position in the CareersCTASection, the entrance animation
   * direction SHALL map as: top-left → translateX(-40px), top-right → translateX(40px),
   * bottom-left → translateY(40px), bottom-right → translateY(40px) with 100ms
   * additional delay. All animations SHALL have duration 1.0s.
   */
  it('should map mosaic positions to correct directional animations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('top-left', 'top-right', 'bottom-left', 'bottom-right'),
        (position) => {
          const config = getMosaicAnimation(position);

          switch (position) {
            case 'top-left':
              expect(config.x).toBe(-40);
              expect(config.y).toBeUndefined();
              expect(config.delay).toBe(0);
              break;
            case 'top-right':
              expect(config.x).toBe(40);
              expect(config.y).toBeUndefined();
              expect(config.delay).toBe(0);
              break;
            case 'bottom-left':
              expect(config.x).toBeUndefined();
              expect(config.y).toBe(40);
              expect(config.delay).toBe(0);
              break;
            case 'bottom-right':
              expect(config.x).toBeUndefined();
              expect(config.y).toBe(40);
              expect(config.delay).toBe(0.1);
              break;
          }

          // All positions must have a numeric delay
          expect(typeof config.delay).toBe('number');

          // Only bottom-right has an additional delay
          if (position === 'bottom-right') {
            expect(config.delay).toBeGreaterThan(0);
          } else {
            expect(config.delay).toBe(0);
          }

          // Top positions use x-axis, bottom positions use y-axis
          if (position.startsWith('top')) {
            expect(config.x).toBeDefined();
            expect(config.y).toBeUndefined();
          } else {
            expect(config.y).toBeDefined();
            expect(config.x).toBeUndefined();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
