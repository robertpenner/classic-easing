import type { EasingFn } from './types';

export const easeInCirc: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return -(Math.sqrt(1 - t * t) - 1);
};

export const easeOutCirc: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.sqrt(1 - --t * t);
};

export const easeInOutCirc: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
};
