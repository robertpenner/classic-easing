import { describe, expect, it } from 'vitest';
import { easeInBack, easeInOutBack, easeOutBack } from './back';
import { easeInBounce, easeInOutBounce, easeOutBounce } from './bounce';
import { easeInCirc, easeInOutCirc, easeOutCirc } from './circ';
import {
  CLASSIC_EASING_NAMES,
  type ClassicEasingName,
  classicEasingToFn,
  isClassicEasingName,
} from './classicEasingName';
import { easeInCubic, easeInOutCubic, easeOutCubic } from './cubic';
import { easeInElastic, easeInOutElastic, easeOutElastic } from './elastic';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';
import { linear } from './linear';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';

const PAIRS: [ClassicEasingName, (t: number) => number][] = [
  ['linear', linear],
  ['easeInQuad', easeInQuad],
  ['easeOutQuad', easeOutQuad],
  ['easeInOutQuad', easeInOutQuad],
  ['easeInCubic', easeInCubic],
  ['easeOutCubic', easeOutCubic],
  ['easeInOutCubic', easeInOutCubic],
  ['easeInQuart', easeInQuart],
  ['easeOutQuart', easeOutQuart],
  ['easeInOutQuart', easeInOutQuart],
  ['easeInQuint', easeInQuint],
  ['easeOutQuint', easeOutQuint],
  ['easeInOutQuint', easeInOutQuint],
  ['easeInSine', easeInSine],
  ['easeOutSine', easeOutSine],
  ['easeInOutSine', easeInOutSine],
  ['easeInExpo', easeInExpo],
  ['easeOutExpo', easeOutExpo],
  ['easeInOutExpo', easeInOutExpo],
  ['easeInCirc', easeInCirc],
  ['easeOutCirc', easeOutCirc],
  ['easeInOutCirc', easeInOutCirc],
  ['easeInBack', easeInBack],
  ['easeOutBack', easeOutBack],
  ['easeInOutBack', easeInOutBack],
  ['easeInBounce', easeInBounce],
  ['easeOutBounce', easeOutBounce],
  ['easeInOutBounce', easeInOutBounce],
  ['easeInElastic', easeInElastic],
  ['easeOutElastic', easeOutElastic],
  ['easeInOutElastic', easeInOutElastic],
];

describe('classicEasingToFn', () => {
  it.each(PAIRS)('resolves %s to the direct export', (name, fn) => {
    expect(classicEasingToFn(name)).toBe(fn);
  });

  it('covers exactly 31 names', () => {
    expect(PAIRS.length).toBe(31);
    expect(CLASSIC_EASING_NAMES.length).toBe(31);
  });

  it('preserves the frozen name list in registry order', () => {
    expect(CLASSIC_EASING_NAMES).toEqual(PAIRS.map(([name]) => name));
    expect(Object.isFrozen(CLASSIC_EASING_NAMES)).toBe(true);
  });
});

describe('isClassicEasingName', () => {
  it.each(PAIRS.map(([n]) => n))('accepts %s', name => {
    expect(isClassicEasingName(name)).toBe(true);
  });

  it('rejects unknown strings', () => {
    expect(isClassicEasingName('easeInBunce')).toBe(false);
    expect(isClassicEasingName('')).toBe(false);
    expect(isClassicEasingName('cubic-bezier(0,0,1,1)')).toBe(false);
    expect(isClassicEasingName('__proto__')).toBe(false);
    expect(isClassicEasingName('constructor')).toBe(false);
    expect(isClassicEasingName('toString')).toBe(false);
  });

  it('accepts linear, which is also a CSS keyword', () => {
    expect(isClassicEasingName('linear')).toBe(true);
  });
});
