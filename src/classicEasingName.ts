import { easeInBack, easeInOutBack, easeOutBack } from './back';
import { easeInBounce, easeInOutBounce, easeOutBounce } from './bounce';
import { easeInCirc, easeInOutCirc, easeOutCirc } from './circ';
import { easeInCubic, easeInOutCubic, easeOutCubic } from './cubic';
import { easeInElastic, easeInOutElastic, easeOutElastic } from './elastic';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';
import type { EasingFn } from './types';

/**
 * Typed literal union of the 30 Penner-classic named easings — 10 families × 3 variants.
 *
 * Each name resolves to the corresponding pre-built {@link EasingFn} exported by this
 * package. Designed to slot in as one tier of a broader named/parameterized easing
 * descriptor system.
 *
 * For custom-parameter Back / Elastic curves, use the `create*` factories directly
 * (runtime-only — not serializable).
 */
export type ClassicEasingName =
  | 'easeInQuad'
  | 'easeOutQuad'
  | 'easeInOutQuad'
  | 'easeInCubic'
  | 'easeOutCubic'
  | 'easeInOutCubic'
  | 'easeInQuart'
  | 'easeOutQuart'
  | 'easeInOutQuart'
  | 'easeInQuint'
  | 'easeOutQuint'
  | 'easeInOutQuint'
  | 'easeInSine'
  | 'easeOutSine'
  | 'easeInOutSine'
  | 'easeInExpo'
  | 'easeOutExpo'
  | 'easeInOutExpo'
  | 'easeInCirc'
  | 'easeOutCirc'
  | 'easeInOutCirc'
  | 'easeInBack'
  | 'easeOutBack'
  | 'easeInOutBack'
  | 'easeInBounce'
  | 'easeOutBounce'
  | 'easeInOutBounce'
  | 'easeInElastic'
  | 'easeOutElastic'
  | 'easeInOutElastic';

const REGISTRY: Record<ClassicEasingName, EasingFn> = {
  easeInQuad,
  easeOutQuad,
  easeInOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
};

const NAME_SET: ReadonlySet<string> = new Set(Object.keys(REGISTRY));

/**
 * Maps a {@link ClassicEasingName} to the corresponding pre-built {@link EasingFn}.
 *
 * The returned function is reference-equal to the package's direct named export
 * (e.g. `classicEasingToFn('easeOutBack') === easeOutBack`).
 */
export function classicEasingToFn(name: ClassicEasingName): EasingFn {
  return REGISTRY[name];
}

/**
 * Type predicate narrowing `string` to {@link ClassicEasingName}.
 *
 * Useful for routing string easing inputs between tiers — e.g. distinguishing
 * CSS keyword eases from these classic Penner names.
 */
export function isClassicEasingName(s: string): s is ClassicEasingName {
  return NAME_SET.has(s);
}

/** All 30 classic easing names, in registry order. Frozen at module load. */
export const CLASSIC_EASING_NAMES: readonly ClassicEasingName[] = Object.freeze(
  Object.keys(REGISTRY) as ClassicEasingName[],
);
