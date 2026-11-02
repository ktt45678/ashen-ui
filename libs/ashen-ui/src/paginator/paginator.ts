import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { type ConnectedPosition } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import {
  SnIconRegistry,
  SnPaginatorIntl,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snDefault,
  snDefaults,
  snIsRtl,
} from 'ashen-ui/core';
import { snOverlayPanel } from 'ashen-ui/cdk';
import { SN_PAGINATOR_DEFAULTS, type PaginatorJustify } from './paginator-defaults';
import { Button } from 'ashen-ui/button';
import { Icon } from 'ashen-ui/icon';
import {
  PaginatorReport,
  type PaginatorReportContext,
  type PaginatorReportFormatter,
} from './paginator-report';

export interface PageChangeEvent {
  page: number;
  rows: number;
  first: number;
}

const PANEL_OFFSET = 4;

const JUMP_PANEL_POSITIONS = [
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: PANEL_OFFSET },
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -PANEL_OFFSET },
] satisfies readonly ConnectedPosition[];

const ROWS_PANEL_POSITIONS = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: PANEL_OFFSET },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -PANEL_OFFSET },
] satisfies readonly ConnectedPosition[];

const PAGINATOR_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  nav: ['aria-label'],
  rowsTrigger: ['type', 'aria-label', 'aria-haspopup', 'aria-expanded'],
  first: ['aria-label', 'disabled'],
  prev: ['aria-label', 'disabled'],
  next: ['aria-label', 'disabled'],
  last: ['aria-label', 'disabled'],
  ellipsis: ['type', 'aria-label', 'aria-haspopup', 'aria-expanded'],
  page: ['type', 'aria-label', 'aria-current'],
  jumpPanel: ['role', 'aria-label'],
  rowsPanel: ['role', 'aria-label'],
};

