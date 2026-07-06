import type { EasingFn, ElasticEasingFactory } from './types';

/**
 * Create an elastic ease-out function.
 *
 * @param amplitude - Peak overshoot magnitude (clamped to min 1). Default: 1
 * @param period - Duration of one oscillation cycle. Default: 0.3
 */
export const createEaseOutElastic: ElasticEasingFactory = ({
  amplitude = 1,
  period = 0.3,
} = {}) => {
  const TWO_PI = 2 * Math.PI;

  let s: number;
  if (amplitude < 1) {
    amplitude = 1;
    s = period / 4;
  } else {
    s = (period / TWO_PI) * Math.asin(1 / amplitude);
  }
  return t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return (
      amplitude * Math.pow(2, -10 * t) * Math.sin(((t - s) * TWO_PI) / period) +
      1
    );
  };
};

/**
 * Create an elastic ease-in function.
 *
 * @param amplitude - Peak overshoot magnitude (clamped to min 1). Default: 1
 * @param period - Duration of one oscillation cycle. Default: 0.3
 */
export const createEaseInElastic: ElasticEasingFactory = (config = {}) => {
  const out = createEaseOutElastic(config);
  return t => 1 - out(1 - t);
};

/**
 * Create an elastic ease-in-out function.
 *
 * @param amplitude - Peak overshoot magnitude (clamped to min 1). Default: 1
 * @param period - Duration of one oscillation cycle. Default: 0.45
 */
export const createEaseInOutElastic: ElasticEasingFactory = ({
  amplitude,
  period = 0.45,
} = {}) => {
  const inFn = createEaseInElastic({ amplitude, period });
  const outFn = createEaseOutElastic({ amplitude, period });
  return t => {
    if (t < 0.5) return inFn(t * 2) * 0.5;
    return outFn(t * 2 - 1) * 0.5 + 0.5;
  };
};

/** Elastic ease-out with default parameters (amplitude=1, period=0.3). */
export const easeOutElastic: EasingFn = createEaseOutElastic();

/** Elastic ease-in with default parameters (amplitude=1, period=0.3). */
export const easeInElastic: EasingFn = createEaseInElastic();

/** Elastic ease-in-out with default parameters (amplitude=1, period=0.45). */
export const easeInOutElastic: EasingFn = createEaseInOutElastic();
