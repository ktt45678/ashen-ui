import { Injectable } from '@angular/core';

/** Text for `sn-breadcrumb`. */
@Injectable({ providedIn: 'root' })
export class SnBreadcrumbIntl {
  /** `aria-label` of the nav landmark. */
  label = 'Breadcrumb';
}

/** Text for `sn-paginator`. */
@Injectable({ providedIn: 'root' })
export class SnPaginatorIntl {
  /** `aria-label` of the nav landmark. */
  label = 'Pagination';
  first = 'First page';
  previous = 'Previous page';
  next = 'Next page';
  last = 'Last page';
  jump = 'Jump to page';
  rowsPerPage = 'Rows per page';
  /** A page button's `aria-label`; `page` is 1-based. */
  page(page: number): string {
    return `Page ${page}`;
  }
  report(first: number, last: number, total: number): string {
    return `${first}–${last} of ${total}`;
  }
}

/** Text for `sn-stepper`. */
@Injectable({ providedIn: 'root' })
export class SnStepperIntl {
  /** `aria-label` of the step list. */
  label = 'Progress steps';
}

/** Text for `sn-split-button`. */
@Injectable({ providedIn: 'root' })
export class SnSplitButtonIntl {
  /** `aria-label` of the dropdown half. */
  more = 'More actions';
}

/** Text for `sn-panel`. */
@Injectable({ providedIn: 'root' })
export class SnPanelIntl {
  expand = 'Expand';
  collapse = 'Collapse';
}

/** Text for `sn-splitter`. */
@Injectable({ providedIn: 'root' })
export class SnSplitterIntl {
  /** `aria-label` of the separator handle. */
  resize = 'Resize panels';
}
