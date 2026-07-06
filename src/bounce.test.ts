import { describe, expect, it } from 'vitest';
import { easeInBounce, easeInOutBounce, easeOutBounce } from './bounce';

describe('easeOutBounce', () => {
  it('returns 0 at t=0', () => expect(easeOutBounce(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutBounce(1)).toBe(1));
  it('stays within [0, 1]', () => {
    for (let i = 0; i <= 100; i++) {
      const v = easeOutBounce(i / 100);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe('easeInBounce', () => {
  it('returns 0 at t=0', () => expect(easeInBounce(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInBounce(1)).toBe(1));
  it('is the reverse of easeOutBounce', () => {
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      expect(easeInBounce(t)).toBeCloseTo(1 - easeOutBounce(1 - t));
    }
  });
});

describe('easeInOutBounce', () => {
  it('returns 0 at t=0', () => expect(easeInOutBounce(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutBounce(1)).toBe(1));
  it('returns 0.5 at t=0.5', () =>
    expect(easeInOutBounce(0.5)).toBeCloseTo(0.5));
});
