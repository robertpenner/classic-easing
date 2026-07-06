import { describe, expect, it } from 'vitest';
import { easeInCubic, easeInOutCubic, easeOutCubic } from './cubic';

describe('easeInCubic', () => {
  it('returns 0 at t=0', () => expect(easeInCubic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInCubic(1)).toBe(1));
  it('returns 0.125 at t=0.5 (t^3)', () =>
    expect(easeInCubic(0.5)).toBeCloseTo(0.125));
});

describe('easeOutCubic', () => {
  it('returns 0 at t=0', () => expect(easeOutCubic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutCubic(1)).toBe(1));
  it('returns 0.875 at t=0.5', () =>
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875));
});

describe('easeInOutCubic', () => {
  it('returns 0 at t=0', () => expect(easeInOutCubic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutCubic(1)).toBe(1));
  it('returns 0.5 at t=0.5', () =>
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5));
});
