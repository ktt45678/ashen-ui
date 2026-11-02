import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { VirtualScroller } from 'ashen-ui/virtual-scroller';
import { VirtualScrollerItemDef } from 'ashen-ui/virtual-scroller';
import { DocExample } from '../../../shared/doc-example/doc-example';
import { DocApi } from '../../../shared/doc-api/doc-api';

interface Contact {
  name: string;
  email: string;
}

@Component({
  selector: 'app-virtual-scroller-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'doc-page' },
  imports: [VirtualScroller, VirtualScrollerItemDef, DocExample, DocApi],
  templateUrl: './virtual-scroller-page.html',
  styleUrl: './virtual-scroller-page.scss',
})
export class VirtualScrollerPage {
  protected readonly bigList = Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`);

  protected readonly contacts: Contact[] = Array.from({ length: 5000 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }));

  private static readonly PAGE_SIZE = 100;
  private static readonly MAX_ITEMS = 500;

  protected readonly infiniteItems = signal(
    Array.from({ length: VirtualScrollerPage.PAGE_SIZE }, (_, i) => `Item ${i + 1}`),
  );

  protected readonly infiniteHasMore = computed(
    () => this.infiniteItems().length < VirtualScrollerPage.MAX_ITEMS,
  );

  protected onLoadMore(): void {
    const current = this.infiniteItems();
    const next = Array.from(
      { length: VirtualScrollerPage.PAGE_SIZE },
      (_, i) => `Item ${current.length + i + 1}`,
    );
    this.infiniteItems.set([...current, ...next]);
  }

}
