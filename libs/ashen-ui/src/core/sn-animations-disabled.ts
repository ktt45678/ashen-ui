import {
  ANIMATION_MODULE_TYPE,
  InjectionToken,
  type Provider,
  PLATFORM_ID,
  type Signal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Force every component's show/hide animation off (or on) regardless of the
 * per-component `animated` input and of the user's motion preference.
 *
 * ```ts
 * providers: [{ provide: SN_ANIMATIONS_DISABLED, useValue: true }]
 * ```
 *
 * Usually you want {@link provideSnAnimations} instead, which also covers the
 * `'reduced-motion'` case. Provide this directly when you need an unconditional
 * answer, most often `true` in tests, so overlay teardown is synchronous.
 */
export const SN_ANIMATIONS_DISABLED = new InjectionToken<boolean>('SN_ANIMATIONS_DISABLED');

/** How motion should be resolved app-wide. */
export type SnAnimationMode = 'enabled' | 'disabled' | 'reduced-motion';

/**
 * Whether show/hide animations are currently off.
 *
 * Resolution order, first match wins:
 *
 *   1. An explicit `SN_ANIMATIONS_DISABLED` value.
 *   2. Angular's `ANIMATION_MODULE_TYPE` being `'NoopAnimations'`, so
 *      `provideNoopAnimations()` and the CLI's test setup are honoured for free.
 *   3. `prefers-reduced-motion: reduce`, tracked LIVE: the returned signal
 *      updates if the user changes the OS setting while the app is open.
 *
 * Must be called in an injection context.
 *
 * Motion is otherwise CSS-driven: `--sn-motion-*` and the component duration
 * tokens collapse under reduced motion, and overlays wait for whatever exit
 * animation the CSS runs. This flag lets an overlay skip that wait entirely,
 * which is what tests want.
 */
export function snAnimationsDisabled(): Signal<boolean> {
  const explicit = inject(SN_ANIMATIONS_DISABLED, { optional: true });
  if (explicit != null) return signal(explicit).asReadonly();

  const noopAnimations = inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
  if (noopAnimations) return signal(true).asReadonly();

  return snPrefersReducedMotion();
}

let reducedMotion: { source: typeof matchMedia; state: Signal<boolean> } | null = null;

/**
 * Live `prefers-reduced-motion: reduce` state. Always `false` on the server,
 * where there is no media query to read.
 *
 * Every caller shares one MediaQueryList and one listener: `matchMedia()`
 * returns a new list per call, so a per-caller listener would pile up one per
 * component instance and never be released.
 */
export function snPrefersReducedMotion(): Signal<boolean> {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  if (!isBrowser || typeof matchMedia !== 'function') return signal(false).asReadonly();

  if (reducedMotion?.source !== matchMedia) {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const reduced = signal(query.matches);
    query.addEventListener('change', (e) => reduced.set(e.matches));
    reducedMotion = { source: matchMedia, state: reduced.asReadonly() };
  }
  return reducedMotion.state;
}

/**
 * Combine a component's own `animated` input with the app-wide motion setting.
 * The component animates only when both agree.
 *
 * ```ts
 * readonly animated = input(true, { transform: booleanAttribute });
 * protected readonly effectiveAnimated = snAnimated(this.animated);
 * ```
 *
 * Must be called in an injection context.
 */
export function snAnimated(animated: Signal<boolean>): Signal<boolean> {
  const disabled = snAnimationsDisabled();
  return computed(() => animated() && !disabled());
}

/**
 * Set the app-wide motion policy.
 *
 * ```ts
 * bootstrapApplication(App, {
 *   providers: [provideSnAnimations('reduced-motion')],
 * });
 * ```
 *
 * - `'enabled'`: always animate, even if the OS asks for reduced motion. Use
 *   sparingly; it overrides an accessibility preference.
 * - `'disabled'`: never animate. Overlay teardown becomes synchronous, which
 *   is what you want in tests.
 * - `'reduced-motion'`: follow the user's `prefers-reduced-motion` setting,
 *   live. This is the default behaviour when nothing is provided, so you only
 *   need it to be explicit.
 */
export function provideSnAnimations(mode: SnAnimationMode): Provider[] {
  if (mode === 'reduced-motion') {
    // Leave the token unprovided so the media query decides; `false` would pin animations on.
    return [];
  }
  return [{ provide: SN_ANIMATIONS_DISABLED, useValue: mode === 'disabled' }];
}
