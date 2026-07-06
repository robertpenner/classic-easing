/**
 * Property-based tests for all classic easing functions.
 *
 * Uses fast-check to fuzz over the t ∈ [0, 1] domain and (for back/elastic)
 * over configurable parameters, verifying invariants that all easing functions
 * must satisfy.
 */

import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  checkContinuity,
  elasticContinuityParams,
  PROPERTY_TEST_TIMEOUT,
  tArb,
  tReflectionArb,
} from './property-helpers';
import type { EasingFn } from './types';

// ---------------------------------------------------------------------------
// Imports — all easing functions
// ---------------------------------------------------------------------------

import {
  createEaseInBack,
  createEaseInOutBack,
  createEaseOutBack,
  easeInBack,
  easeInOutBack,
  easeOutBack,
} from './back';
import { easeInBounce, easeInOutBounce, easeOutBounce } from './bounce';
import { easeInCirc, easeInOutCirc, easeOutCirc } from './circ';
import { easeInCubic, easeInOutCubic, easeOutCubic } from './cubic';
import {
  createEaseInElastic,
  createEaseInOutElastic,
  createEaseOutElastic,
  easeInElastic,
  easeInOutElastic,
  easeOutElastic,
} from './elastic';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';
import { linear } from './linear';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';

// ---------------------------------------------------------------------------
// Table definitions
// ---------------------------------------------------------------------------

/** Monotonic easing families: output stays in [0, 1] and is non-decreasing. */
const monotonicFamilies: [string, EasingFn, EasingFn, EasingFn][] = [
  ['Quad', easeInQuad, easeOutQuad, easeInOutQuad],
  ['Cubic', easeInCubic, easeOutCubic, easeInOutCubic],
  ['Quart', easeInQuart, easeOutQuart, easeInOutQuart],
  ['Quint', easeInQuint, easeOutQuint, easeInOutQuint],
  ['Sine', easeInSine, easeOutSine, easeInOutSine],
  ['Expo', easeInExpo, easeOutExpo, easeInOutExpo],
  ['Circ', easeInCirc, easeOutCirc, easeInOutCirc],
];

/** All easing triplets (including non-monotonic). */
const allFamilies: [string, EasingFn, EasingFn, EasingFn][] = [
  ...monotonicFamilies,
  ['Bounce', easeInBounce, easeOutBounce, easeInOutBounce],
  ['Back', easeInBack, easeOutBack, easeInOutBack],
  ['Elastic', easeInElastic, easeOutElastic, easeInOutElastic],
];

/** All individual easing functions with names for error messages. */
const allFunctions: [string, EasingFn][] = [
  ['linear', linear],
  ...allFamilies.flatMap(
    ([name, easeIn, easeOut, easeInOut]) =>
      [
        [`easeIn${name}`, easeIn],
        [`easeOut${name}`, easeOut],
        [`easeInOut${name}`, easeInOut],
      ] as [string, EasingFn][],
  ),
];

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
    describe('boundary invariants: f(0) = 0 and f(1) = 1', () => {
      for (const [name, fn] of allFunctions) {
        it(name, () => {
          expect(fn(0)).toBe(0);
          expect(fn(1)).toBe(1);
        });
      }
    });

    describe('C0 continuity (no jumps)', () => {
      for (const [name, fn] of allFunctions) {
        it(name, () => {
          expect(checkContinuity(fn), `${name} has a discontinuity`).toBe(true);
        });
      }
    });

    describe('In/Out reflection: easeIn(t) ≈ 1 - easeOut(1 - t)', () => {
      for (const [name, easeIn, easeOut] of allFamilies) {
        it(name, () => {
          fc.assert(
            fc.property(tReflectionArb, t => {
              expect(easeIn(t)).toBeCloseTo(1 - easeOut(1 - t), 8);
            }),
            { numRuns: 500 },
          );
        });
      }
    });

    describe('InOut midpoint: f(0.5) ≈ 0.5', () => {
      for (const [name, , , easeInOut] of allFamilies) {
        it(name, () => {
          expect(easeInOut(0.5)).toBeCloseTo(0.5, 8);
        });
      }
    });

    // ---------------------------------------------------------------------------
    // Properties — monotonic group
    // ---------------------------------------------------------------------------

    describe('monotonic group: output ∈ [0, 1]', () => {
      for (const [name, easeIn, easeOut, easeInOut] of monotonicFamilies) {
        it(name, () => {
          const variants: readonly [string, EasingFn][] = [
            ['In', easeIn],
            ['Out', easeOut],
            ['InOut', easeInOut],
          ];
          fc.assert(
            fc.property(tArb, t => {
              for (const [, fn] of variants) {
                const v = fn(t);
                if (v < 0 || v > 1) return false;
              }
              return true;
            }),
            { numRuns: 500 },
          );
        });
      }
    });

    describe('monotonic group: non-decreasing', () => {
      for (const [name, easeIn, easeOut, easeInOut] of monotonicFamilies) {
        for (const [variant, fn] of [
          ['In', easeIn],
          ['Out', easeOut],
          ['InOut', easeInOut],
        ] as [string, EasingFn][]) {
          it(`easeIn${variant}${name}`, () => {
            fc.assert(
              fc.property(
                tArb,
                fc.double({ min: 0, max: 0.01, noNaN: true }),
                (t, delta) => {
                  const t2 = Math.min(t + delta, 1);
                  expect(fn(t2)).toBeGreaterThanOrEqual(fn(t) - 1e-10);
                },
              ),
              { numRuns: 500 },
            );
          });
        }
      }
    });

    // ---------------------------------------------------------------------------
    // Properties — bounce (bounded [0, 1] but non-monotonic)
    // ---------------------------------------------------------------------------

    describe('bounce: output ∈ [0, 1]', () => {
      for (const [name, fn] of [
        ['easeInBounce', easeInBounce],
        ['easeOutBounce', easeOutBounce],
        ['easeInOutBounce', easeInOutBounce],
      ] as [string, EasingFn][]) {
        it(name, () => {
          fc.assert(
            fc.property(tArb, t => {
              const v = fn(t);
              return v >= 0 && v <= 1;
            }),
            { numRuns: 500 },
          );
        });
      }
    });

    // ---------------------------------------------------------------------------
    // Properties — back (fuzzed strength)
    // ---------------------------------------------------------------------------

    describe('back factories: boundary invariants for all strengths', () => {
      it('createEaseInBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            const fn = createEaseInBack({ strength });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseOutBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            const fn = createEaseOutBack({ strength });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInOutBack', () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            const fn = createEaseInOutBack({ strength });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          { numRuns: 500 },
        );
      });
    });

    describe('back factories: finite output for all strengths and t', () => {
      it('createEaseInBack', () => {
        fc.assert(
          fc.property(strengthArb, tArb, (strength, t) => {
            expect(Number.isFinite(createEaseInBack({ strength })(t))).toBe(
              true,
            );
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseOutBack', () => {
        fc.assert(
          fc.property(strengthArb, tArb, (strength, t) => {
            expect(Number.isFinite(createEaseOutBack({ strength })(t))).toBe(
              true,
            );
          }),
          { numRuns: 500 },
        );
      });

      it('createEaseInOutBack', () => {
        fc.assert(
          fc.property(strengthArb, tArb, (strength, t) => {
            expect(Number.isFinite(createEaseInOutBack({ strength })(t))).toBe(
              true,
            );
          }),
          { numRuns: 500 },
        );
      });
    });

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
