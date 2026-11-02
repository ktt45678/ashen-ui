import { Injectable } from '@angular/core';

/**
 * Text shared by more than one component family.
 *
 * ```ts
 * providers: [{ provide: SnCommonIntl, useValue: Object.assign(new SnCommonIntl(), { close: 'Fermer' }) }]
 * ```
 *
 * Usually reached through `provideSnIntl({ common: { close: 'Fermer' } })`.
 */
@Injectable({ providedIn: 'root' })
export class SnCommonIntl {
  close = 'Close';
  next = 'Next';
  previous = 'Previous';
  /** `sn-progress-spinner`'s default `aria-label`. */
  loading = 'Loading';
  /** Shown by `sn-table` and the select family when there is nothing to list. */
  emptyMessage = 'No results found.';
}
