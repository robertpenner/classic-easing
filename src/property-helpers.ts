import fc from 'fast-check';
import type { EasingFn } from './types';

/** Arbitrary for normalized time t ∈ [0, 1]. */
export const tArb = fc.double({ min: 0, max: 1, noNaN: true });

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
