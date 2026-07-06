import type { BackEasingFactory, EasingFn } from './types';

const TEN_PERCENT_OVERSHOOT = 1.70158;

export const createEaseInBack: BackEasingFactory =
  ({ strength = TEN_PERCENT_OVERSHOOT } = {}) =>
  t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t * t * ((strength + 1) * t - strength);
  };

export const createEaseOutBack: BackEasingFactory =
  ({ strength = TEN_PERCENT_OVERSHOOT } = {}) =>
  t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return --t * t * ((strength + 1) * t + strength) + 1;
  };

export const createEaseInOutBack: BackEasingFactory = ({
  strength = TEN_PERCENT_OVERSHOOT,
} = {}) => {
  // Scale the strength up so the in-out curve has the same overshoot as the in or out curves.
  // Otherwise the standard in-out construction would halve the overshoot.
  const strengthInOut = strength * 1.525;
  return t => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    if ((t *= 2) < 1)
      return 0.5 * (t * t * ((strengthInOut + 1) * t - strengthInOut));
    return 0.5 * ((t -= 2) * t * ((strengthInOut + 1) * t + strengthInOut) + 2);
  };
};

export const easeInBack: EasingFn = createEaseInBack();
export const easeOutBack: EasingFn = createEaseOutBack();
export const easeInOutBack: EasingFn = createEaseInOutBack();
