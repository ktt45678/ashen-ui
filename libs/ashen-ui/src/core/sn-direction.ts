import { type Signal, computed, inject } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';

/** Layout direction along the inline axis. */
export type SnDirection = 'ltr' | 'rtl';

/**
 * The current layout direction, live.
 *
 * Resolved from the nearest `[dir]` ancestor, falling back to `<html dir>` /
 * `<body dir>`. Set direction with the `dir` ATTRIBUTE, not with a bare
 * `direction: rtl` declaration: the attribute is what both this signal and the
 * `[dir='rtl']` CSS rules read, and it is what tells assistive technology and
 * the bidi algorithm the same thing.
 *
 * Must be called in an injection context.
 *
 * ```ts
 * private readonly rtl = snIsRtl();
 * ```
 */
export function snDirection(): Signal<SnDirection> {
  return inject(Directionality).valueSignal.asReadonly();
}

/** {@link snDirection} as a boolean. Must be called in an injection context. */
export function snIsRtl(): Signal<boolean> {
  const direction = snDirection();
  return computed(() => direction() === 'rtl');
}

/**
 * Which way a horizontal arrow key points along the INLINE axis: `1` towards
 * the end, `-1` towards the start, `0` for every other key.
 *
 * Horizontal arrows are physical, so a component that reads them directly is
 * backwards in RTL: ArrowRight means "previous" when the content runs
 * right-to-left. Resolve the key through this instead of branching on it.
 *
 * ```ts
 * const step = snInlineStep(event.key, this.rtl());
 * if (step !== 0) this.move(step);
 * ```
 */
export function snInlineStep(key: string, rtl: boolean): -1 | 0 | 1 {
  if (key === 'ArrowRight') return rtl ? -1 : 1;
  if (key === 'ArrowLeft') return rtl ? 1 : -1;
  return 0;
}
