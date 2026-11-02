import { Injectable } from '@angular/core';

/**
 * Text for `sn-tree` and `sn-tree-table`.
 *
 * One service for both: they share the expand/collapse toggle labels, and
 * splitting them would mean translating the same two strings twice.
 */
@Injectable({ providedIn: 'root' })
export class SnTreeIntl {
  /** `sn-tree`'s fallback `aria-label`. */
  label = 'Tree';
  expand = 'Expand';
  collapse = 'Collapse';
  /** `sn-tree-table`'s fallback `aria-label`. */
  tableLabel = 'Tree table';
}

/** Text for `sn-table` and `table[snTable]`. */
@Injectable({ providedIn: 'root' })
export class SnTableIntl {
  /** `aria-label` of the header select-all checkbox. */
  selectAll = 'Select all rows';
  /** `aria-label` of a row's selection control. */
  selectRow = 'Select row';
  /** `aria-label` of a row's expand toggle. */
  expandRow = 'Toggle row details';
}

/** Text for `sn-carousel`. */
@Injectable({ providedIn: 'root' })
export class SnCarouselIntl {
  /** Fallback `aria-label` of the carousel region. */
  label = 'Carousel';
  previous = 'Previous slide';
  next = 'Next slide';
  /** Slide's `aria-label`; both arguments are 1-based. */
  slide(index: number, total: number): string {
    return `Slide ${index} of ${total}`;
  }
  /** Pagination dot's `aria-label`; `index` is 1-based. */
  goto(index: number): string {
    return `Go to slide ${index}`;
  }
}
