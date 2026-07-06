import { describe, expect, it } from 'vitest';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';

describe('easeInExpo', () => {
  it('returns 0 at t=0', () => expect(easeInExpo(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInExpo(1)).toBe(1));
  it('returns a value near 0 for small t', () => {
    expect(easeInExpo(0.1)).toBeGreaterThan(0);
    expect(easeInExpo(0.1)).toBeLessThan(0.01);
  });
});

describe('easeOutExpo', () => {
  it('returns 0 at t=0', () => expect(easeOutExpo(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutExpo(1)).toBe(1));
  it('returns a value near 1 for large t', () => {
    expect(easeOutExpo(0.9)).toBeGreaterThan(0.99);
  });
});

describe('easeInOutExpo', () => {
  it('returns 0 at t=0', () => expect(easeInOutExpo(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutExpo(1)).toBe(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutExpo(0.5)).toBeCloseTo(0.5));
});
