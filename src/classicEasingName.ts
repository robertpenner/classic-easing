import { easeInBack, easeInOutBack, easeOutBack } from './back';
import { easeInBounce, easeInOutBounce, easeOutBounce } from './bounce';
import { easeInCirc, easeInOutCirc, easeOutCirc } from './circ';
import { easeInCubic, easeInOutCubic, easeOutCubic } from './cubic';
import { easeInElastic, easeInOutElastic, easeOutElastic } from './elastic';
import { easeInExpo, easeInOutExpo, easeOutExpo } from './expo';
import { linear } from './linear';
import { easeInOutQuad, easeInQuad, easeOutQuad } from './quad';
import { easeInOutQuart, easeInQuart, easeOutQuart } from './quart';
import { easeInOutQuint, easeInQuint, easeOutQuint } from './quint';
import { easeInOutSine, easeInSine, easeOutSine } from './sine';
import type { EasingFn } from './types';

const classicEasingNames = [
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
  'easeInBack',
  'easeOutBack',
  'easeInOutBack',
  'easeInBounce',
  'easeOutBounce',
  'easeInOutBounce',
  'easeInElastic',
  'easeOutElastic',
  'easeInOutElastic',
] as const;

/**
 * Typed literal union of the 31 Penner-classic named easings — `linear` plus
 * 10 families × 3 variants.
 *
 * Each name resolves to the corresponding pre-built {@link EasingFn} exported by this
 * package. Designed to slot in as one tier of a broader named/parameterized easing
 * descriptor system.
 *
 * `linear` is also a CSS easing keyword, so a router that checks both tiers must
 * decide which one wins for that one string.
 *
 * For custom-parameter Back / Elastic curves, use the `create*` factories directly
 * (runtime-only — not serializable).
 */
export type ClassicEasingName = (typeof classicEasingNames)[number];

const REGISTRY: Record<ClassicEasingName, EasingFn> = {
  linear,
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
 * CSS keyword eases from these classic Penner names. `linear` belongs to both
 * tiers and answers `true` here, so a router that wants CSS to win for it must
 * check the CSS tier first.
 */
export function isClassicEasingName(s: string): s is ClassicEasingName {
  return CLASSIC_EASING_NAMES.some(name => name === s);
}

/** All 31 classic easing names, in registry order. Frozen at module load. */
export const CLASSIC_EASING_NAMES: readonly ClassicEasingName[] =
  /* @__PURE__ */ Object.freeze(classicEasingNames);
