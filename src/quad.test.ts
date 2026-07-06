import { describe, expect, it } from 'vitest';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';

describe('easeInQuad', () => {
  it('returns 0 at t=0', () => expect(easeInQuad(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInQuad(1)).toBe(1));
  it('returns 0.25 at t=0.5 (t^2)', () =>
    expect(easeInQuad(0.5)).toBeCloseTo(0.25));
  it('is monotonically increasing', () => {
    for (let i = 1; i <= 100; i++) {
      expect(easeInQuad(i / 100)).toBeGreaterThanOrEqual(
        easeInQuad((i - 1) / 100),
      );
    }
  });
});

describe('easeOutQuad', () => {
  it('returns 0 at t=0', () => expect(easeOutQuad(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutQuad(1)).toBe(1));
  it('returns 0.75 at t=0.5', () => expect(easeOutQuad(0.5)).toBeCloseTo(0.75));
  it('is monotonically increasing', () => {
    for (let i = 1; i <= 100; i++) {
      expect(easeOutQuad(i / 100)).toBeGreaterThanOrEqual(
        easeOutQuad((i - 1) / 100),
      );
    }
  });
});

describe('easeInOutQuad', () => {
  it('returns 0 at t=0', () => expect(easeInOutQuad(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutQuad(1)).toBe(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutQuad(0.5)).toBeCloseTo(0.5));
  it('is monotonically increasing', () => {
    for (let i = 1; i <= 100; i++) {
      expect(easeInOutQuad(i / 100)).toBeGreaterThanOrEqual(
        easeInOutQuad((i - 1) / 100),
      );
    }
  });
});
