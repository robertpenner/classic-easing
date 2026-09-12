/**
 * Law tier for the classic easings — the merge-gate half of the property
 * strategy (#2017).
 *
 * A property earns a place here only if all four hold:
 *
 *   1. It is a *total* law: true for every input in the generator's range with
 *      no tuned tolerance. Boundary conditions, range containment, round-trip
 *      and reflection identities qualify. Convergence rates, numerical
 *      continuity estimates and "adjacent samples differ by less than X" do
 *      not, and stay in `easing.property.test.ts`.
 *   2. It has never flaked.
 *   3. It costs under 50 ms at `LAW_NUM_RUNS`.
 *   4. Its generator is cheap and pure — no jsdom, no actor, no worker.
 *
 * `PBT_DEPTH=deep` re-runs the same file at 1000 runs for the nightly job.
 */
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  allFamilies,
  allFunctions,
  backFactories,
  LAW_NUM_RUNS,
  monotonicFamilies,
  tArb,
  tReflectionArb,
} from './property-helpers';
import type { EasingFn } from './types';

const strengthArb = fc.double({ min: 0, max: 10, noNaN: true });
const timeLandmarks: [number][] = [[0], [0.5], [1]];
const orderedTimeLandmarks: [number, number][] = [
  [0, 0.01],
  [0.5, 0.01],
  [1, 0],
];
const strengthLandmarks: [number][] = [[0], [1], [10]];
const strengthTimeLandmarks: [number, number][] = [
  [0, 0],
  [1, 0.5],
  [10, 1],
];

describe('classic easing laws', () => {
  describe('endpoints: f(0) = 0 and f(1) = 1', () => {
    for (const [name, fn] of allFunctions) {
      it(name, () => {
        expect(fn(0)).toBe(0);
        expect(fn(1)).toBe(1);
      });
    }
  });

  describe('inOut midpoint: f(0.5) ≈ 0.5', () => {
    for (const [name, , , easeInOut] of allFamilies) {
      it(name, () => {
        expect(easeInOut(0.5)).toBeCloseTo(0.5, 8);
      });
    }
  });

  describe('reflection: easeIn(t) ≈ 1 − easeOut(1 − t)', () => {
    for (const [name, easeIn, easeOut] of allFamilies) {
      it(name, () => {
        fc.assert(
          fc.property(tReflectionArb, t => {
            expect(easeIn(t)).toBeCloseTo(1 - easeOut(1 - t), 8);
          }),
          {
            examples: timeLandmarks,
            numRuns: LAW_NUM_RUNS + timeLandmarks.length,
          },
        );
      });
    }
  });

  describe('monotonic families stay within [0, 1]', () => {
    for (const [name, easeIn, easeOut, easeInOut] of monotonicFamilies) {
      it(name, () => {
        const variants: readonly EasingFn[] = [easeIn, easeOut, easeInOut];
        fc.assert(
          fc.property(tArb, t =>
            variants.every(fn => {
              const value = fn(t);
              return value >= 0 && value <= 1;
            }),
          ),
          {
            examples: timeLandmarks,
            numRuns: LAW_NUM_RUNS + timeLandmarks.length,
          },
        );
      });
    }
  });

  describe('monotonic families are non-decreasing', () => {
    for (const [name, easeIn, easeOut, easeInOut] of monotonicFamilies) {
      for (const [variant, fn] of [
        ['In', easeIn],
        ['Out', easeOut],
        ['InOut', easeInOut],
      ] as [string, EasingFn][]) {
        it(`ease${variant}${name}`, () => {
          fc.assert(
            fc.property(
              tArb,
              fc.double({ min: 0, max: 0.01, noNaN: true }),
              (t, delta) => {
                const next = Math.min(t + delta, 1);
                expect(fn(next)).toBeGreaterThanOrEqual(fn(t) - 1e-10);
              },
            ),
            {
              examples: orderedTimeLandmarks,
              numRuns: LAW_NUM_RUNS + orderedTimeLandmarks.length,
            },
          );
        });
      }
    }
  });

  describe('bounce stays within [0, 1]', () => {
    for (const [name, fn] of allFunctions.filter(([label]) =>
      label.endsWith('Bounce'),
    )) {
      it(name, () => {
        fc.assert(
          fc.property(tArb, t => {
            const value = fn(t);
            return value >= 0 && value <= 1;
          }),
          {
            examples: timeLandmarks,
            numRuns: LAW_NUM_RUNS + timeLandmarks.length,
          },
        );
      });
    }
  });

  describe('back factories keep the endpoints for every strength', () => {
    for (const [name, factory] of backFactories) {
      it(name, () => {
        fc.assert(
          fc.property(strengthArb, strength => {
            const fn = factory({ strength });
            expect(fn(0)).toBe(0);
            expect(fn(1)).toBe(1);
          }),
          {
            examples: strengthLandmarks,
            numRuns: LAW_NUM_RUNS + strengthLandmarks.length,
          },
        );
      });
    }
  });

  describe('back factories stay finite for every strength and t', () => {
    for (const [name, factory] of backFactories) {
      it(name, () => {
        fc.assert(
          fc.property(strengthArb, tArb, (strength, t) =>
            Number.isFinite(factory({ strength })(t)),
          ),
          {
            examples: strengthTimeLandmarks,
            numRuns: LAW_NUM_RUNS + strengthTimeLandmarks.length,
          },
        );
      });
    }
  });
});
