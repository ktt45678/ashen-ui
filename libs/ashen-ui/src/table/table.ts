import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  SnCommonIntl,
  SnTableIntl,
  resolveSnClass,
  snDefault,
  snIsRtl,
  snNextId,
} from 'ashen-ui/core';
import { SN_TABLE_DEFAULTS } from './table-defaults';
import { Icon } from 'ashen-ui/icon';
import { Checkbox } from 'ashen-ui/checkbox';
import { ProgressSpinner } from 'ashen-ui/progress-spinner';
import { TableColumn } from './table-column';
import { TableExpansionDef } from './table-expansion-def';
import { snSelectionModel } from 'ashen-ui/cdk';

export type TableSelectionMode =
  /** Rows are not selectable. */
  | 'none'
  /** One row at a time; picking another replaces the selection. */
  | 'single'
  /** Any number of rows, with a checkbox column and a select-all header box. */
  | 'multiple';

export type TableLayout =
  /** Real `<table>` semantics and column sizing. */
  | 'table'
  /** CSS grid/flex rows, which is what responsive column hiding and sticky columns need. */
  | 'flex';
export type TableSortOrder = 'asc' | 'desc' | null;

export interface TableDefaultSort {
  field: string;
  order: Exclude<TableSortOrder, null>;
}

export interface TableLoadEvent {
  first: number;
  rows: number;
  page: number;
  sortField: string | null;
  sortOrder: TableSortOrder;
}

export interface TablePageEvent {
  first: number;
  rows: number;
  page: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an unbound row type must stay usable in cell templates
export interface TableRowReorderEvent<T = any> {
  previousIndex: number;
  currentIndex: number;
  row: T;
}

export interface TableColumnReorderEvent {
  previousIndex: number;
  currentIndex: number;
}

export interface TableLoadMoreEvent {
  /** Index (within the sorted/paged data) of the last rendered row. */
  lastIndex: number;
}

const TABLE_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['data-sn-layout', 'data-sn-sticky-header', 'data-sn-responsive', 'aria-busy'],
  table: ['role'],
  header: ['role'],
  row: ['tabindex', 'aria-current', 'aria-selected', 'role'],
  cell: ['role'],
};

interface RowEntry<T> {
  row: T;
  /** Index of the row in the original `value` array. */
  index: number;
}

