import { describe, expect, it } from 'vitest';
import {
  createEaseInBack,
  createEaseInOutBack,
  createEaseOutBack,
  easeInBack,
  easeInOutBack,
  easeOutBack,
} from './back';

describe('easeInBack', () => {
  it('returns 0 at t=0', () => expect(easeInBack(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInBack(1)).toBe(1));
  it('goes below 0 (backtracking)', () => {
    const values = Array.from({ length: 100 }, (_, i) => easeInBack(i / 100));
    expect(values.some(v => v < 0)).toBe(true);
  });
  it('default strength produces ~10% backtrack', () => {
    const values = Array.from({ length: 1000 }, (_, i) => easeInBack(i / 1000));
    const overshoot = -Math.min(...values);
    expect(overshoot).toBeCloseTo(0.1, 1);
  });
});

describe('easeOutBack', () => {
  it('returns 0 at t=0', () => expect(easeOutBack(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutBack(1)).toBe(1));
  it('exceeds 1 (overshoot)', () => {
    const values = Array.from({ length: 100 }, (_, i) => easeOutBack(i / 100));
    expect(values.some(v => v > 1)).toBe(true);
  });
  it('default strength produces ~10% overshoot', () => {
    const values = Array.from({ length: 1000 }, (_, i) =>
      easeOutBack(i / 1000),
    );
    const overshoot = Math.max(...values) - 1;
    expect(overshoot).toBeCloseTo(0.1, 1);
  });
});

describe('easeInOutBack', () => {
  it('returns 0 at t=0', () => expect(easeInOutBack(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutBack(1)).toBe(1));
  it('returns 0.5 at t=0.5', () => expect(easeInOutBack(0.5)).toBeCloseTo(0.5));
  it('default strength produces ~10% backtrack and ~10% overshoot', () => {
    const values = Array.from({ length: 1000 }, (_, i) =>
      easeInOutBack(i / 1000),
    );
    const backtrack = -Math.min(...values);
    const overshoot = Math.max(...values) - 1;
    expect(backtrack).toBeCloseTo(0.1, 1);
    expect(overshoot).toBeCloseTo(0.1, 1);
  });
});

describe('createEaseInBack', () => {
  it('with strength=0 produces cubic easing (no overshoot)', () => {
    const cubicIn = createEaseInBack({ strength: 0 });
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      expect(cubicIn(t)).toBeCloseTo(t * t * t);
    }
  });
  it('with higher strength produces more overshoot', () => {
    const mild = createEaseInBack({ strength: 1 });
    const extreme = createEaseInBack({ strength: 3 });
    const minMild = Math.min(
      ...Array.from({ length: 100 }, (_, i) => mild(i / 100)),
    );
    const minExtreme = Math.min(
      ...Array.from({ length: 100 }, (_, i) => extreme(i / 100)),
    );
    expect(minExtreme).toBeLessThan(minMild);
  });
});

describe('createEaseOutBack', () => {
  it('with strength=0 produces cubic easing out', () => {
    const cubicOut = createEaseOutBack({ strength: 0 });
    expect(cubicOut(0)).toBe(0);
    expect(cubicOut(1)).toBeCloseTo(1);
  });
});

describe('createEaseInOutBack', () => {
  it('returns 0.5 at t=0.5', () => {
    const custom = createEaseInOutBack({ strength: 2 });
    expect(custom(0.5)).toBeCloseTo(0.5);
  });
});
