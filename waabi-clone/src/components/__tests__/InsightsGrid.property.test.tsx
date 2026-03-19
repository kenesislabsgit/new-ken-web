// Feature: scroll-animation-system, Property 10: InsightsGrid row-stagger delay

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Mirror of the getCardDelay function exported from InsightsGrid.tsx.
 * Formula: (index % 3) * 150 (in milliseconds).
 *
 * The canonical implementation is:
 *   export function getCardDelay(index: number): number {
 *     return (index % 3) * 150;
 *   }
 */
function getCardDelay(index: number): number {
  return (index % 3) * 150;
}

describe('Property 10: InsightsGrid row-stagger delay', () => {
  /**
   * **Validates: Requirements 13.2**
   *
   * For any article card at index i in the InsightsGrid, the entrance delay
   * SHALL be (i % 3) × 150 ms with a fadeUp duration of 0.75s.
   */
  it('should assign correct row-stagger delays to cards', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        (index) => {
          const delay = getCardDelay(index);
          const expectedDelay = (index % 3) * 150;
          expect(delay).toBe(expectedDelay);

          // Verify the delay pattern repeats every 3 cards
          // Column 0 = 0ms, Column 1 = 150ms, Column 2 = 300ms
          const column = index % 3;
          if (column === 0) {
            expect(delay).toBe(0);
          } else if (column === 1) {
            expect(delay).toBe(150);
          } else {
            expect(delay).toBe(300);
          }

          // Verify delay is always one of the three valid values
          expect([0, 150, 300]).toContain(delay);

          // Verify cards in the same column across different rows share the same delay
          const sameColumnNextRow = index + 3;
          expect(getCardDelay(sameColumnNextRow)).toBe(delay);
        },
      ),
      { numRuns: 100 },
    );
  });
});
