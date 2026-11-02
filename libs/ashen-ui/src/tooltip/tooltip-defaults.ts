import { InjectionToken } from '@angular/core';
import type { SnShowHideAnimation } from 'ashen-ui/core';
import type { TooltipPosition } from './tooltip';

/** Application-wide defaults for `[snTooltip]`. */
export interface SnTooltipDefaults {
  /** Component default: `'top'`. */
  position?: TooltipPosition;
  /** Milliseconds before the tooltip appears. Component default: `300`. */
  showDelay?: number;
  /** Milliseconds before it disappears. Component default: `150`. */
  hideDelay?: number;
  /** Replaces the built-in enter/exit keyframes. Component default: none. */
  animation?: SnShowHideAnimation;
}

/**
 * Defaults for `[snTooltip]`.
 *
 * ```ts
 * providers: [{ provide: SN_TOOLTIP_DEFAULTS, useValue: { showDelay: 0 } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { tooltip: … } })`.
 */
export const SN_TOOLTIP_DEFAULTS = new InjectionToken<SnTooltipDefaults>('SN_TOOLTIP_DEFAULTS');
