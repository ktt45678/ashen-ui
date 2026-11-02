import { InjectionToken } from '@angular/core';
import type {
  ButtonColor,
  ButtonLoadingVariant,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from './button';

/** Application-wide defaults for `[snButton]` and `sn-split-button`. */
export interface SnButtonDefaults {
  /** Component default: `'base'`. */
  variant?: ButtonVariant;
  /** Component default: `'primary'`. */
  color?: ButtonColor;
  /** Component default: `'md'`. */
  size?: ButtonSize;
  /** Component default: `'default'`. Not read by `sn-split-button`. */
  shape?: ButtonShape;
  /** Component default: `'default'`. Not read by `sn-split-button`. */
  loadingVariant?: ButtonLoadingVariant;
  /** Component default: `'start'`. Not read by `sn-split-button`. */
  iconPosition?: 'start' | 'end';
}

/**
 * Defaults for `[snButton]`. `sn-split-button` reads the same token for
 * `variant` / `color` / `size`: it renders a button and users expect the two
 * to match without configuring them twice.
 *
 * ```ts
 * providers: [{ provide: SN_BUTTON_DEFAULTS, useValue: { size: 'sm' } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { button: … } })`.
 */
export const SN_BUTTON_DEFAULTS = new InjectionToken<SnButtonDefaults>('SN_BUTTON_DEFAULTS');
