import { InjectionToken } from '@angular/core';
import type { ProgressSpinnerVariant } from './progress-spinner';

/** Application-wide defaults for `sn-progress-spinner`. */
export interface SnProgressSpinnerDefaults {
  /** Width and height in px. Component default: `32`. */
  size?: number;
  /** Stroke width in viewBox units (the box is 24 wide). Component default: `3.5`. */
  strokeWidth?: number;
  /** Component default: `'default'`. */
  variant?: ProgressSpinnerVariant;
}

/**
 * Defaults for `sn-progress-spinner`.
 *
 * ```ts
 * providers: [{ provide: SN_PROGRESS_SPINNER_DEFAULTS, useValue: { size: 48, variant: 'material' } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { progressSpinner: … } })`.
 */
export const SN_PROGRESS_SPINNER_DEFAULTS = new InjectionToken<SnProgressSpinnerDefaults>(
  'SN_PROGRESS_SPINNER_DEFAULTS',
);
