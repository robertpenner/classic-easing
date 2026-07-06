import { describe, expect, it } from 'vitest';
import { linear } from './linear';

describe('linear', () => {
  it('returns 0 at t=0', () => expect(linear(0)).toBe(0));
  it('returns 1 at t=1', () => expect(linear(1)).toBe(1));
  it('returns 0.5 at t=0.5', () => expect(linear(0.5)).toBe(0.5));
  it('is the identity function', () => {
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      expect(linear(t)).toBe(t);
    }
  });
});
