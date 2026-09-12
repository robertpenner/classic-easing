import { expectTypeOf, test } from 'vitest';
import type { ClassicEasingName } from './classicEasingName';
import { classicEasingToFn, isClassicEasingName } from './classicEasingName';
import type { EasingFn } from './types';

test('ClassicEasingName accepts all 31 names', () => {
  expectTypeOf<'linear'>().toExtend<ClassicEasingName>();
  expectTypeOf<'easeOutBack'>().toExtend<ClassicEasingName>();
  expectTypeOf<'easeInOutElastic'>().toExtend<ClassicEasingName>();
  expectTypeOf<'easeOutBounce'>().toExtend<ClassicEasingName>();

  // @ts-expect-error — typo
  const bad: ClassicEasingName = 'easeInBunce';
  void bad;
});

test('classicEasingToFn returns EasingFn', () => {
  expectTypeOf(classicEasingToFn('easeOutBack')).toEqualTypeOf<EasingFn>();
});

test('isClassicEasingName narrows', () => {
  const s = 'easeOutBack' as string;
  if (isClassicEasingName(s)) {
    expectTypeOf(s).toEqualTypeOf<ClassicEasingName>();
  }
});
