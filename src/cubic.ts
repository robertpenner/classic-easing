import type { EasingFn } from './types';

export const easeInCubic: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * t;
};

export const easeOutCubic: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return --t * t * t + 1;
};

export const easeInOutCubic: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if ((t *= 2) < 1) return 0.5 * t * t * t;
  return 0.5 * ((t -= 2) * t * t + 2);
};
