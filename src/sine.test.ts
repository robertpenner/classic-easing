import { describe, expect, it } from 'vitest';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';

describe('easeInSine', () => {
  it('returns 0 at t=0', () => expect(easeInSine(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInSine(1)).toBeCloseTo(1));
  it('returns ~0.293 at t=0.5', () =>
    expect(easeInSine(0.5)).toBeCloseTo(1 - Math.cos(Math.PI / 4)));
});

describe('easeOutSine', () => {
  it('returns 0 at t=0', () => expect(easeOutSine(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutSine(1)).toBeCloseTo(1));
  it('returns ~0.707 at t=0.5', () =>
    expect(easeOutSine(0.5)).toBeCloseTo(Math.sin(Math.PI / 4)));
});

describe('easeInOutSine', () => {
  it('returns 0 at t=0', () => expect(easeInOutSine(0)).toBeCloseTo(0));
  it('returns 1 at t=1', () => expect(easeInOutSine(1)).toBeCloseTo(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutSine(0.5)).toBeCloseTo(0.5));
});
