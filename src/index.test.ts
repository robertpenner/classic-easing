import { describe, expect, it } from 'vitest';
import * as classicEasing from './index';

describe('@penner/classic-easing exports', () => {
  const expectedFunctions = [
    'linear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutQuad',
    'easeInCubic',
    'easeOutCubic',
    'easeInOutCubic',
    'easeInQuart',
    'easeOutQuart',
    'easeInOutQuart',
    'easeInQuint',
    'easeOutQuint',
    'easeInOutQuint',
    'easeInSine',
    'easeOutSine',
    'easeInOutSine',
    'easeInExpo',
    'easeOutExpo',
    'easeInOutExpo',
    'easeInCirc',
    'easeOutCirc',
    'easeInOutCirc',
    'easeInBounce',
    'easeOutBounce',
    'easeInOutBounce',
    'easeInBack',
    'easeOutBack',
    'easeInOutBack',
    'easeInElastic',
    'easeOutElastic',
    'easeInOutElastic',
  ] as const;

  const factories = [
    'createEaseInBack',
    'createEaseOutBack',
    'createEaseInOutBack',
    'createEaseInElastic',
    'createEaseOutElastic',
    'createEaseInOutElastic',
  ] as const;

  it('exports all 31 easing functions', () => {
    for (const name of expectedFunctions) {
      expect(typeof classicEasing[name]).toBe('function');
    }
  });

  it('exports all 6 factory functions', () => {
    for (const name of factories) {
      expect(typeof classicEasing[name]).toBe('function');
    }
  });

  it('all easing functions return 0 at t=0', () => {
    for (const name of expectedFunctions) {
      expect(classicEasing[name](0)).toBeCloseTo(0);
    }
  });

  it('all easing functions return 1 at t=1', () => {
    for (const name of expectedFunctions) {
      expect(classicEasing[name](1)).toBeCloseTo(1);
    }
  });
});
