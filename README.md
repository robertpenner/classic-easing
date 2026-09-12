> Mirror of a package developed in a private monorepo — issues and pull requests are welcome here.

# @penner/classic-easing

The classic Penner easing equations, ported to TypeScript with normalized `(t: number) => number` signatures.

[![npm version](https://img.shields.io/npm/v/@penner/classic-easing)](https://www.npmjs.com/package/@penner/classic-easing)

The equations originated in 2001. This port follows the
[archived ActionScript v1.5 equations (2003)](https://robertpenner.com/easing/penner_easing_as1.txt),
normalized to unit time and unit change, with explicit input clamping and factory
configuration validation.

## Installation

```bash
npm install @penner/classic-easing
```

Supports native ESM and CommonJS on Node 20.19.0 or later, TypeScript 5.8 or later
with Node16, NodeNext, or bundler resolution, and modern evergreen browsers via
an ESM-capable bundler. There are no runtime dependencies.

## Usage

Every easing function takes a normalized time `t` in [0, 1] and returns a value typically in [0, 1]:

```ts
import {
  easeOutQuad,
  easeInOutCubic,
  easeOutBounce,
} from '@penner/classic-easing';

const progress = easeOutQuad(0.5); // 0.75
const smooth = easeInOutCubic(0.5); // 0.5
const bounced = easeOutBounce(0.8); // ~0.95
```

Apply the easing to any interpolation:

```ts
import { easeOutElastic } from '@penner/classic-easing';

const easedProgress = easeOutElastic(t); // t ∈ [0, 1]
const x = startX + (endX - startX) * easedProgress;
```

## Input domain

Inputs are **clamped to the unit interval**. Any `t ≤ 0` returns exactly `0` and any
`t ≥ 1` returns exactly `1`; the underlying equation runs only for `0 < t < 1`. There is
**no extrapolation** outside `[0, 1]`, and a `NaN` input returns `NaN`.

```ts
easeOutQuad(-0.5); // 0
easeOutQuad(1.5); // 1
easeInCirc(2); // 1  (clamped, not NaN)
```

This input clamping extends the historical equations' endpoint handling: it guarantees
exact `0`/`1` endpoints and stops out-of-range inputs from
producing `NaN` or runaway values. Note this clamps the **input** `t` — the **output** of
Back and Elastic still intentionally overshoots `[0, 1]` for `t` inside the domain (see
the note under [Easing Functions](#easing-functions)).

## Easing Functions

### Simple Eases

All simple easing functions are exported as ready-to-use `(t: number) => number`:

| Family | In             | Out             | InOut             |
| ------ | -------------- | --------------- | ----------------- |
| Quad   | `easeInQuad`   | `easeOutQuad`   | `easeInOutQuad`   |
| Cubic  | `easeInCubic`  | `easeOutCubic`  | `easeInOutCubic`  |
| Quart  | `easeInQuart`  | `easeOutQuart`  | `easeInOutQuart`  |
| Quint  | `easeInQuint`  | `easeOutQuint`  | `easeInOutQuint`  |
| Sine   | `easeInSine`   | `easeOutSine`   | `easeInOutSine`   |
| Expo   | `easeInExpo`   | `easeOutExpo`   | `easeInOutExpo`   |
| Circ   | `easeInCirc`   | `easeOutCirc`   | `easeInOutCirc`   |
| Bounce | `easeInBounce` | `easeOutBounce` | `easeInOutBounce` |

Plus `linear` — the identity function.

> **Note:** Back and Elastic easing functions intentionally overshoot outside the [0, 1] range — this is by design, producing the characteristic backtracking and springy oscillation effects.

### Back Easing (with overshoot)

Default exports use the classic overshoot strength of 1.70158 (~10% overshoot):

```ts
import { easeInBack, easeOutBack, easeInOutBack } from '@penner/classic-easing';
```

Use factory functions to customize the overshoot strength:

```ts
import {
  createEaseInBack,
  createEaseOutBack,
  createEaseInOutBack,
} from '@penner/classic-easing';

const gentleBack = createEaseOutBack({ strength: 1 });
const aggressiveBack = createEaseOutBack({ strength: 3 });
const cubicNoOvershoot = createEaseInBack({ strength: 0 }); // equivalent to cubic

gentleBack(0.5); // use like any other easing function
```

### Elastic Easing (with oscillation)

Default exports use amplitude 1 and period 0.3 (0.45 for InOut):

```ts
import {
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
} from '@penner/classic-easing';
```

Use factory functions to customize amplitude and period:

```ts
import {
  createEaseOutElastic,
  createEaseInOutElastic,
} from '@penner/classic-easing';

const bouncy = createEaseOutElastic({ amplitude: 1.5, period: 0.2 });
const gentle = createEaseOutElastic({ period: 0.5 });
const inOut = createEaseInOutElastic({ amplitude: 1.2, period: 0.6 });
```

### Factory Parameter Contract

Factories validate configuration once, when called. Invalid configuration is a
programmer error and throws `RangeError`; valid factories return an `EasingFn`
without changing its callable API. No diagnostics are logged.

| Option              | Supported values                                                                          | Default and special cases                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Back `strength`     | Finite numbers; InOut additionally requires `strength * 1.525` to be finite               | `1.70158`; zero produces cubic easing; negative coefficients retain their historical behavior        |
| Elastic `amplitude` | Finite numbers                                                                            | `1`; finite values below one are clamped to one                                                      |
| Elastic `period`    | Finite positive numbers whose angular frequency `2 * Math.PI / period` is finite, or zero | `0.3` for In/Out and `0.45` for InOut; zero (including negative zero) selects that variant's default |

All nonfinite configuration values, negative periods, periods too small to have
a finite angular frequency, and overflowing Back InOut coefficients are rejected.
This differs from a `NaN` progress argument, which intentionally propagates.
Progress and period are measured in normalized time, not milliseconds.

Elastic In and Out are not reflections of each other when amplitude exceeds one.
The original formulas define each direction independently. Historical Expo and
Elastic endpoint corrections also introduce small endpoint jumps; these are not
continuous-at-the-endpoint replacements for the classic formulas.

These are binary64 floating-point evaluations, not exact arithmetic. Regression
comparisons use scale-aware tolerances; no uniform relative-error bound is promised
near zeros or for extreme coefficients and frequencies.

### Pre-v1 Behavior Changes

Compared with the earlier unreleased 0.1.0 implementation, custom-amplitude Elastic
In and the first half of InOut now match the archive. Zero periods now use the
historical default. Invalid factory configurations now throw at construction
instead of returning functions that produce nonfinite samples. Validate data-driven
configuration before creating an easing, or handle `RangeError` at that call site.

## Named Lookup

```ts
import {
  CLASSIC_EASING_NAMES,
  classicEasingToFn,
  isClassicEasingName,
} from '@penner/classic-easing';

const name: string = 'easeOutQuad';
if (isClassicEasingName(name)) {
  const easing = classicEasingToFn(name);
  easing(0.5); // 0.75
}
CLASSIC_EASING_NAMES.includes('linear'); // true
```

`CLASSIC_EASING_NAMES` is a frozen array of all 31 names. `isClassicEasingName`
narrows a string to `ClassicEasingName`; use it before looking up untrusted names.
`classicEasingToFn` accepts a valid name and returns the same function as the
corresponding direct export. Parameterized Back and Elastic curves use factories,
not registry names.

## Types

```ts
import type {
  EasingFn,
  BackConfig,
  ElasticConfig,
} from '@penner/classic-easing';
```

- **`EasingFn`** — `(t: number) => number`
- **`BackConfig`** — `{ strength?: number }`
- **`ElasticConfig`** — `{ amplitude?: number; period?: number }`
- **`ClassicEasingName`** — the union of the 31 registered easing names
- **`EasingFactory<Config>`** — `(config?: Config) => EasingFn`
- **`BackEasingFactory`** and **`ElasticEasingFactory`** — the corresponding configured factory types

## Comparison with the physics-based package

Use `classic-easing` for the exact original formulas; a sibling package (not yet released) reimagines the same easing families with physics-based parameters.

- The `@penner/classic-easing` package preserves the historical equations and classic naming conventions (`easeInQuad`, `easeOutBounce`), subject to the input and configuration contracts above.
- The sibling package reimagines the same easing families with physics-based parameters — configuring bounce by number of bounces and restitution, elastic by cycles and decay, and so on.

## Contributing

Issues and pull requests are welcome in the
[public repository](https://github.com/robertpenner/classic-easing). It is a source
mirror of the development monorepo; accepted contributions are incorporated there
and included in subsequent mirror updates.

In a checkout of the public repository, using Node 20.19.0 or later:

```bash
npm install
npm run typecheck
npm test
npm run build
npm run format:scripts
```

Both `npm test` and `npm run test:ci` exclude random property exploration.
Run `npm run test:run` locally to include it.

The mirror includes its test and formatting configuration. Repository-wide ESLint
and API-documentation commands belong to the development monorepo and are not
exposed as standalone mirror scripts.

## License

MIT
