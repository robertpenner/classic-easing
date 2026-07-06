import { describe, expect, it } from 'vitest';
import {
  createEaseInBack,
  createEaseInOutBack,
  createEaseInOutElastic,
  createEaseInElastic,
  createEaseOutBack,
  createEaseOutElastic,
  easeInBack,
  easeInBounce,
  easeInCirc,
  easeInCubic,
  easeInElastic,
  easeInExpo,
  easeInOutBack,
  easeInOutBounce,
  easeInOutCirc,
  easeInOutCubic,
  easeInOutElastic,
  easeInOutExpo,
  easeInOutQuad,
  easeInOutQuart,
  easeInOutQuint,
  easeInOutSine,
  easeInQuad,
  easeInQuart,
  easeInQuint,
  easeInSine,
  easeOutBack,
  easeOutBounce,
  easeOutCirc,
  easeOutCubic,
  easeOutElastic,
  easeOutExpo,
  easeOutQuad,
  easeOutQuart,
  easeOutQuint,
  easeOutSine,
  linear,
} from './index';
import type { EasingFn } from './types';

// All 31 ready-to-use easing functions (linear + 30 classics).
const named: readonly [string, EasingFn][] = [
  ['linear', linear],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInQuint', easeInQuint],
  ['easeOutQuint', easeOutQuint],
  ['easeInOutQuint', easeInOutQuint],
  ['easeInSine', easeInSine],
  ['easeOutSine', easeOutSine],
  ['easeInOutSine', easeInOutSine],
  ['easeInExpo', easeInExpo],
  ['easeOutExpo', easeOutExpo],
  ['easeInOutExpo', easeInOutExpo],
  ['easeInCirc', easeInCirc],
  ['easeOutCirc', easeOutCirc],
  ['easeInOutCirc', easeInOutCirc],
  ['easeInBack', easeInBack],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeInBounce', easeInBounce],
  ['easeOutBounce', easeOutBounce],
  ['easeInOutBounce', easeInOutBounce],
  ['easeInElastic', easeInElastic],
  ['easeOutElastic', easeOutElastic],
  ['easeInOutElastic', easeInOutElastic],
];

// Factory outputs with NON-default configs — clamping must be config-independent.
const factories: readonly [string, EasingFn][] = [
  ['createEaseInBack({strength:3})', createEaseInBack({ strength: 3 })],
  ['createEaseOutBack({strength:3})', createEaseOutBack({ strength: 3 })],
  ['createEaseInOutBack({strength:3})', createEaseInOutBack({ strength: 3 })],
  [
    'createEaseInElastic({amplitude:2,period:0.5})',
    createEaseInElastic({ amplitude: 2, period: 0.5 }),
  ],
  [
    'createEaseOutElastic({amplitude:2,period:0.5})',
    createEaseOutElastic({ amplitude: 2, period: 0.5 }),
  ],
  [
    'createEaseInOutElastic({amplitude:2,period:0.5})',
    createEaseInOutElastic({ amplitude: 2, period: 0.5 }),
  ],
];

const allFns: readonly [string, EasingFn][] = [...named, ...factories];

const belowDomain = [-0.5, -1, -1e9, Number.NEGATIVE_INFINITY];
const aboveDomain = [1.5, 2, 1e9, Number.POSITIVE_INFINITY];

describe('input-domain clamping contract', () => {
  describe('clamps t <= 0 to exactly 0', () => {
    for (const [name, fn] of allFns) {
      it(name, () => {
        for (const t of belowDomain) {
          expect(fn(t), `${name}(${t})`).toBe(0);
        }
        expect(fn(0), `${name}(0)`).toBe(0);
      });
    }
  });

  describe('clamps t >= 1 to exactly 1', () => {
    for (const [name, fn] of allFns) {
      it(name, () => {
        for (const t of aboveDomain) {
          expect(fn(t), `${name}(${t})`).toBe(1);
        }
        expect(fn(1), `${name}(1)`).toBe(1);
      });
    }
  });

  describe('propagates NaN (characterization)', () => {
    for (const [name, fn] of allFns) {
      it(name, () => {
        expect(Number.isNaN(fn(Number.NaN)), `${name}(NaN)`).toBe(true);
      });
    }
  });
});
