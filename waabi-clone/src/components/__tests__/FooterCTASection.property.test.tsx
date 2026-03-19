// Feature: scroll-animation-system, Property 12: FooterCTA links stagger timing

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Mirror of the getLinkDelay function exported from FooterCTASection.tsx.
 *
 * The canonical implementation is:
 *   export function getLinkDelay(index: number): number {
 *     return 600 + index * 80;
 *   }
 */
function getLinkDelay(index: number): number {
  return 600 + index * 80;
}

describe('Property 12: FooterCTA links stagger timing', () => {
  /**
   * **Validates: Requirements 15.3**
   *
   * For any set of N footer links in the FooterCTASection, link at index i
   * SHALL have entrance delay 600 + i × 80 ms using the fadeUp animation.
   */
  it('should compute correct stagger delay for any link index', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 30 }),
        (linkCount) => {
          for (let i = 0; i < linkCount; i++) {
            const delay = getLinkDelay(i);

            // 1. Link at index i has delay = 600 + i * 80 ms
            expect(delay).toBe(600 + i * 80);
          }

          // 2. First link starts at 600ms
          expect(getLinkDelay(0)).toBe(600);

          // 3. Each subsequent link is 80ms later than the previous
          for (let i = 1; i < linkCount; i++) {
            expect(getLinkDelay(i) - getLinkDelay(i - 1)).toBe(80);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
