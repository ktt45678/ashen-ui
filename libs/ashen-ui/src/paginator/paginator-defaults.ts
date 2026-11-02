import { InjectionToken } from '@angular/core';

export type PaginatorJustify = 'between' | 'start' | 'center' | 'end';

/** Application-wide defaults for `sn-paginator`. */
export interface SnPaginatorDefaults {
  /** Page size. Component default: `10`. */
  rows?: number;
  /** Page-size choices; omitted means no page-size selector. Component default: none. */
  rowsPerPageOptions?: number[];
  /** Page links shown either side of the current page. Component default: `1`. */
  siblings?: number;
  /** Render the first/last buttons. Component default: `true`. */
  showEdges?: boolean;
  /**
   * Fixed number of page links to show as a sliding window, with no ellipsis.
   * `0` (default) keeps the ellipsis and
   * `siblings` behaviour; any value `> 0` overrides `siblings`.
   */
  pageLinkSize?: number;
  /** Which side the record report sits on. Component default: `'end'`. */
  reportPosition?: 'start' | 'end';
  /**
   * How the parts sit in the row. `'between'` spreads them to both edges;
   * the others pack them together. Component default: `'between'`.
   */
  justify?: PaginatorJustify;
  /** Show the visible "Rows per page" text before the page-size trigger. Component default: `true`. */
  showRowsLabel?: boolean;
  /** Show the "1–10 of 100" record report. Component default: `true`. */
  showReport?: boolean;
}

/**
 * Defaults for `sn-paginator`.
 *
 * ```ts
 * providers: [
 *   { provide: SN_PAGINATOR_DEFAULTS, useValue: { rows: 25, rowsPerPageOptions: [25, 50, 100] } },
 * ]
 * ```
 *
 * Usually reached through `provideAshenUI({ defaults: { paginator: … } })`.
 */
export const SN_PAGINATOR_DEFAULTS = new InjectionToken<SnPaginatorDefaults>(
  'SN_PAGINATOR_DEFAULTS',
);
