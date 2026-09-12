/**
 * Exploration tier for the classic easing functions.
 *
 * Total laws (endpoints, reflection, midpoint, range containment, finiteness)
 * moved to `easing.law.test.ts`, which runs inside the merge gate at low
 * `numRuns` (#2017). What stays here needs either a tuned tolerance or a
 * parameter sweep too expensive to gate on: C0 continuity, and the elastic
 * family's amplitude/period space.
 */

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  allFunctions,
  checkContinuity,
  elasticContinuityParams,
  PROPERTY_TEST_TIMEOUT,
  tArb,
} from './property-helpers';

import {
  createEaseInBack,
  createEaseInOutBack,
  createEaseOutBack,
} from './back';
import {
  createEaseInElastic,
  createEaseInOutElastic,
  createEaseOutElastic,
} from './elastic';

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const strengthArb = fc.double({ min: 0, max: 10, noNaN: true });
const amplitudeArb = fc.double({ min: 0.5, max: 5, noNaN: true });
const periodArb = fc.double({ min: 0.05, max: 1.0, noNaN: true });

// ---------------------------------------------------------------------------
// Properties — all functions
// ---------------------------------------------------------------------------

describe(
  'classic easing property-based tests',
  {
    timeout: PROPERTY_TEST_TIMEOUT,
  },
  () => {
    describe('C0 continuity (no jumps)', () => {
      for (const [name, fn] of allFunctions) {
        it(name, () => {
          expect(checkContinuity(fn), `${name} has a discontinuity`).toBe(true);
        });
      }
    });

    // ---------------------------------------------------------------------------
    // Properties — back (fuzzed strength)
    // ---------------------------------------------------------------------------

    describe('back factories: C0 continuity for all strengths', () => {
      it('createEaseInBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            expect(checkContinuity(createEaseInBack({ strength }))).toBe(true);
          }),
          { numRuns: 200 },
        );
      });

      it('createEaseOutBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            expect(checkContinuity(createEaseOutBack({ strength }))).toBe(true);
          }),
          { numRuns: 200 },
        );
      });

      it('createEaseInOutBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            expect(checkContinuity(createEaseInOutBack({ strength }))).toBe(
              true,
            );
          }),
          { numRuns: 200 },
        );
      });
    });

    describe('back factories: InOut midpoint for all strengths', () => {
      it('createEaseInOutBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            expect(createEaseInOutBack({ strength })(0.5)).toBeCloseTo(0.5, 8);
          }),
          { numRuns: 500 },
        );
      });
    });

    // ---------------------------------------------------------------------------
    // Properties — elastic (fuzzed amplitude and period)
    // ---------------------------------------------------------------------------

    describe('elastic factories: boundary invariants for all params', () => {
      it('createEaseOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const fn = createEaseOutElastic({ amplitude, period });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const fn = createEaseInElastic({ amplitude, period });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const fn = createEaseInOutElastic({ amplitude, period });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });
    });

    describe('elastic factories: finite output for all params and t', () => {
      it('createEaseOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, tArb, (amplitude, period, t) => {
            expect(
              Number.isFinite(createEaseOutElastic({ amplitude, period })(t)),
            ).toBe(true);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, tArb, (amplitude, period, t) => {
            expect(
              Number.isFinite(createEaseInElastic({ amplitude, period })(t)),
            ).toBe(true);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, tArb, (amplitude, period, t) => {
            expect(
              Number.isFinite(createEaseInOutElastic({ amplitude, period })(t)),
            ).toBe(true);
          }),
          { numRuns: 500 },
        );
      });
    });

    describe('elastic factories: C0 continuity for all params', () => {
      it('createEaseOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const { steps, maxJump } = elasticContinuityParams(
              amplitude,
              period,
            );
            expect(
              checkContinuity(
                createEaseOutElastic({ amplitude, period }),
                steps,
                maxJump,
              ),
            ).toBe(true);
          }),
          { numRuns: 200 },
        );
      });

      it('createEaseInElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const { steps, maxJump } = elasticContinuityParams(
              amplitude,
              period,
            );
            expect(
              checkContinuity(
                createEaseInElastic({ amplitude, period }),
                steps,
                maxJump,
              ),
            ).toBe(true);
          }),
          { numRuns: 200 },
        );
      });

      it('createEaseInOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            const { steps, maxJump } = elasticContinuityParams(
              amplitude,
              period,
            );
            expect(
              checkContinuity(
                createEaseInOutElastic({ amplitude, period }),
                steps,
                maxJump,
              ),
            ).toBe(true);
          }),
          { numRuns: 200 },
        );
      });
    });

    describe('elastic factories: InOut midpoint for all params', () => {
      it('createEaseInOutElastic', () => {
        fc.assert(
          fc.property(amplitudeArb, periodArb, (amplitude, period) => {
            expect(
              createEaseInOutElastic({ amplitude, period })(0.5),
            ).toBeCloseTo(0.5, 8);
          }),
          { numRuns: 500 },
        );
      });
    });
  },
);
