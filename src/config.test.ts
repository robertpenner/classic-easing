import { describe, expect, it } from 'vitest';
import {
  createEaseInBack,
  createEaseOutBack,
  createEaseInOutBack,
  createEaseInElastic,
  createEaseOutElastic,
  createEaseInOutElastic,
} from './index';

describe.each([
  ['In', createEaseInElastic],
  ['Out', createEaseOutElastic],
  ['InOut', createEaseInOutElastic],
] as const)('Elastic %s configuration', (_name, factory) => {
  it.each([0, -0])('uses the variant default for period %s', period => {
    const actual = factory({ amplitude: 2, period });
    const expected = factory({ amplitude: 2 });
    for (const time of [0, 0.25, 0.5, 0.75, 1]) {
      expect(actual(time)).toBe(expected(time));
    }
  });

  it.each([-1, Number.MIN_VALUE, NaN, Infinity, -Infinity])(
    'rejects an unsupported period %s at construction',
    period => {
      expect(() => factory({ period })).toThrow(RangeError);
    },
  );

  it.each([NaN, Infinity, -Infinity])('rejects amplitude %s', amplitude => {
    expect(() => factory({ amplitude })).toThrow(RangeError);
  });

  it.each([-10, 0, 0.5])('clamps finite amplitude %s to one', amplitude => {
    const actual = factory({ amplitude });
    const expected = factory({ amplitude: 1 });
    for (const time of [0.25, 0.5, 0.75]) {
      expect(actual(time)).toBe(expected(time));
    }
  });

  it('supports a very long finite period without phase overflow', () => {
    const easing = factory({ period: Number.MAX_VALUE });
    for (const time of [0.25, 0.5, 0.75]) {
      expect(Number.isFinite(easing(time))).toBe(true);
    }
  });
});

describe.each([
  ['In', createEaseInBack],
  ['Out', createEaseOutBack],
  ['InOut', createEaseInOutBack],
] as const)('Back %s configuration', (_name, factory) => {
  it.each([NaN, Infinity, -Infinity])('rejects strength %s', strength => {
    expect(() => factory({ strength })).toThrow(RangeError);
  });

  it('preserves finite negative coefficients', () => {
    const easing = factory({ strength: -1 });
    expect(easing(0)).toBe(0);
    expect(easing(1)).toBe(1);
    expect(Number.isFinite(easing(0.25))).toBe(true);
  });
});

it('rejects Back InOut strength when its scaled coefficient overflows', () => {
  expect(() => createEaseInOutBack({ strength: Number.MAX_VALUE })).toThrow(
    RangeError,
  );
});
