import {
  Directive,
  booleanAttribute,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

/**
 * Directive mode - applies the Ashen table design to a hand-written native
 * `<table>` so consumers keep full control of the markup:
 *
 * ```html
 * <table snTable striped snTableSort (snSortChange)="onSort($event)">
 *   <thead>
 *     <tr>
 *       <th snSortHeader="name">Name</th>
 *       <th>Role</th>
 *     </tr>
 *   </thead>
 *   <tbody>…</tbody>
 * </table>
 * ```
 */
@Directive({
  selector: 'table[snTable]',
  host: {
    class: 'sn-table-native',
    '[class.sn-table-native--striped]': 'striped()',
    '[class.sn-table-native--hover]': 'hover()',
    '[attr.data-sn-striped]': 'striped() ? "" : null',
    '[attr.data-sn-hover]': 'hover() ? "" : null',
    '[class.sn-table-native-stack-sm]': 'stack() === "sm"',
    '[class.sn-table-native-stack-md]': 'stack() === "md"',
    '[class.sn-table-native-stack-lg]': 'stack() === "lg"',
  },
})
export class TableStyle {
  readonly striped = input(false, { transform: booleanAttribute });
  readonly hover = input(true, { transform: booleanAttribute });
  /**
   * Below this breakpoint (sm 640px, md 768px, lg 1024px) the header is hidden and
   * each cell takes a full-width line. A `data-label` on a cell is shown before it.
   */
  readonly stack = input<TableStackBreakpoint | null>(null);
}

export type TableStackBreakpoint = 'sm' | 'md' | 'lg';

export interface TableSortState {
  field: string | null;
  order: 'asc' | 'desc' | null;
}

/** Sort coordinator for directive mode - one active column, asc → desc → none. */
@Directive({
  selector: '[snTableSort]',
})
export class TableSort {
  readonly snSortChange = output<TableSortState>();

  readonly state = signal<TableSortState>({ field: null, order: null });

  cycle(field: string): void {
    const { field: currentField, order: currentOrder } = this.state();

    let next: TableSortState;
    if (currentField !== field) {
      next = { field, order: 'asc' };
    } else if (currentOrder === 'asc') {
      next = { field, order: 'desc' };
    } else {
      next = { field: null, order: null };
    }

    this.state.set(next);
    this.snSortChange.emit(next);
  }
}

/** Sortable header cell for directive mode. Requires an ancestor `[snTableSort]`. */
@Directive({
  selector: 'th[snSortHeader]',
  host: {
    class: 'sn-sort-header',
    tabindex: '0',
    role: 'columnheader',
    '[class.sn-sort-header--asc]': 'isAsc()',
    '[class.sn-sort-header--desc]': 'isDesc()',
    '[attr.aria-sort]': 'ariaSort()',
    '(click)': 'onActivate()',
    '(keydown.enter)': 'onActivate()',
    '(keydown.space)': 'onActivate(); $event.preventDefault()',
  },
})
export class TableSortHeader {
  readonly snSortHeader = input.required<string>();

  private readonly sort = inject(TableSort);

  protected readonly isActive = computed(
    () => this.sort.state().field === this.snSortHeader() && this.sort.state().order !== null,
  );
  protected readonly isAsc = computed(() => this.isActive() && this.sort.state().order === 'asc');
  protected readonly isDesc = computed(() => this.isActive() && this.sort.state().order === 'desc');

  protected readonly ariaSort = computed(() => {
    if (!this.isActive()) return null;
    return this.sort.state().order === 'asc' ? 'ascending' : 'descending';
  });

  protected onActivate(): void {
    this.sort.cycle(this.snSortHeader());
  }
}
