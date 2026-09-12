import type { EasingFn, ElasticConfig, ElasticEasingFactory } from './types';

function elasticParameters({ amplitude = 1, period = 0.3 }: ElasticConfig) {
  if (!Number.isFinite(amplitude)) {
    throw new RangeError('Elastic amplitude must be finite.');
  }
  if (period === 0) period = 0.3;
  const frequency = (2 * Math.PI) / period;
  if (!Number.isFinite(period) || period < 0 || !Number.isFinite(frequency)) {
    throw new RangeError(
      'Elastic period must be positive with a finite angular frequency, or zero for the default.',
    );
  }
  amplitude = Math.max(1, amplitude);
  return { amplitude, frequency, phase: Math.asin(1 / amplitude) };
}

/**
 * Create an elastic ease-out function.
 *
 * @param amplitude - Peak overshoot magnitude (clamped to min 1). Default: 1
 * @param period - Duration of one oscillation cycle. Default: 0.3
 */
export const createEaseOutElastic: ElasticEasingFactory = (config = {}) => {
  const { amplitude, frequency, phase } = elasticParameters(config);
  return t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return (
      amplitude * Math.pow(2, -10 * t) * Math.sin(t * frequency - phase) + 1
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
  const { amplitude, frequency, phase } = elasticParameters(config);
  return time => {
    if (time <= 0) return 0;
    if (time >= 1) return 1;
    const shiftedTime = time - 1;
    return -(
      amplitude *
      Math.pow(2, 10 * shiftedTime) *
      Math.sin(shiftedTime * frequency - phase)
    );
  };
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
  if (period === 0) period = 0.45;
  const inFn = createEaseInElastic({ amplitude, period });
  const outFn = createEaseOutElastic({ amplitude, period });
  return t => {
    if (t < 0.5) return inFn(t * 2) * 0.5;
    return outFn(t * 2 - 1) * 0.5 + 0.5;
  };
};

/** Elastic ease-out with default parameters (amplitude=1, period=0.3). */
export const easeOutElastic: EasingFn = /* @__PURE__ */ createEaseOutElastic();

/** Elastic ease-in with default parameters (amplitude=1, period=0.3). */
export const easeInElastic: EasingFn = /* @__PURE__ */ createEaseInElastic();

/** Elastic ease-in-out with default parameters (amplitude=1, period=0.45). */
export const easeInOutElastic: EasingFn =
  /* @__PURE__ */ createEaseInOutElastic();
