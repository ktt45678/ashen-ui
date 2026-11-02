import { InjectionToken } from '@angular/core';
import type { SnShowHideAnimation } from 'ashen-ui/core';
import type { DrawerPosition } from './drawer';

/** Application-wide defaults for `sn-drawer`. */
export interface SnDrawerDefaults {
  /** Component default: `'right'`. */
  position?: DrawerPosition;
  /** CSS length for side drawers. Component default: `''` (token-driven). */
  width?: string;
  /** CSS length for top/bottom drawers. Component default: `''` (token-driven). */
  height?: string;
  /** Render the backdrop. Component default: `true`. */
  mask?: boolean;
  /** Lock body scroll while open. Component default: `true`. */
  lockScroll?: boolean;
  /** Replaces the built-in enter/exit keyframes. Component default: none. */
  animation?: SnShowHideAnimation;
}

/**
 * Defaults for `sn-drawer`.
 *
 * ```ts
 * providers: [{ provide: SN_DRAWER_DEFAULTS, useValue: { position: 'left' } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { drawer: … } })`.
 */
export const SN_DRAWER_DEFAULTS = new InjectionToken<SnDrawerDefaults>('SN_DRAWER_DEFAULTS');
