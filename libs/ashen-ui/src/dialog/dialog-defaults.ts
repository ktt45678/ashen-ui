import { InjectionToken } from '@angular/core';
import type { SnShowHideAnimation } from 'ashen-ui/core';
import type { DialogSize } from './dialog';
import type { SnConfirmDialogData } from './dialog-confirm';

/** Application-wide defaults for `sn-dialog`. */
export interface SnDialogDefaults {
  /** Component default: `'md'`. */
  size?: DialogSize;
  /** Replaces the built-in enter/exit keyframes. Component default: none. */
  animation?: SnShowHideAnimation;
  /** Defaults for `DialogService.confirm()`; an explicit `confirm()` option wins. */
  confirm?: Omit<SnConfirmDialogData, 'message'>;
}

/**
 * Defaults for `sn-dialog`.
 *
 * ```ts
 * providers: [{ provide: SN_DIALOG_DEFAULTS, useValue: { size: 'lg' } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { dialog: … } })`.
 */
export const SN_DIALOG_DEFAULTS = new InjectionToken<SnDialogDefaults>('SN_DIALOG_DEFAULTS');
