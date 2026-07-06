import type { EasingFn } from './types';

// Bounce thresholds (B) and offsets (O) for the four parabolic segments
const B1 = 1 / 2.75;
const B2 = 2 / 2.75;
const B3 = 2.5 / 2.75;
const O1 = 1.5 / 2.75;
const O2 = 2.25 / 2.75;
const O3 = 2.625 / 2.75;

export const easeOutBounce: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < B1) {
    return 7.5625 * t * t;
  } else if (t < B2) {
    return 7.5625 * (t -= O1) * t + 0.75;
  } else if (t < B3) {
    return 7.5625 * (t -= O2) * t + 0.9375;
  } else {
    return 7.5625 * (t -= O3) * t + 0.984375;
  }
};

export const easeInBounce: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - easeOutBounce(1 - t);
};

export const easeInOutBounce: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < 0.5) return easeInBounce(t * 2) * 0.5;
  return easeOutBounce(t * 2 - 1) * 0.5 + 0.5;
};