@Component({
  selector: 'sn-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, Checkbox, ProgressSpinner, CdkDropList, CdkDrag, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './table.html',
  styleUrl: './table.scss',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Table) }],
  host: {
    class: 'sn-table',
    '[class]': 'rootClassExtra()',
    '[class.sn-table--sticky-header]': 'stickyHeader()',
    '[class.sn-table--flex]': 'layout() === "flex"',
    '[class.sn-table--responsive]': 'responsive()',
    '[class.sn-table--loading]': 'loading()',
    '[attr.aria-busy]': 'loading() ? "true" : null',
    '[attr.data-sn-layout]': 'layout()',
    '[attr.data-sn-sticky-header]': 'stickyHeader() ? "" : null',
    '[attr.data-sn-responsive]': 'responsive() ? "" : null',
    '[style.max-height]': 'scrollHeight()',
    '(scroll)': 'onHostScroll()',
  },
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an unbound row type must stay usable in cell templates
export class Table<T = any> implements OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);
  private readonly rtl = snIsRtl();

  readonly value = model<readonly T[]>([]);
  readonly striped = input(snDefault(SN_TABLE_DEFAULTS, 'striped', false), {
    transform: booleanAttribute,
  });
  readonly hover = input(snDefault(SN_TABLE_DEFAULTS, 'hover', true), {
    transform: booleanAttribute,
  });
  readonly emptyMessage = input<string | undefined>(undefined);
  /** Covers the rows with a busy overlay, e.g. while a server page loads. */
  readonly loading = input(false, { transform: booleanAttribute });
  readonly caption = input<string | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  /** `table` (native, default) or `flex` (block/flexbox rows like Material's mat-table). */
  readonly layout = input<TableLayout>(snDefault(SN_TABLE_DEFAULTS, 'layout', 'table'));

  /** Single-selection by row click. */
  readonly selectable = input(false, { transform: booleanAttribute });
  readonly selectedIndex = model<number | null>(null);

  readonly selectionMode = input<TableSelectionMode>('none');
  readonly selection = model<T[]>([]);
  /**
   * With `selectionMode="multiple"`, let a row click select like a file list:
   * a plain click selects only that row, Ctrl/Cmd toggles it, and Shift selects
   * the range from the last plain or Ctrl click. The checkbox column keeps working.
   */
  readonly rowClickSelection = input(false, { transform: booleanAttribute });
  /** Row identity used by selection and expansion. Defaults to the row reference. */
  readonly rowKey = input<(row: T) => unknown>((row) => row);
  readonly selectAllLabel = input<string | undefined>(undefined);
  readonly selectRowLabel = input<string | undefined>(undefined);
  private readonly tableIntl = inject(SnTableIntl);
  protected readonly selectAllAriaLabel = computed(() => this.selectAllLabel() ?? this.tableIntl.selectAll);
  protected readonly selectRowAriaLabel = computed(() => this.selectRowLabel() ?? this.tableIntl.selectRow);
  private readonly rowSelection = snSelectionModel<T>(() => ({
    multiple: this.selectionMode() === 'multiple',
    unique: true,
    trackBy: this.rowKey(),
    orderBy: this.value,
    value: this.selection,
  }));

  readonly expandedKeys = model<unknown[]>([]);
  readonly expandRowLabel = input<string | undefined>(undefined);
  protected readonly expandRowAriaLabel = computed(() => this.expandRowLabel() ?? this.tableIntl.expandRow);
  /** When expansion is enabled, clicking anywhere on the row toggles it. */
  readonly expandRowOnClick = input(false, { transform: booleanAttribute });
  readonly rowExpand = output<{ row: T; expanded: boolean }>();

  readonly stickyHeader = input(snDefault(SN_TABLE_DEFAULTS, 'stickyHeader', false), {
    transform: booleanAttribute,
  });
  /**
   * Keep the table at its natural (content) width and scroll horizontally when
   * it can't fit, instead of squeezing columns. Ideal for wide tables on narrow
   * viewports. Override the floor with `--sn-table-min-width`.
   */
  readonly responsive = input(snDefault(SN_TABLE_DEFAULTS, 'responsive', false), {
    transform: booleanAttribute,
  });
  /** Max height of the scroll container (any CSS length). */
  readonly scrollHeight = input<string | undefined>(undefined);

  readonly page = model(0);
  readonly pageSize = model<number | undefined>(undefined);
  readonly server = input(false, { transform: booleanAttribute });
  readonly totalRecords = input(0);
  // eslint-disable-next-line @angular-eslint/no-output-native -- `load` never fires natively on a table host
  readonly load = output<TableLoadEvent>();

  readonly virtual = input(false, { transform: booleanAttribute });
  readonly rowHeight = input(snDefault(SN_TABLE_DEFAULTS, 'rowHeight', 40));
  readonly overscan = input(snDefault(SN_TABLE_DEFAULTS, 'overscan', 4));
  /** Emit `loadMore` when fewer than this many rows remain below the viewport. */
  readonly loadMoreThreshold = input(10);
  readonly hasMore = input(false, { transform: booleanAttribute });
  readonly loadMore = output<TableLoadMoreEvent>();

  readonly rowReorder = input(false, { transform: booleanAttribute });
  readonly columnReorder = input(false, { transform: booleanAttribute });
  readonly rowReordered = output<TableRowReorderEvent<T>>();
  readonly columnReordered = output<TableColumnReorderEvent>();

  readonly rowClick = output<{ row: T; index: number }>();
  readonly sortChange = output<{ field: string | null; order: TableSortOrder }>();

  protected readonly columns = contentChildren(TableColumn<T>);
  protected readonly expansionDef = contentChild(TableExpansionDef<T>);
  protected readonly headerCells = viewChildren<ElementRef<HTMLElement>>('headerCell');
  private readonly head = viewChild<ElementRef<HTMLElement>>('head');
  protected readonly intl = inject(SnCommonIntl);
  private readonly _el = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Column field currently sorted. Bind with `[(sortField)]` to read or set it from outside. */
  readonly sortField = model<string | null>(null);
  /** Direction of the current sort. Bind with `[(sortOrder)]`. */
  readonly sortOrder = model<TableSortOrder>(null);
  /**
   * Sort to fall back to when the header cycle ends. Without it the third click
   * clears the sort; with it, the third click restores this one.
   */
  readonly defaultSort = input<TableDefaultSort | null>(null);

  /** Column ids in display order once the user has dragged a column. */
  private readonly columnOrder = signal<string[] | null>(null);

  private readonly scrollTop = signal(0);
  private readonly viewportHeight = signal(0);
  /** Offset of the body from the host top, so the loading overlay leaves the header visible. */
  protected readonly loadingTop = signal(0);
  private _resizeObserver: ResizeObserver | null = null;
  private _lastLoadMoreLength = -1;

  readonly _id = snNextId('sn-table');

  constructor() {
    afterNextRender(() => {
      this.measureViewport();
      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(() => {
          this.measureViewport();
          this.measureStickyOffsets();
          this.measureLoadingTop();
        });
        this._resizeObserver.observe(this._el.nativeElement);
      }
    });

    afterRenderEffect(() => {
      if (this.loading()) untracked(() => this.measureLoadingTop());
    });

    afterRenderEffect(() => {
      this.displayColumns();
      this.renderedRows();
      untracked(() => {
        this.measureStickyOffsets();
        // Covers the case where the initial data doesn't fill the viewport,
        // so no scroll event will ever fire.
        this.checkLoadMore();
      });
    });
  }

  ngOnDestroy(): void {
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
  }

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
  protected readonly tableClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'table', false),
  );
  protected readonly captionClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'caption', false),
  );
  protected readonly headerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'header', false),
  );
  protected readonly rowClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'row', false),
  );
  protected readonly cellClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'cell', false),
  );

  readonly reservedAttrs = (section: string): readonly string[] =>
    TABLE_RESERVED_ATTRS[section] ?? [];

  protected readonly resolvedEmptyMessage = computed(
    () => this.emptyMessage() ?? this.intl.emptyMessage,
  );

  protected readonly displayColumns = computed(() => {
    const cols = this.columns();
    const order = this.columnOrder();
    if (!order) return [...cols];
    const byId = new Map(cols.map((c) => [c.columnId, c]));
    const ordered: TableColumn<T>[] = [];
    for (const id of order) {
      const col = byId.get(id);
      if (col) ordered.push(col);
    }
    for (const col of cols) {
      if (!ordered.includes(col)) ordered.push(col);
    }
    return ordered;
  });

  protected readonly hasExpansion = computed(() => !!this.expansionDef());
  protected readonly hasSelectColumn = computed(() => this.selectionMode() === 'multiple');

  protected readonly leadColumnCount = computed(
    () => (this.hasExpansion() ? 1 : 0) + (this.hasSelectColumn() ? 1 : 0),
  );

  protected readonly totalColumnCount = computed(
    () => this.leadColumnCount() + this.displayColumns().length,
  );

  protected readonly flexRole = computed(() => this.layout() === 'flex');

  protected readonly sortedRows = computed<RowEntry<T>[]>(() => {
    const rows = this.value().map((row, i) => ({ row, index: i }));
    const field = this.sortField();
    const order = this.sortOrder();

    if (this.server() || !field || !order) return rows;

    const col = this.columns().find((c) => c.field() === field);
    const mul = order === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      const va = col?.sortValue() ? col.sortValue()!(a.row) : (a.row as Record<string, unknown>)[field];
      const vb = col?.sortValue() ? col.sortValue()!(b.row) : (b.row as Record<string, unknown>)[field];

      if (va == null && vb == null) return 0;
      if (va == null) return mul;
      if (vb == null) return -mul;
      if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * mul;
      return String(va).localeCompare(String(vb), undefined, { numeric: true }) * mul;
    });
  });

  protected isSorted(column: TableColumn<T>): boolean {
    return this.sortField() === column.field() && this.sortOrder() !== null;
  }

  protected ariaSort(column: TableColumn<T>): string | null {
    if (!this.isSorted(column)) return null;
    return this.sortOrder() === 'asc' ? 'ascending' : 'descending';
  }

  protected cycleSort(column: TableColumn<T>): void {
    const field = column.field();
    const currentField = this.sortField();
    const currentOrder = this.sortOrder();

    let nextField: string | null;
    let nextOrder: TableSortOrder;

    if (currentField !== field) {
      nextField = field;
      nextOrder = 'asc';
    } else if (currentOrder === 'asc') {
      nextField = field;
      nextOrder = 'desc';
    } else {
      const fallback = this.defaultSort();
      nextField = fallback?.field ?? null;
      nextOrder = fallback?.order ?? null;
    }

    this.sortField.set(nextField);
    this.sortOrder.set(nextOrder);
    this.sortChange.emit({ field: nextField, order: nextOrder });
    if (this.server()) {
      this.page.set(0);
      this.emitLoad(0, this.effectiveRows(), 0);
    }
  }

  /** The client-side page to show, pulled back onto the last page when the data shrinks. */
  private readonly clientPage = computed(() => {
    const page = Math.max(0, this.page());
    const size = this.pageSize();
    if (!size || size <= 0) return page;
    const lastPage = Math.max(0, Math.ceil(this.sortedRows().length / size) - 1);
    return Math.min(page, lastPage);
  });

  // Empty data is skipped so a page restored before the rows arrive survives.
  private readonly syncClampedPage = effect(() => {
    if (this.server() || this.sortedRows().length === 0) return;
    const page = this.clientPage();
    if (page !== untracked(this.page)) this.page.set(page);
  });

  protected readonly pagedRows = computed<RowEntry<T>[]>(() => {
    const rows = this.sortedRows();
    if (this.server()) return rows;
    const size = this.pageSize();
    if (!size || size <= 0) return rows;
    const start = this.clientPage() * size;
    return rows.slice(start, start + size);
  });

  paginate(event: TablePageEvent): void {
    if (!this.server()) {
      this.page.set(event.page);
      this.pageSize.set(event.rows);
      return;
    }

    const rows = Math.max(1, event.rows);
    const pageCount = Math.max(1, Math.ceil(this.totalRecords() / rows));
    const page = Math.min(Math.max(0, event.page), pageCount - 1);
    this.page.set(page);
    this.pageSize.set(rows);
    this.emitLoad(page * rows, rows, page);
  }

  private effectiveRows(): number {
    return Math.max(1, this.pageSize() ?? this.value().length);
  }

  private emitLoad(first: number, rows: number, page: number): void {
    this.load.emit({
      first,
      rows,
      page,
      sortField: this.sortField(),
      sortOrder: this.sortOrder(),
    });
  }

  protected readonly windowRange = computed(() => {
    if (!this.virtual()) return null;
    const rowHeight = Math.max(1, this.rowHeight());
    const total = this.pagedRows().length;
    const overscan = this.overscan();
    const start = Math.max(0, Math.floor(this.scrollTop() / rowHeight) - overscan);
    const end = Math.min(
      total,
      Math.ceil((this.scrollTop() + this.viewportHeight()) / rowHeight) + overscan,
    );
    return { start, end };
  });

  protected readonly renderedRows = computed<RowEntry<T>[]>(() => {
    const range = this.windowRange();
    const rows = this.pagedRows();
    return range ? rows.slice(range.start, range.end) : rows;
  });

  protected readonly topSpacerHeight = computed(() => {
    const range = this.windowRange();
    return range ? range.start * this.rowHeight() : 0;
  });

  protected readonly bottomSpacerHeight = computed(() => {
    const range = this.windowRange();
    if (!range) return 0;
    return Math.max(0, (this.pagedRows().length - range.end) * this.rowHeight());
  });

  protected absoluteIndex(renderedIndex: number): number {
    const range = this.windowRange();
    return (range ? range.start : 0) + renderedIndex;
  }

  protected onHostScroll(): void {
    const el = this._el.nativeElement;
    this.scrollTop.set(el.scrollTop);
    this.viewportHeight.set(el.clientHeight);
    this.checkLoadMore();
  }

  private measureViewport(): void {
    const el = this._el.nativeElement;
    this.viewportHeight.set(el.clientHeight);
  }

  private measureLoadingTop(): void {
    const head = this.head()?.nativeElement;
    if (!head) return;
    const el = this._el.nativeElement;
    const top = head.getBoundingClientRect().bottom - el.getBoundingClientRect().top - el.clientTop + el.scrollTop;
    this.loadingTop.set(Math.max(0, top));
  }

  private checkLoadMore(): void {
    if (!this.hasMore()) return;
    const rows = this.pagedRows();
    if (rows.length === 0) return;
    const el = this._el.nativeElement;
    const remainingPx = el.scrollHeight - el.scrollTop - el.clientHeight;
    const thresholdPx = this.loadMoreThreshold() * Math.max(1, this.rowHeight());
    if (remainingPx <= thresholdPx && this._lastLoadMoreLength !== rows.length) {
      this._lastLoadMoreLength = rows.length;
      this.loadMore.emit({ lastIndex: rows.length - 1 });
    }
  }

  protected readonly stickyOffsets = signal<Record<string, number>>({});

  protected readonly hasStickyColumns = computed(() =>
    this.displayColumns().some((c) => c.sticky() !== undefined),
  );

  /**
   * The column's pinned edge on the inline axis, or null if it is not pinned.
   *
   * Everything downstream works in `start`/`end`, so a physical `left` becomes
   * `end` in RTL. That is not just a rename: the offsets accumulate outwards
   * from the pinned edge, and in RTL the column nearest the physical left is
   * the LAST one in DOM order, which is the direction the `end` walk takes.
   */
  protected stickySide(col: TableColumn<T>): 'start' | 'end' | null {
    const sticky = col.sticky();
    if (!sticky) return null;
    if (sticky === 'start' || sticky === 'end') return sticky;
    return sticky === (this.rtl() ? 'right' : 'left') ? 'start' : 'end';
  }

  protected stickyInlineStart(col: TableColumn<T>): number | null {
    if (this.stickySide(col) !== 'start') return null;
    return this.stickyOffsets()[col.columnId] ?? 0;
  }

  protected stickyInlineEnd(col: TableColumn<T>): number | null {
    if (this.stickySide(col) !== 'end') return null;
    return this.stickyOffsets()[col.columnId] ?? 0;
  }

  private measureStickyOffsets(): void {
    if (!this.hasStickyColumns()) {
      if (Object.keys(this.stickyOffsets()).length > 0) this.stickyOffsets.set({});
      return;
    }
    const cols = this.displayColumns();
    const cells = this.headerCells();
    const lead = this.leadColumnCount();
    const widths = new Map<string, number>();
    cols.forEach((col, i) => {
      const cell = cells[lead + i]?.nativeElement;
      if (cell) widths.set(col.columnId, cell.getBoundingClientRect().width);
    });

    const offsets: Record<string, number> = {};
    let start = 0;
    for (const col of cols) {
      if (this.stickySide(col) === 'start') {
        offsets[col.columnId] = start;
        start += widths.get(col.columnId) ?? 0;
      }
    }
    let end = 0;
    for (let i = cols.length - 1; i >= 0; i--) {
      const col = cols[i];
      if (this.stickySide(col) === 'end') {
        offsets[col.columnId] = end;
        end += widths.get(col.columnId) ?? 0;
      }
    }

    const current = this.stickyOffsets();
    const changed =
      Object.keys(offsets).length !== Object.keys(current).length ||
      Object.entries(offsets).some(([k, v]) => Math.abs((current[k] ?? -1) - v) > 0.5);
    if (changed) this.stickyOffsets.set(offsets);
  }

  private readonly selectedKeySet = computed(() => {
    const key = this.rowKey();
    return new Set(this.rowSelection.selected().map((row) => key(row)));
  });

  protected isRowSelected(row: T): boolean {
    return this.selectedKeySet().has(this.rowKey()(row));
  }

  protected readonly allSelected = computed(() => {
    const rows = this.pagedRows();
    if (rows.length === 0) return false;
    const keys = this.selectedKeySet();
    const key = this.rowKey();
    return rows.every((entry) => keys.has(key(entry.row)));
  });

  protected readonly someSelected = computed(() => {
    const keys = this.selectedKeySet();
    const key = this.rowKey();
    return this.pagedRows().some((entry) => keys.has(key(entry.row)));
  });

  protected toggleRowSelection(row: T): void {
    this.rowSelection.toggle(row);
  }

  private selectionAnchor: unknown = null;

  private readonly rowClickSelects = computed(
    () => this.selectionMode() === 'multiple' && this.rowClickSelection(),
  );

  protected selectRowFromPointer(entry: RowEntry<T>, event: KeyboardEvent | MouseEvent): void {
    const keyOf = this.rowKey();
    const additive = event.ctrlKey || event.metaKey;
    const rows = this.pagedRows();
    const anchorIndex = rows.findIndex((candidate) => keyOf(candidate.row) === this.selectionAnchor);

    if (event.shiftKey && anchorIndex !== -1) {
      const clicked = rows.findIndex((candidate) => keyOf(candidate.row) === keyOf(entry.row));
      const range = rows
        .slice(Math.min(anchorIndex, clicked), Math.max(anchorIndex, clicked) + 1)
        .map((candidate) => candidate.row);
      this.rowSelection.set(additive ? [...this.rowSelection.selected(), ...range] : range);
      return;
    }

    this.selectionAnchor = keyOf(entry.row);
    if (additive) {
      this.rowSelection.toggle(entry.row);
    } else {
      this.rowSelection.set([entry.row]);
    }
  }

  protected suppressRangeTextSelection(event: MouseEvent): void {
    if (event.shiftKey && this.rowClickSelects()) event.preventDefault();
  }

  protected toggleAll(): void {
    const rows = this.pagedRows();
    if (this.allSelected()) {
      this.rowSelection.deselect(...rows.map((entry) => entry.row));
    } else {
      this.rowSelection.select(...rows.map((entry) => entry.row));
    }
  }

  protected isRowExpanded(row: T): boolean {
    const rowK = this.rowKey()(row);
    return this.expandedKeys().some((k) => k === rowK);
  }

  protected toggleRowExpansion(row: T): void {
    const rowK = this.rowKey()(row);
    const current = this.expandedKeys();
    const expanded = !current.some((k) => k === rowK);
    this.expandedKeys.set(
      expanded ? [...current, rowK] : current.filter((k) => k !== rowK),
    );
    this.rowExpand.emit({ row, expanded });
  }

  protected expansionRowId(entry: RowEntry<T>): string {
    return `${this._id}-expansion-${entry.index}`;
  }

  protected onRowClick(entry: RowEntry<T>, event: MouseEvent): void {
    if (this.selectable()) {
      this.selectedIndex.set(entry.index);
    }
    if (this.selectionMode() === 'single') {
      this.rowSelection.toggle(entry.row);
    }
    if (this.rowClickSelects()) {
      this.selectRowFromPointer(entry, event);
    }
    if (this.expandRowOnClick() && this.hasExpansion()) {
      this.toggleRowExpansion(entry.row);
    }
    this.rowClick.emit({ row: entry.row, index: entry.index });
  }

  protected onRowKeydown(event: KeyboardEvent, entry: RowEntry<T>): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.selectable()) {
        this.selectedIndex.set(entry.index);
      }
      if (this.selectionMode() === 'single') {
        this.rowSelection.toggle(entry.row);
      }
      if (this.rowClickSelects()) {
        this.selectRowFromPointer(entry, event);
      }
      if (this.expandRowOnClick() && this.hasExpansion()) {
        this.toggleRowExpansion(entry.row);
      }
      this.rowClick.emit({ row: entry.row, index: entry.index });
    }
  }

  protected readonly rowsInteractive = computed(
    () =>
      this.selectable() ||
      this.selectionMode() === 'single' ||
      this.rowClickSelects() ||
      (this.expandRowOnClick() && this.hasExpansion()),
  );

  protected isSelected(index: number): boolean {
    return this.selectedIndex() === index;
  }

  protected isRowHighlighted(entry: RowEntry<T>): boolean {
    return (
      (this.selectable() && this.selectedIndex() === entry.index) ||
      (this.selectionMode() !== 'none' && this.isRowSelected(entry.row))
    );
  }

  protected isStripedRow(displayIndex: number): boolean {
    return this.striped() && displayIndex % 2 === 1;
  }

  protected getCellValue(row: T, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }

  protected trackRow = (entry: RowEntry<T>): unknown => this.rowKey()(entry.row);

  protected onRowDrop(event: CdkDragDrop<unknown>): void {
    if (event.previousIndex === event.currentIndex) return;
    const rendered = this.renderedRows();
    const fromEntry = rendered[event.previousIndex];
    const toEntry = rendered[event.currentIndex];
    if (!fromEntry || !toEntry) return;
    const from = fromEntry.index;
    const to = toEntry.index;
    const arr = [...this.value()];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    this.value.set(arr);
    this.rowReordered.emit({ previousIndex: from, currentIndex: to, row: moved });
  }

  protected onColumnDrop(event: CdkDragDrop<unknown>): void {
    if (event.previousIndex === event.currentIndex) return;
    const cols = [...this.displayColumns()];
    moveItemInArray(cols, event.previousIndex, event.currentIndex);
    this.columnOrder.set(cols.map((c) => c.columnId));
    this.columnReordered.emit({
      previousIndex: event.previousIndex,
      currentIndex: event.currentIndex,
    });
  }
}
