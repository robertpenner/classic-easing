import { describe, expect, it } from 'vitest';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';

describe('easeInQuint', () => {
  it('returns 0 at t=0', () => expect(easeInQuint(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInQuint(1)).toBe(1));
  it('returns 0.03125 at t=0.5 (t^5)', () =>
    expect(easeInQuint(0.5)).toBeCloseTo(0.03125));
});

describe('easeOutQuint', () => {
  it('returns 0 at t=0', () => expect(easeOutQuint(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutQuint(1)).toBe(1));
  it('returns 0.96875 at t=0.5', () =>
    expect(easeOutQuint(0.5)).toBeCloseTo(0.96875));
});

describe('easeInOutQuint', () => {
  it('returns 0 at t=0', () => expect(easeInOutQuint(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutQuint(1)).toBe(1));
  it('returns 0.5 at t=0.5', () =>
    expect(easeInOutQuint(0.5)).toBeCloseTo(0.5));
});
