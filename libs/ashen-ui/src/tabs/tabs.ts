import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  booleanAttribute,
  computed,
  contentChildren,
  effect,
  forwardRef,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { type FocusableOption } from '@angular/cdk/a11y';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snIsRtl,
  snRenderGate,
} from 'ashen-ui/core';
import { snListNavigator } from 'ashen-ui/cdk';
import { Icon } from 'ashen-ui/icon';
import { SN_TABS } from './tabs-token';
import { Tab } from './tab';

const TABS_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  list: ['role'],
  indicator: ['aria-hidden'],
  panel: ['role', 'id', 'aria-labelledby', 'tabindex'],
};

@Component({
  selector: 'sn-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, Icon, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './tabs.html',
  providers: [
    {
      provide: SN_TABS,
      useFactory: (self: Tabs) => self.context,
      deps: [Tabs],
    },
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Tabs) },
  ],
  host: {
    class: 'sn-tabs',
    '[class.sn-tabs-animate]': '_animate()',
    '[class]': 'rootClassExtra()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class Tabs implements SnPartSource {
  readonly selectedIndex = model(0);
  /**
   * The selected tab's `value`, for apps that identify a tab by something
   * stable rather than by its position. Interchangeable with `selectedIndex`:
   * writing either moves the selection and the other follows.
   *
   * A value no tab declares is kept but ignored, so a value that arrives
   * before its tab still takes effect once the tab appears. A tab with no
   * `value` of its own leaves this untouched when it is selected.
   */
  readonly value = model<unknown>(undefined);
  /**
   * Let the tab list scroll when it outgrows its container, instead of the
   * buttons squeezing. Adds a scroll control at each end.
   */
  readonly scrollable = input(false, { transform: booleanAttribute });
  protected readonly _animate = snRenderGate();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    TABS_RESERVED_ATTRS[section] ?? [];

  protected readonly icons = inject(SnIconRegistry);
  private readonly destroyRef = inject(DestroyRef);
  private resizeObserver: ResizeObserver | null = null;
  private readonly rtl = snIsRtl();

  protected readonly tabItems = contentChildren(Tab);
  protected readonly tabButtons = viewChildren<ElementRef<HTMLButtonElement>>('tabBtn');
  protected readonly listRef = viewChild<ElementRef<HTMLElement>>('tabListEl');

  protected readonly canScrollBack = signal(false);
  protected readonly canScrollForward = signal(false);

  // The controls point along the reading direction, so "back" is the one on the
  // leading edge either way.
  protected readonly backIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-right' : 'chevron-left'),
  );
  protected readonly forwardIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-left' : 'chevron-right'),
  );

  private readonly focusableTabs = computed(
    () => this.tabItems() as unknown as FocusableOption[],
  );

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly listClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'list', false),
  );

  protected readonly indicatorClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'indicator', false),
  );

  protected readonly panelClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'panel', false),
  );

  /**
   * The index the write-back effect last saw, so it can tell a real move from
   * its own first run. `null` until that first run.
   */
  private lastIndex: number | null = null;

  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorVisible = signal(false);

  private readonly navigator = snListNavigator({
    items: this.focusableTabs,
    orientation: 'horizontal',
    wrap: true,
    homeAndEnd: true,
    skipPredicate: (item) => (item as Tab).disabled,
  });

  readonly context = {
    selectedIndex: this.selectedIndex.asReadonly(),
    selectTab: (index: number) => {
      if (index >= 0 && index < this.tabItems().length) {
        const tab = this.tabItems()[index];
        if (!tab.disabled) {
          this.selectedIndex.set(index);
        }
      }
    },
    focusTab: (tabId: string) => {
      const index = this.tabItems().findIndex((t) => t.tabId === tabId);
      this.tabButtons()[index]?.nativeElement.focus();
    },
    registerTab: (_tabId: string, _buttonId: string) => {},
    unregisterTab: (_tabId: string) => {},
  };

  constructor() {
    effect(() => {
      const wanted = this.value();
      const tabs = this.tabItems();
      if (wanted === undefined) return;
      const index = tabs.findIndex((t) => t.value() === wanted);
      // A value no tab claims, or one belonging to a disabled tab, is left
      // sitting there. Tabs declared later are still free to claim it.
      if (index === -1 || tabs[index].disabled) return;
      untracked(() => this.selectedIndex.set(index));
    });

    effect(() => {
      const idx = this.selectedIndex();
      const tabs = this.tabItems();
      const moved = this.lastIndex !== null && this.lastIndex !== idx;
      this.lastIndex = idx;
      // Untracked: setting the active item also reads it, which would re-run this effect on every key move.
      untracked(() => {
        this.navigator.setActiveItem(idx);
        const declared = tabs[idx]?.value();
        // Write only when the selection moved or nobody asked for one. Not on the first run, where the value may wait for a tab that does not exist yet.
        if (declared !== undefined && (moved || this.value() === undefined)) {
          this.value.set(declared);
        }
      });
      this.updateIndicator();
      this.observeTabButtons();
      this.scrollSelectedIntoView();
    });

    afterNextRender(() => {
      this.updateIndicator();
      this.watchOverflow();
    });
  }

  /**
   * Keep the scroll state and the indicator current. A scroll event covers the
   * user's own scrolling; a resize covers the container changing, tabs being
   * added or removed, and a tab's own width changing (a web font swapping in,
   * a new label), none of which fires one.
   */
  private watchOverflow(): void {
    this.updateScrollState();
    const el = this.listRef()?.nativeElement;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      this.updateScrollState();
      this.updateIndicator();
    });
    observer.observe(el);
    this.resizeObserver = observer;
    this.observeTabButtons();
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private observeTabButtons(): void {
    for (const button of this.tabButtons()) this.resizeObserver?.observe(button.nativeElement);
  }

  protected updateScrollState(): void {
    const el = this.listRef()?.nativeElement;
    if (!el) return;
    // In RTL scrollLeft runs from negative to 0, so the absolute value is the distance from the inline start.
    const travelled = Math.abs(el.scrollLeft);
    const total = el.scrollWidth - el.clientWidth;
    this.canScrollBack.set(travelled > 1);
    this.canScrollForward.set(travelled < total - 1);
  }

  /** `-1` scrolls back along the reading direction, `1` forward. */
  protected scrollTabs(direction: -1 | 1): void {
    const el = this.listRef()?.nativeElement;
    if (!el) return;
    const inline = direction * (this.rtl() ? -1 : 1);
    el.scrollBy({ left: el.clientWidth * 0.75 * inline, behavior: 'smooth' });
  }

  private scrollSelectedIntoView(): void {
    if (!this.scrollable()) return;
    const button = this.tabButtons()[this.selectedIndex()]?.nativeElement;
    // Optional call: jsdom leaves scrollIntoView undefined, and this is a
    // nicety rather than part of the contract.
    button?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  }

  protected selectAndFocus(index: number): void {
    const tab = this.tabItems()[index];
    if (!tab?.disabled) {
      this.selectedIndex.set(index);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.navigator.onKeydown(event)) {
      event.preventDefault();
      const activeIndex = this.navigator.activeIndex();
      if (activeIndex != null) {
        const tab = this.tabItems()[activeIndex];
        if (tab && !tab.disabled) {
          this.selectedIndex.set(activeIndex);
        }
      }
    }
  }

  private updateIndicator(): void {
    const buttons = this.tabButtons();
    const idx = this.selectedIndex();
    if (!buttons || buttons.length === 0) {
      this.indicatorVisible.set(false);
      return;
    }
    const btnRef = buttons[idx];
    if (!btnRef) {
      this.indicatorVisible.set(false);
      return;
    }
    const el = btnRef.nativeElement;
    this.indicatorLeft.set(el.offsetLeft);
    this.indicatorWidth.set(el.offsetWidth);
    this.indicatorVisible.set(true);
  }
}
