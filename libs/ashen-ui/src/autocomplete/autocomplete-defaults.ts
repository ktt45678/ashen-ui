import { InjectionToken } from '@angular/core';

/** Application-wide defaults for `sn-autocomplete`. */
export interface SnAutoCompleteDefaults {
  /** Show a "nothing found" row when a search returns no suggestions. Component default: `false`. */
  showEmptyMessage?: boolean;
}

/**
 * Defaults for `sn-autocomplete`.
 *
 * ```ts
 * providers: [{ provide: SN_AUTOCOMPLETE_DEFAULTS, useValue: { showEmptyMessage: true } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { autocomplete: … } })`.
 */
export const SN_AUTOCOMPLETE_DEFAULTS = new InjectionToken<SnAutoCompleteDefaults>(
  'SN_AUTOCOMPLETE_DEFAULTS',
);
