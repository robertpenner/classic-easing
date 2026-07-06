> Mirror of a package developed in a private monorepo — issues and pull requests are welcome here.

# @penner/classic-easing

The classic Penner easing equations, ported to TypeScript with normalized `(t: number) => number` signatures.

[![npm version](https://img.shields.io/npm/v/@penner/classic-easing)](https://www.npmjs.com/package/@penner/classic-easing)

This is a faithful port of the original ActionScript functions from 2001: the same math and the same names, with a modern API.

## Installation

```bash
npm install @penner/classic-easing
```

## Usage

Every easing function takes a normalized time `t` in [0, 1] and returns a value typically in [0, 1]:

```ts
import { easeOutQuad, easeInOutCubic, easeOutBounce } from "@penner/classic-easing";

const progress = easeOutQuad(0.5); // 0.75
const smooth = easeInOutCubic(0.5); // 0.5
const bounced = easeOutBounce(0.8); // ~0.95
```

Apply the easing to any interpolation:

```ts
import { easeOutElastic } from "@penner/classic-easing";

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

This input clamping is an addition to the original 2001 equations (which did not guard
their inputs): it guarantees exact `0`/`1` endpoints and stops out-of-range inputs from
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
import { easeInBack, easeOutBack, easeInOutBack } from "@penner/classic-easing";
```

Use factory functions to customize the overshoot strength:

```ts
import { createEaseInBack, createEaseOutBack, createEaseInOutBack } from "@penner/classic-easing";

const gentleBack = createEaseOutBack({ strength: 1 });
const aggressiveBack = createEaseOutBack({ strength: 3 });
const cubicNoOvershoot = createEaseInBack({ strength: 0 }); // equivalent to cubic

gentleBack(0.5); // use like any other easing function
```

### Elastic Easing (with oscillation)

Default exports use amplitude 1 and period 0.3 (0.45 for InOut):

```ts
import { easeInElastic, easeOutElastic, easeInOutElastic } from "@penner/classic-easing";
```

Use factory functions to customize amplitude and period:

```ts
import { createEaseOutElastic, createEaseInOutElastic } from "@penner/classic-easing";

const bouncy = createEaseOutElastic({ amplitude: 1.5, period: 0.2 });
const gentle = createEaseOutElastic({ period: 0.5 });
const inOut = createEaseInOutElastic({ amplitude: 1.2, period: 0.6 });
```

## Types

```ts
import type { EasingFn, BackConfig, ElasticConfig } from "@penner/classic-easing";
```

- **`EasingFn`** — `(t: number) => number`
- **`BackConfig`** — `{ strength?: number }`
- **`ElasticConfig`** — `{ amplitude?: number; period?: number }`

## Comparison with the physics-based package

Use `classic-easing` for the exact original formulas; a sibling package (not yet released) reimagines the same easing families with physics-based parameters.

- The `@penner/classic-easing` package preserves the original 2001 equations and classic naming conventions (`easeInQuad`, `easeOutBounce`).
- The sibling package reimagines the same easing families with physics-based parameters — configuring bounce by number of bounces and restitution, elastic by cycles and decay, and so on.

## License

MIT
