import { describe, expect, it } from 'vitest';
import { easeInCirc, easeInOutCirc, easeOutCirc } from './circ';

describe('easeInCirc', () => {
  it('returns 0 at t=0', () => expect(easeInCirc(0)).toBeCloseTo(0));
  it('returns 1 at t=1', () => expect(easeInCirc(1)).toBeCloseTo(1));
  it('returns ~0.134 at t=0.5', () =>
    expect(easeInCirc(0.5)).toBeCloseTo(1 - Math.sqrt(0.75)));
});

describe('easeOutCirc', () => {
  it('returns 0 at t=0', () => expect(easeOutCirc(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutCirc(1)).toBe(1));
  it('returns ~0.866 at t=0.5', () =>
    expect(easeOutCirc(0.5)).toBeCloseTo(Math.sqrt(0.75)));
});

describe('easeInOutCirc', () => {
  it('returns 0 at t=0', () => expect(easeInOutCirc(0)).toBeCloseTo(0));
  it('returns 1 at t=1', () => expect(easeInOutCirc(1)).toBeCloseTo(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutCirc(0.5)).toBeCloseTo(0.5));
});
