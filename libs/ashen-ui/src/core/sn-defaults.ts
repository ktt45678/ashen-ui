import { InjectionToken, inject } from '@angular/core';

/**
 * The size scale shared by every text-entry control in the library
 * (`sn-input-text`, `sn-textarea`, `sn-input-password`, `sn-input-tags`).
 *
 * Each of those components keeps its own exported alias (`InputTextSize`,
 * `TextareaSize`, …) because those are the names their public API documents.
 * They are all structurally this type, and {@link snDefault} assigns this type
 * into them, so if one of them ever narrows its scale the assignment stops
 * compiling. That is the drift guard; there is no runtime check to write.
 */
export type SnControlSize = 'sm' | 'md' | 'lg';

/** Application-wide defaults for the text-entry controls. */
export interface SnInputDefaults {
  /** Control height/typography scale. Component default: `'md'`. */
  size?: SnControlSize;
}

/**
 * Defaults for `sn-input-text`, `sn-textarea`, `sn-input-password` and
 * `sn-input-tags`. One token covers all four because they share a single size
 * scale and are almost always set together.
 *
 * ```ts
 * providers: [{ provide: SN_INPUT_DEFAULTS, useValue: { size: 'sm' } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { input: … } })`.
 */
export const SN_INPUT_DEFAULTS = new InjectionToken<SnInputDefaults>('SN_INPUT_DEFAULTS');

/**
 * Read one application-wide default, falling back to the component's own value.
 *
 * Call it **in the `input()` initializer**, not in `ngOnInit`:
 *
 * ```ts
 * readonly size = input<InputTextSize>(snDefault(SN_INPUT_DEFAULTS, 'size', 'md'));
 * ```
 *
 * This keeps `input()` the single source of truth. The alternative shape,
 * `input<T | undefined>(undefined)` plus an `effectiveX()` computed, widens
 * every defaulted input's public type to include `undefined` and forces every
 * internal read, host binding included, to move to `effectiveX()`. `button.ts`
 * alone reads `variant()` / `color()` / `size()` from 13 host bindings. A field
 * initializer runs inside the component's injection context, so `inject()` is
 * legal here and the default is resolved once, per instance, before the first
 * change detection, which is exactly the semantics an `input()` default has.
 *
 * The one thing this shape cannot do is react to a token that changes after
 * construction. DI values do not change after construction, so that is not a
 * limitation in practice.
 *
 * Must be called in an injection context.
 *
 * @param token The component's `SN_*_DEFAULTS` token.
 * @param key Which default to read.
 * @param fallback The component's own default, used when nothing is provided.
 */
export function snDefault<T extends object, K extends keyof T>(
  token: InjectionToken<T>,
  key: K,
  fallback: NonNullable<T[K]>,
): NonNullable<T[K]> {
  const value = inject(token, { optional: true })?.[key];
  // `undefined` means "not configured", so a partially-filled defaults object
  // works. `null` and `false` are configured values and are passed through.
  return value === undefined ? fallback : (value as NonNullable<T[K]>);
}

/**
 * The whole provided defaults object, or `null` when nothing is provided.
 *
 * Use this for inputs that have no fallback to speak of, an input whose type
 * already includes `undefined`, such as
 * `rowsPerPageOptions = input(snDefaults(SN_PAGINATOR_DEFAULTS)?.rowsPerPageOptions)`.
 * Everything else should use {@link snDefault}.
 *
 * Must be called in an injection context.
 */
export function snDefaults<T extends object>(token: InjectionToken<T>): T | null {
  return inject(token, { optional: true });
}