@Component({
  selector: 'sn-paginator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Icon, NgTemplateOutlet, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './paginator.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Paginator) }],
  host: {
    class: 'sn-paginator',
    '[class]': 'rootClassExtra()',
    '[class.sn-paginator--report-start]': "reportPosition() === 'start'",
    '[class.sn-paginator--packed]': "justify() !== 'between'",
    '[attr.data-sn-justify]': 'justify()',
  },
})
export class Paginator implements OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly page = input<number>(0);
  readonly totalRecords = input<number>(0);
  readonly rows = input<number>(snDefault(SN_PAGINATOR_DEFAULTS, 'rows', 10));
  readonly rowsPerPageOptions = input<number[] | undefined>(
    snDefaults(SN_PAGINATOR_DEFAULTS)?.rowsPerPageOptions,
  );
  readonly siblings = input<number>(snDefault(SN_PAGINATOR_DEFAULTS, 'siblings', 1));
  readonly showEdges = input(snDefault(SN_PAGINATOR_DEFAULTS, 'showEdges', true), {
    transform: booleanAttribute,
  });
  readonly pageLinkSize = input<number>(snDefault(SN_PAGINATOR_DEFAULTS, 'pageLinkSize', 0));
  readonly reportPosition = input<'start' | 'end'>(
    snDefault(SN_PAGINATOR_DEFAULTS, 'reportPosition', 'end'),
  );
  readonly justify = input<PaginatorJustify>(snDefault(SN_PAGINATOR_DEFAULTS, 'justify', 'between'));
  readonly showRowsLabel = input(snDefault(SN_PAGINATOR_DEFAULTS, 'showRowsLabel', true), {
    transform: booleanAttribute,
  });
  readonly showReport = input(snDefault(SN_PAGINATOR_DEFAULTS, 'showReport', true), {
    transform: booleanAttribute,
  });
  readonly ariaLabel = input('');
  readonly firstLabel = input('');
  readonly prevLabel = input('');
  readonly nextLabel = input('');
  readonly lastLabel = input('');
  readonly jumpLabel = input('');
  readonly rowsPerPageLabel = input('');
  readonly reportFormatter = input<PaginatorReportFormatter>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly pageChange = output<PageChangeEvent>();

  private readonly intl = inject(SnPaginatorIntl);
  private readonly rtl = snIsRtl();
  private readonly vcr = inject(ViewContainerRef);

  protected readonly jumpPanelTpl = viewChild<TemplateRef<unknown>>('jumpPanelTpl');
  protected readonly rowsPanelTpl = viewChild<TemplateRef<unknown>>('rowsPanelTpl');
  protected readonly reportTemplate = contentChild(PaginatorReport);

  protected readonly jumpPanelOpen = signal(false);
  protected readonly rowsPanelOpen = signal(false);
  protected readonly jumpClosing = signal(false);
  protected readonly rowsClosing = signal(false);

  private readonly jumpTriggerEl = signal<HTMLElement | null>(null);
  private readonly rowsTriggerEl = signal<HTMLElement | null>(null);
  private jumpSubs = new Subscription();
  private rowsSubs = new Subscription();

  private readonly jumpPanel = snOverlayPanel(() => ({
    origin: this.jumpTriggerEl(),
    template: this.jumpPanelTpl(),
    viewContainerRef: this.vcr,
    positions: JUMP_PANEL_POSITIONS,
    hasBackdrop: true,
    backdropClass: 'sn-paginator-overlay-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    animated: true,
  }));

  private readonly rowsPanel = snOverlayPanel(() => ({
    origin: this.rowsTriggerEl(),
    template: this.rowsPanelTpl(),
    viewContainerRef: this.vcr,
    positions: ROWS_PANEL_POSITIONS,
    hasBackdrop: true,
    backdropClass: 'sn-paginator-overlay-backdrop',
    closeOnEscape: false,
    closeOnBackdrop: false,
    restoreFocus: false,
    animated: true,
  }));

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalRecords() / Math.max(1, this.rows()))),
  );

  protected readonly navLabel = computed(() => this.ariaLabel() || this.intl.label);
  protected readonly firstAriaLabel = computed(() => this.firstLabel() || this.intl.first);
  protected readonly prevAriaLabel = computed(() => this.prevLabel() || this.intl.previous);
  protected readonly nextAriaLabel = computed(() => this.nextLabel() || this.intl.next);
  protected readonly lastAriaLabel = computed(() => this.lastLabel() || this.intl.last);

  // The controls sit in a flex row, so RTL reverses their order for free. The
  // glyphs inside them do not reverse, and all four point along the page order.
  protected readonly firstIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'page-last' : 'page-first'),
  );
  protected readonly prevIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-right' : 'chevron-left'),
  );
  protected readonly nextIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-left' : 'chevron-right'),
  );
  protected readonly lastIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'page-first' : 'page-last'),
  );
  protected readonly jumpAriaLabel = computed(() => this.jumpLabel() || this.intl.jump);
  protected readonly rowsPerPageAriaLabel = computed(
    () => this.rowsPerPageLabel() || this.intl.rowsPerPage,
  );

  protected readonly isFirst = computed(() => this.page() <= 0);
  protected readonly isLast = computed(() => this.page() >= this.totalPages() - 1);

  protected readonly firstRecord = computed(() => this.page() * this.rows());
  protected readonly lastRecord = computed(() =>
    Math.min(this.firstRecord() + this.rows(), this.totalRecords()),
  );

  protected readonly reportContext = computed<PaginatorReportContext>(() => ({
    first: this.totalRecords() === 0 ? 0 : this.firstRecord() + 1,
    last: this.lastRecord(),
    total: this.totalRecords(),
    page: this.page(),
    pageCount: this.totalPages(),
    rows: this.rows(),
  }));

  protected readonly report = computed(() => {
    const context = this.reportContext();
    return (
      this.reportFormatter()?.(context) ??
      this.intl.report(context.first, context.last, context.total)
    );
  });

  protected readonly pageItems = computed<Array<number | '…'>>(() => {
    const total = this.totalPages();
    const cur = this.page();

    // Fixed-window mode: up to `pageLinkSize` links centred on the current page, no ellipsis or forced edges. Overrides `siblings`.
    const linkSize = this.pageLinkSize();
    if (linkSize > 0) {
      const size = Math.min(linkSize, total);
      const start = Math.min(Math.max(0, cur - Math.floor(size / 2)), total - size);
      return Array.from({ length: size }, (_, i) => start + i);
    }

    const s = this.siblings();
    const items: Array<number | '…'> = [];

    const from = Math.max(0, cur - s);
    const to = Math.min(total - 1, cur + s);

    if (from > 0) {
      items.push(0);
      if (from > 1) items.push('…');
    }
    for (let i = from; i <= to; i++) items.push(i);
    if (to < total - 1) {
      if (to < total - 2) items.push('…');
      items.push(total - 1);
    }
    return items;
  });

  protected readonly allPages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i),
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly pagesClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'pages', false),
  );

  protected readonly reportClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'report', false),
  );

  protected readonly rowsSelectClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'rowsSelect', false),
  );

  protected readonly navClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'nav', false),
  );

  protected readonly rowsTriggerClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'rowsTrigger', false),
  );

  protected readonly jumpPanelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'jumpPanel', false),
  );

  protected readonly rowsPanelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'rowsPanel', false),
  );

  readonly reservedAttrs = (section: string): readonly string[] =>
    PAGINATOR_RESERVED_ATTRS[section] ?? [];

  protected isEllipsis(item: number | '…'): item is '…' {
    return item === '…';
  }

  protected pageClass(p: number): string {
    const base = resolveSnClass(this.snClass(), 'page', false);
    const cur = p === this.page() ? resolveSnClass(this.snClass(), 'current', false) : '';
    return [base, cur].filter(Boolean).join(' ');
  }

  protected goTo(p: number): void {
    const clamped = Math.min(Math.max(p, 0), this.totalPages() - 1);
    if (clamped === this.page()) return;
    this.pageChange.emit({ page: clamped, rows: this.rows(), first: clamped * this.rows() });
  }

  protected selectPage(p: number): void {
    this.closeJumpPanel();
    this.goTo(p);
  }

  protected onRowsOptionClick(value: number): void {
    this.closeRowsPanel();
    this.pageChange.emit({ page: 0, rows: value, first: 0 });
  }

  protected onRowsChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageChange.emit({ page: 0, rows: value, first: 0 });
  }

  protected pageLabel(p: number): string {
    return this.intl.page(p + 1);
  }

  protected openJumpPanel(triggerEl: HTMLElement): void {
    if (this.jumpPanelOpen()) {
      this.closeJumpPanel();
      return;
    }
    this.jumpTriggerEl.set(triggerEl);
    if (!this.jumpPanel.open()) return;
    this.jumpPanelOpen.set(true);

    this.jumpSubs.add(
      this.jumpPanel.backdropClick.subscribe(() => this.closeJumpPanel()),
    );
    this.jumpSubs.add(
      this.jumpPanel.keydown.subscribe((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeJumpPanel();
        }
      }),
    );
    this.jumpSubs.add(this.jumpPanel.afterClosed.subscribe(() => this.finalizeJumpClose()));
  }

  protected closeJumpPanel(): void {
    if (!this.jumpPanelOpen() || this.jumpClosing()) return;
    this.jumpClosing.set(true);
    this.jumpPanel.close();
  }

  private finalizeJumpClose(): void {
    this.jumpClosing.set(false);
    this.jumpPanelOpen.set(false);
    this.jumpTriggerEl()?.focus();
    this.jumpTriggerEl.set(null);
    this.jumpSubs.unsubscribe();
    this.jumpSubs = new Subscription();
  }

  protected openRowsPanel(triggerEl: HTMLElement): void {
    if (this.rowsPanelOpen()) {
      this.closeRowsPanel();
      return;
    }
    this.rowsTriggerEl.set(triggerEl);
    if (!this.rowsPanel.open()) return;
    this.rowsPanelOpen.set(true);

    this.rowsSubs.add(
      this.rowsPanel.backdropClick.subscribe(() => this.closeRowsPanel()),
    );
    this.rowsSubs.add(
      this.rowsPanel.keydown.subscribe((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeRowsPanel();
          this.rowsTriggerEl()?.focus();
        }
      }),
    );
    this.rowsSubs.add(this.rowsPanel.afterClosed.subscribe(() => this.finalizeRowsClose()));
  }

  protected closeRowsPanel(): void {
    if (!this.rowsPanelOpen() || this.rowsClosing()) return;
    this.rowsClosing.set(true);
    this.rowsPanel.close();
  }

  private finalizeRowsClose(): void {
    this.rowsClosing.set(false);
    this.rowsPanelOpen.set(false);
    this.rowsTriggerEl.set(null);
    this.rowsSubs.unsubscribe();
    this.rowsSubs = new Subscription();
  }

  ngOnDestroy(): void {
    this.jumpSubs.unsubscribe();
    this.rowsSubs.unsubscribe();
    this.jumpPanel.dispose();
    this.rowsPanel.dispose();
  }
}
