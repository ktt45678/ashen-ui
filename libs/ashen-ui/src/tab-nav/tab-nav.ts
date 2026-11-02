import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChildren,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { SnIconRegistry, snIsRtl, snRenderGate } from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { TabLink } from './tab-link';

export type TabNavOrientation = 'horizontal' | 'vertical';

/**
 * A bar of navigation links styled as tabs, for routed pages where each tab is
 * a URL. Unlike `sn-tabs` it owns no panels: the router outlet (or the app)
 * shows the content.
 *
 * Horizontal bars scroll when the links outgrow the container and show a
 * scroll control at each end only while they overflow. Vertical bars stack
 * the links as a side menu.
 */
@Component({
  selector: 'nav[snTabNav]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  templateUrl: './tab-nav.html',
  host: {
    class: 'sn-tab-nav',
    '[class.sn-tab-nav-vertical]': 'vertical()',
    '[class.sn-tab-nav-animate]': '_animate()',
  },
})
export class TabNav {
  readonly orientation = input<TabNavOrientation>('horizontal');
  /** Let a horizontal bar scroll instead of squeezing its links. */
  readonly scrollable = input(true, { transform: booleanAttribute });

  protected readonly _animate = snRenderGate();
  protected readonly icons = inject(SnIconRegistry);
  private readonly destroyRef = inject(DestroyRef);
  private readonly rtl = snIsRtl();
  private resizeObserver: ResizeObserver | null = null;

  private readonly links = contentChildren(TabLink, { descendants: true });
  private readonly listRef = viewChild<ElementRef<HTMLElement>>('listEl');

  protected readonly vertical = computed(() => this.orientation() === 'vertical');
  protected readonly scrolling = computed(() => this.scrollable() && !this.vertical());
  private readonly activeLink = computed(() => this.links().find((link) => link.isActive()));

  protected readonly overflowing = signal(false);
  protected readonly canScrollBack = signal(false);
  protected readonly canScrollForward = signal(false);
  protected readonly indicatorLeft = signal(0);
  protected readonly indicatorWidth = signal(0);
  protected readonly indicatorVisible = signal(false);

  protected readonly backIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-right' : 'chevron-left'),
  );
  protected readonly forwardIcon = computed(() =>
    this.icons.resolve(this.rtl() ? 'chevron-left' : 'chevron-right'),
  );

  constructor() {
    afterRenderEffect(() => {
      const active = this.activeLink();
      const links = this.links();
      const vertical = this.vertical();
      untracked(() => {
        for (const link of links) this.resizeObserver?.observe(link.element);
        this.updateIndicator(vertical ? undefined : active);
        this.updateScrollState();
        if (this.scrolling()) active?.element.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      });
    });

    afterNextRender(() => this.watchOverflow());
  }

  /** A resize covers the container changing and a link's label or font changing. */
  private watchOverflow(): void {
    this.updateScrollState();
    const el = this.listRef()?.nativeElement;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => {
      this.updateScrollState();
      this.updateIndicator(this.vertical() ? undefined : this.activeLink());
    });
    observer.observe(el);
    for (const link of this.links()) observer.observe(link.element);
    this.resizeObserver = observer;
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  protected updateScrollState(): void {
    const el = this.listRef()?.nativeElement;
    if (!el || !this.scrolling()) {
      this.overflowing.set(false);
      return;
    }
    // In RTL scrollLeft runs from -(scrollWidth - clientWidth) to 0.
    const travelled = Math.abs(el.scrollLeft);
    const total = el.scrollWidth - el.clientWidth;
    this.overflowing.set(total > 1);
    this.canScrollBack.set(travelled > 1);
    this.canScrollForward.set(travelled < total - 1);
  }

  /** `-1` scrolls back along the reading direction, `1` forward. */
  protected scrollLinks(direction: -1 | 1): void {
    const el = this.listRef()?.nativeElement;
    if (!el) return;
    const inline = direction * (this.rtl() ? -1 : 1);
    el.scrollBy({ left: el.clientWidth * 0.75 * inline, behavior: 'smooth' });
  }

  private updateIndicator(link: TabLink | undefined): void {
    if (!link) {
      this.indicatorVisible.set(false);
      return;
    }
    this.indicatorLeft.set(link.element.offsetLeft);
    this.indicatorWidth.set(link.element.offsetWidth);
    this.indicatorVisible.set(true);
  }
}
