import { type Signal, afterNextRender, signal } from '@angular/core';

/**
 * Returns a signal that flips to `true` two animation frames after the host's
 * first render, and is `false` until then.
 *
 * Bind it to a host class that GATES a component's state transitions. Under
 * zoneless change detection, model/value bindings (a preselected `checked`,
 * `value`, `collapsed`, active tab, …) are applied one change-detection cycle
 * *after* the element first paints. If the CSS transition is always active,
 * the element paints its default state and then visibly animates to the real
 * state, a flash. Gating the transition behind this signal means the late
 * initial state snaps into place, while genuinely later (user- or async-driven)
 * changes still animate because the gate is open by then.
 *
 * Must be called in an injection context (a field initializer or constructor).
 *
 * @example
 * ```ts
 * protected readonly _animate = snRenderGate();
 * // host: { '[class.sn-toggle-animate]': '_animate()' }
 * ```
 */
export function snRenderGate(): Signal<boolean> {
  const ready = signal(false);
  afterNextRender(() => snAfterFrames(2, () => ready.set(true)));
  return ready.asReadonly();
}

/**
 * Runs `fn` after `frames` animation frames, or straight away while the
 * document is hidden.
 *
 * A background tab suspends `requestAnimationFrame`, so a page that first
 * renders there would never run `fn` at all, and a gate that never opens leaves
 * the transitions it guards switched off for the life of the page. Nothing is
 * painted while hidden, so there is no flash left to guard against.
 */
export function snAfterFrames(frames: number, fn: () => void): void {
  if (typeof requestAnimationFrame !== 'function' || typeof document === 'undefined') {
    fn();
    return;
  }
  // Re-checked per frame: the tab can be backgrounded part-way through.
  if (document.hidden) {
    fn();
    return;
  }
  requestAnimationFrame(frames > 1 ? () => snAfterFrames(frames - 1, fn) : fn);
}
