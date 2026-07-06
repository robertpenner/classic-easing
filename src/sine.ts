import type { EasingFn } from './types';

const HALF_PI = Math.PI / 2;

export const easeInSine: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.cos(t * HALF_PI);
};

export const easeOutSine: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return Math.sin(t * HALF_PI);
};

export const easeInOutSine: EasingFn = t => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return -0.5 * (Math.cos(Math.PI * t) - 1);
};
