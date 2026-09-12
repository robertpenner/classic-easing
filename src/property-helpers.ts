import fc from 'fast-check';
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
import { easeInElastic, easeInOutElastic, easeOutElastic } from './elastic';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';
import { linear } from './linear';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';
import type { EasingFn } from './types';

/** Arbitrary for normalized time t ∈ [0, 1]. */
export const tArb = fc.double({ min: 0, max: 1, noNaN: true });

/**
 * Runs for the law tier (`*.law.test.ts`), which is inside the merge gate.
 *
 * 30 runs will not find a subtle counter-example, and is not meant to: deep
 * search is the nightly exploration tier's job. What this buys is that a law
 * broken for *most* inputs — the usual shape of a refactor regression — fails
 * in the same commit, with a shrunk counter-example instead of a mysterious
 * downstream break. `PBT_DEPTH=deep` re-runs the same laws at nightly depth.
 */
export const LAW_NUM_RUNS = process.env.PBT_DEPTH === 'deep' ? 1000 : 30;

/**
 * Arbitrary for t values where the reflection identity easeIn(t) = 1 - easeOut(1 - t)
 * is numerically stable. Values smaller than ~1e-15 cause 1-t to round to 1.
 */
export const tReflectionArb = fc.double({
  min: 1e-14,
  max: 1 - 1e-14,
  noNaN: true,
});

/** Timeout (ms) for property tests with heavy iteration. */
export const PROPERTY_TEST_TIMEOUT = 15_000;

/**
 * Check C0 continuity: for adjacent samples, the jump between
 * consecutive values should be small relative to the step size.
 */
export function checkContinuity(
  fn: EasingFn,
  steps = 1000,
  maxJump = 0.05,
): boolean {
  let prev = fn(0);
  for (let i = 1; i <= steps; i++) {
    const curr = fn(i / steps);
    if (Math.abs(curr - prev) > maxJump) return false;
    prev = curr;
  }
  return true;
}

/**
 * Compute adaptive continuity parameters for elastic functions
 * based on the oscillation amplitude and period.
 */
export function elasticContinuityParams(amplitude: number, period: number) {
  // Ensure at least 100 samples per oscillation period
  const steps = Math.max(1000, Math.ceil(200 / period));
  // Max derivative of A * sin(2π t / P) is A * 2π / P;
  // max step change ≈ maxDerivative * stepSize, with 2x safety margin
  const stepSize = 1 / steps;
  const maxJump = Math.max(
    0.05,
    ((amplitude * 2 * Math.PI) / period) * stepSize * 2,
  );
  return { steps, maxJump };
}

// ---------------------------------------------------------------------------
// Family tables — shared by the law tier and the exploration tier so both
// describe the same set of functions.
// ---------------------------------------------------------------------------

/** Monotonic easing families: output stays in [0, 1] and is non-decreasing. */
export const monotonicFamilies: [string, EasingFn, EasingFn, EasingFn][] = [
  ['Quad', easeInQuad, easeOutQuad, easeInOutQuad],
  ['Cubic', easeInCubic, easeOutCubic, easeInOutCubic],
  ['Quart', easeInQuart, easeOutQuart, easeInOutQuart],
  ['Quint', easeInQuint, easeOutQuint, easeInOutQuint],
  ['Sine', easeInSine, easeOutSine, easeInOutSine],
  ['Expo', easeInExpo, easeOutExpo, easeInOutExpo],
  ['Circ', easeInCirc, easeOutCirc, easeInOutCirc],
];

/** All easing triplets (including non-monotonic). */
export const allFamilies: [string, EasingFn, EasingFn, EasingFn][] = [
  ...monotonicFamilies,
  ['Bounce', easeInBounce, easeOutBounce, easeInOutBounce],
  ['Back', easeInBack, easeOutBack, easeInOutBack],
  ['Elastic', easeInElastic, easeOutElastic, easeInOutElastic],
];

/** All individual easing functions with names for error messages. */
export const allFunctions: [string, EasingFn][] = [
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

/** Back factories, for laws that hold across the strength parameter. */
export const backFactories = [
  ['createEaseInBack', createEaseInBack],
  ['createEaseOutBack', createEaseOutBack],
  ['createEaseInOutBack', createEaseInOutBack],
] as const;
