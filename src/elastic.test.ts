import { describe, expect, it } from 'vitest';
import {
  createEaseInElastic,
  createEaseInOutElastic,
  createEaseOutElastic,
  easeInElastic,
  easeInOutElastic,
  easeOutElastic,
} from './elastic';

describe('easeInElastic', () => {
  it('returns 0 at t=0', () => expect(easeInElastic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInElastic(1)).toBe(1));
  it('oscillates below 0', () => {
    const values = Array.from({ length: 100 }, (_, i) =>
      easeInElastic(i / 100),
    );
    expect(values.some(v => v < 0)).toBe(true);
  });
});

describe('easeOutElastic', () => {
  it('returns 0 at t=0', () => expect(easeOutElastic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeOutElastic(1)).toBe(1));
  it('oscillates above 1', () => {
    const values = Array.from({ length: 100 }, (_, i) =>
      easeOutElastic(i / 100),
    );
    expect(values.some(v => v > 1)).toBe(true);
  });
});

describe('easeInOutElastic', () => {
  it('returns 0 at t=0', () => expect(easeInOutElastic(0)).toBe(0));
  it('returns 1 at t=1', () => expect(easeInOutElastic(1)).toBe(1));
  it('returns 0.5 at t=0.5', () =>
    expect(easeInOutElastic(0.5)).toBeCloseTo(0.5));
});

describe('createEaseOutElastic', () => {
  it('custom amplitude and period work', () => {
    const custom = createEaseOutElastic({ amplitude: 1.5, period: 0.4 });
    expect(custom(0)).toBe(0);
    expect(custom(1)).toBe(1);
  });
  it('different period changes oscillation frequency', () => {
    const fast = createEaseOutElastic({ period: 0.1 });
    const slow = createEaseOutElastic({ period: 0.5 });
    // Different periods should produce different values at the same t
    expect(fast(0.3)).not.toBeCloseTo(slow(0.3));
  });
});

describe('createEaseInElastic', () => {
  it('custom config endpoints', () => {
    const custom = createEaseInElastic({ amplitude: 2, period: 0.5 });
    expect(custom(0)).toBe(0);
    expect(custom(1)).toBe(1);
  });
});

describe('createEaseInOutElastic', () => {
  it('custom config endpoints and midpoint', () => {
    const custom = createEaseInOutElastic({ amplitude: 1.5, period: 0.6 });
    expect(custom(0)).toBe(0);
    expect(custom(1)).toBe(1);
    expect(custom(0.5)).toBeCloseTo(0.5);
  });
});
