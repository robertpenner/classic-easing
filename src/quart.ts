import type { EasingFn } from './types';

export const easeInQuart: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * t * t;
};

export const easeOutQuart: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return -(--t * t * t * t - 1);
};

export const easeInOutQuart: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if ((t *= 2) < 1) return 0.5 * t * t * t * t;
  return -0.5 * ((t -= 2) * t * t * t - 2);
};
