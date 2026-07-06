import { describe, expect, it } from 'vitest';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';

describe('easeInQuart', () => {
  it('returns 0 at t=0', () => expect(easeInQuart(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInQuart(1)).toBe(1));
  it('returns 0.0625 at t=0.5 (t^4)', () =>
    expect(easeInQuart(0.5)).toBeCloseTo(0.0625));
});

describe('easeOutQuart', () => {
  it('returns 0 at t=0', () => expect(easeOutQuart(0)).toBeCloseTo(0));
  it('returns 1 at t=1', () => expect(easeOutQuart(1)).toBe(1));
  it('returns 0.9375 at t=0.5', () =>
    expect(easeOutQuart(0.5)).toBeCloseTo(0.9375));
});

describe('easeInOutQuart', () => {
  it('returns 0 at t=0', () => expect(easeInOutQuart(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutQuart(1)).toBe(1));
  it('returns 0.5 at t=0.5', () =>
    expect(easeInOutQuart(0.5)).toBeCloseTo(0.5));
});
