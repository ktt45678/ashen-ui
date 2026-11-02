import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { VirtualScroller } from './virtual-scroller';
import { VirtualScrollerItemDef } from './virtual-scroller-item-def';

function flushViewport(fix: ReturnType<typeof TestBed.createComponent>): void {
  const de = fix.debugElement.query(By.directive(CdkVirtualScrollViewport));
  if (de) {
    (de.componentInstance as CdkVirtualScrollViewport).checkViewportSize();
  }
  fix.detectChanges();
}

const ITEMS_10K = Array.from({ length: 10000 }, (_, i) => `Row ${i + 1}`);

@Component({
  template: `<sn-virtual-scroller [items]="items" [height]="240" [itemHeight]="36" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller],
})
class BasicHost {
  items = ITEMS_10K;
}

@Component({
  template: `
    <sn-virtual-scroller [items]="items" [height]="240" [itemHeight]="36">
      <ng-template snItemDef let-item let-i="index">
        <div class="custom-row">{{ item }}-{{ i }}</div>
      </ng-template>
    </sn-virtual-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller, VirtualScrollerItemDef],
})
class CustomTplHost {
  items = ['Alpha', 'Beta', 'Gamma'];
}

@Component({
  template: `<sn-virtual-scroller [items]="items" [height]="300" [itemHeight]="48" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller],
})
class CustomSizesHost {
  items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);
}

@Component({
  template: `<sn-virtual-scroller [items]="items()" [height]="240" [itemHeight]="36" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller],
})
class MutableHost {
  readonly items = signal<string[]>(['A', 'B', 'C']);
}

@Component({
  template: `<sn-virtual-scroller [items]="items" [height]="240" [itemHeight]="36" [snClass]="cls" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller],
})
class SnClassHost {
  items = ['X'];
  cls = 'my-extra';
}

describe('VirtualScroller', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders the viewport with the given height', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const viewport: HTMLElement = fix.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    expect(viewport.style.height).toBe('240px');
  });

  it('renders only a subset of a 10,000-item list (windowing)', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(10000);
  });

  it('default row renders string content', async () => {
    const fix = TestBed.createComponent(MutableHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const defaultRows = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-default-row');
    expect(defaultRows.length).toBe(3);
    expect(defaultRows[0].textContent.trim()).toBe('A');
    expect(defaultRows[1].textContent.trim()).toBe('B');
    expect(defaultRows[2].textContent.trim()).toBe('C');
  });

  it('custom snItemDef template gets item and index context', async () => {
    const fix = TestBed.createComponent(CustomTplHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const customRows = fix.nativeElement.querySelectorAll('.custom-row');
    expect(customRows.length).toBe(3);
    expect(customRows[0].textContent.trim()).toBe('Alpha-0');
    expect(customRows[1].textContent.trim()).toBe('Beta-1');
    expect(customRows[2].textContent.trim()).toBe('Gamma-2');
  });

  it('no default-row elements when custom template is provided', async () => {
    const fix = TestBed.createComponent(CustomTplHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const defaultRows = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-default-row');
    expect(defaultRows.length).toBe(0);
  });

  it('itemHeight is applied to each rendered item wrapper', async () => {
    const fix = TestBed.createComponent(CustomSizesHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const items = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-item');
    expect(items.length).toBeGreaterThan(0);
    const firstItem: HTMLElement = items[0];
    expect(firstItem.style.height).toBe('48px');
  });

  it('updates the visible rows when the items input changes', async () => {
    const fix = TestBed.createComponent(MutableHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();

    fix.componentInstance.items.set(['X', 'Y']);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();

    const defaultRows = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-default-row');
    expect(defaultRows.length).toBe(2);
    expect(defaultRows[0].textContent.trim()).toBe('X');
    expect(defaultRows[1].textContent.trim()).toBe('Y');
  });

  it('snClass string merges onto host element', async () => {
    const fix = TestBed.createComponent(SnClassHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-virtual-scroller');
    expect(host.classList).toContain('my-extra');
  });

  it('host always carries sn-virtual-scroller class', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();
    const host: HTMLElement = fix.nativeElement.querySelector('sn-virtual-scroller');
    expect(host.classList).toContain('sn-virtual-scroller');
  });

  it('renders a subset of a 1,000-item list', async () => {
    const fix = TestBed.createComponent(CustomSizesHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();
    const rows = fix.nativeElement.querySelectorAll('.sn-virtual-scroller-item');
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.length).toBeLessThan(1000);
  });

  it('scrolling to index 500 renders items near that index', async () => {
    const fix = TestBed.createComponent(CustomSizesHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();

    const viewportDe = fix.debugElement.query(By.directive(CdkVirtualScrollViewport));
    const viewport = viewportDe.componentInstance as CdkVirtualScrollViewport;
    const viewportEl = viewportDe.nativeElement as HTMLElement;
    viewportEl.scrollTo = (options?: ScrollToOptions | number) => {
      if (typeof options === 'object' && options) {
        viewportEl.scrollTop = options.top ?? 0;
        viewportEl.scrollLeft = options.left ?? 0;
      }
      viewportEl.dispatchEvent(new Event('scroll'));
    };
    viewport.scrollToIndex(500);
    viewport.checkViewportSize();
    fix.detectChanges();
    await fix.whenStable();

    const renderedRange = viewport.getRenderedRange();
    expect(renderedRange.start).toBeGreaterThan(0);
    expect(renderedRange.end).toBeGreaterThan(renderedRange.start);
  });

  it('loadMore fires near the end when hasMore, once per items length', async () => {
    const fix = TestBed.createComponent(LoadMoreHost);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();

    const scroller = fix.debugElement.query(By.directive(VirtualScroller))
      .componentInstance as VirtualScroller<string>;
    const emit = (index: number) =>
      (scroller as unknown as { onScrolledIndexChange(i: number): void }).onScrolledIndexChange(index);

    // far from the end - no emit
    emit(0);
    expect(fix.componentInstance.loadMoreCount).toBe(0);

    // near the end - emits once
    emit(95);
    expect(fix.componentInstance.loadMoreCount).toBe(1);

    // same items length - guarded, no second emit
    emit(96);
    expect(fix.componentInstance.loadMoreCount).toBe(1);

    // more items appended - can emit again near the new end
    fix.componentInstance.items.set(
      Array.from({ length: 200 }, (_, i) => `Row ${i + 1}`),
    );
    await fix.whenStable();
    emit(195);
    expect(fix.componentInstance.loadMoreCount).toBe(2);
  });

  it('loadMore does not fire when hasMore is false', async () => {
    const fix = TestBed.createComponent(LoadMoreHost);
    fix.componentInstance.hasMore.set(false);
    await fix.whenStable();
    flushViewport(fix);
    await fix.whenStable();

    const scroller = fix.debugElement.query(By.directive(VirtualScroller))
      .componentInstance as VirtualScroller<string>;
    (scroller as unknown as { onScrolledIndexChange(i: number): void }).onScrolledIndexChange(95);
    expect(fix.componentInstance.loadMoreCount).toBe(0);
  });
});

@Component({
  template: `
    <sn-virtual-scroller
      [items]="items()"
      [height]="240"
      [itemHeight]="36"
      [hasMore]="hasMore()"
      (loadMore)="loadMoreCount = loadMoreCount + 1"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [VirtualScroller],
})
class LoadMoreHost {
  readonly items = signal(Array.from({ length: 100 }, (_, i) => `Row ${i + 1}`));
  readonly hasMore = signal(true);
  loadMoreCount = 0;
}
