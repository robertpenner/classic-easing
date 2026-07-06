import type { EasingFn } from './types';

export const easeInExpo: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.pow(2, 10 * (t - 1));
};

export const easeOutExpo: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -10 * t);
};

export const easeInOutExpo: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
  return 0.5 * (2 - Math.pow(2, -10 * (t - 1)));
};
