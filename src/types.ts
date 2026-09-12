/**
 * A normalized easing function: takes `t` in `[0, 1]` and returns a value typically in
 * `[0, 1]`.
 *
 * Inputs are clamped to the unit interval — `t <= 0` returns `0`, `t >= 1` returns `1`
 * (no extrapolation), and `NaN` propagates. Back and Elastic outputs may still exceed
 * `[0, 1]` for `t` inside the domain.
 */
export type EasingFn = (t: number) => number;

//// CONFIGS ////

/** Configuration for back easing functions. */
export interface BackConfig {
  /**
   * Strength factor for the overshoot/backtracking.
   * The default value of 1.70158 produces ~10% overshoot.
   * A value of 0 produces cubic easing with no backtracking.
   * Must be finite; for InOut, strength * 1.525 must also be finite.
   * Invalid configuration throws RangeError when the factory is called.
   *
   * Note: strength is an equation coefficient that is not linearly proportional to the amount of overshoot.
   */
  strength?: number;
}

/** Configuration for elastic easing functions. */
export interface ElasticConfig {
  /** Finite oscillation amplitude. Values below 1 are clamped to 1; nonfinite values throw RangeError. */
  amplitude?: number;

  /**
   * Period in normalized time units. Default: 0.3 (0.45 for InOut).
   * Zero selects the variant default. Otherwise must be finite and positive,
   * with a finite angular frequency (2 * Math.PI / period).
   * Invalid configuration throws RangeError when the factory is called.
   */
  period?: number;
}

//// FACTORIES ////

/** A factory function that creates an easing function from a config object. */
export type EasingFactory<Config> = (config?: Config) => EasingFn;

/** A factory function that creates a back easing function from a {@link BackConfig}. */
export type BackEasingFactory = EasingFactory<BackConfig>;

/** A factory function that creates an elastic easing function from an {@link ElasticConfig}. */
export type ElasticEasingFactory = EasingFactory<ElasticConfig>;
