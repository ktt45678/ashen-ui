import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  contentChild,
  input,
  output,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll } from '@angular/cdk/scrolling';
import { type SnClass, resolveSnClass } from 'ashen-ui/core';
import { VirtualScrollerItemDef } from './virtual-scroller-item-def';

export interface VirtualScrollerLoadMoreEvent {
  /** Index of the last item currently scrolled into range. */
  lastIndex: number;
}

@Component({
  selector: 'sn-virtual-scroller',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, CdkVirtualScrollViewport, CdkVirtualForOf, CdkFixedSizeVirtualScroll],
  templateUrl: './virtual-scroller.html',
  styleUrl: './virtual-scroller.scss',
  host: {
    class: 'sn-virtual-scroller',
    '[class]': 'rootClassExtra()',
  },
})
export class VirtualScroller<T = unknown> {
  readonly items = input<readonly T[]>([]);
  readonly itemHeight = input<number>(36);
  readonly height = input<number>(240);
  readonly overscan = input<number>(4);
  /** Emit `loadMore` while more items are available (infinite mode). */
  readonly hasMore = input(false, { transform: booleanAttribute });
  /** How many items from the end triggers `loadMore`. */
  readonly loadMoreThreshold = input<number>(10);
  readonly snClass = input<SnClass>();

  /** Fires when scrolling approaches the end of the list (guarded per items length). */
  readonly loadMore = output<VirtualScrollerLoadMoreEvent>();

  protected readonly itemDef = contentChild(VirtualScrollerItemDef);

  private _lastLoadMoreLength = -1;

  protected onScrolledIndexChange(index: number): void {
    if (!this.hasMore()) return;
    const total = this.items().length;
    if (total === 0 || this._lastLoadMoreLength === total) return;
    const visible = Math.ceil(this.height() / this.itemHeight());
    const lastIndex = Math.min(total - 1, index + visible - 1);
    if (lastIndex >= total - this.loadMoreThreshold()) {
      this._lastLoadMoreLength = total;
      this.loadMore.emit({ lastIndex });
    }
  }

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly itemClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'item', false),
  );

  protected readonly minBufferPx = computed(() => this.overscan() * this.itemHeight());

  protected readonly maxBufferPx = computed(() => 2 * this.overscan() * this.itemHeight());
}
