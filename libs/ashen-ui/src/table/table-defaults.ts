import { InjectionToken } from '@angular/core';
import type { TableLayout } from './table';

/** Application-wide defaults for `sn-table`. */
export interface SnTableDefaults {
  /** Zebra striping. Component default: `false`. */
  striped?: boolean;
  /** Row hover highlight. Component default: `true`. */
  hover?: boolean;
  /** `'table'` renders real table elements, `'flex'` renders a CSS grid. Component default: `'table'`. */
  layout?: TableLayout;
  /** Keep the header visible while the body scrolls. Component default: `false`. */
  stickyHeader?: boolean;
  /** Collapse to stacked cards on narrow viewports. Component default: `false`. */
  responsive?: boolean;
  /** Row height in px, used by the virtual scroller. Component default: `40`. */
  rowHeight?: number;
  /** Rows rendered beyond the viewport when virtualising. Component default: `4`. */
  overscan?: number;
}

/**
 * Defaults for `sn-table`.
 *
 * ```ts
 * providers: [{ provide: SN_TABLE_DEFAULTS, useValue: { striped: true, stickyHeader: true } }]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { table: … } })`.
 */
export const SN_TABLE_DEFAULTS = new InjectionToken<SnTableDefaults>('SN_TABLE_DEFAULTS');
