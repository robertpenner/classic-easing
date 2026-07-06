import type { EasingFn } from './types';

export const easeInQuad: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t;
};

export const easeOutQuad: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * (2 - t);
};

export const easeInOutQuad: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if ((t *= 2) < 1) return 0.5 * t * t;
  return -0.5 * (--t * (t - 2) - 1);
};
