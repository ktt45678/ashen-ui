import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { InfiniteScroll } from './infinite-scroll';

interface MockIOEntry {
  isIntersecting: boolean;
  target: Element;
}

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  callback: (entries: MockIOEntry[], observer: MockIntersectionObserver) => void;
  options: IntersectionObserverInit | undefined;
  observed: Set<Element> = new Set();

  constructor(
    cb: (entries: MockIOEntry[], observer: MockIntersectionObserver) => void,
    options?: IntersectionObserverInit,
  ) {
    this.callback = cb;
    this.options = options;
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.add(target);
  }

  unobserve(target: Element): void {
    this.observed.delete(target);
  }

  disconnect(): void {
    this.observed.clear();
  }

  fire(entries: MockIOEntry[]): void {
    this.callback(entries, this);
  }
}

function fireIntersect(
  instance: MockIntersectionObserver,
  target: Element,
  isIntersecting = true,
): void {
  instance.fire([{ isIntersecting, target }]);
}

@Component({
  template: `<div
    snInfiniteScroll
    [distance]="distance()"
    [throttle]="throttle()"
    [scrollWindow]="scrollWindow()"
    [snInfiniteScrollDisabled]="disabled()"
    (scrolled)="scrolledCount = scrolledCount + 1"
    (scrolledUp)="scrolledUpCount = scrolledUpCount + 1"
    style="height:200px;overflow:auto;"
  ><p>content</p></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InfiniteScroll],
})
class BasicHost {
  readonly distance = signal(100);
  readonly throttle = signal(150);
  readonly scrollWindow = signal(false);
  readonly disabled = signal(false);
  scrolledCount = 0;
  scrolledUpCount = 0;
}

@Component({
  template: `<div snInfiniteScroll style="height:200px;overflow:auto;"><p>content</p></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InfiniteScroll],
})
class DefaultHost {}

@Component({
  template: `<div snInfiniteScroll [scrollWindow]="true" style="height:200px;overflow:auto;"><p>content</p></div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InfiniteScroll],
})
class WindowHost {}

@Component({
  template: `<div snInfiniteScroll [throttle]="0" (scrolled)="scrolledCount = scrolledCount + 1">
    @for (item of items(); track item) {
      <p>{{ item }}</p>
    }
  </div>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [InfiniteScroll],
})
class GrowingHost {
  readonly items = signal([0]);
  scrolledCount = 0;
}

const tick = (ms = 0) => new Promise<void>((r) => setTimeout(r, ms));

describe('InfiniteScroll', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    (globalThis as unknown as Record<string, unknown>)['IntersectionObserver'] = MockIntersectionObserver;

    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  afterEach(() => {
    delete (globalThis as unknown as Record<string, unknown>)['IntersectionObserver'];
  });

  it('renders scroll markers before the first and after the last content node', async () => {
    const fix = TestBed.createComponent(DefaultHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const children = Array.from(host.children);
    expect(children.length).toBeGreaterThanOrEqual(2);
    expect(children[0].classList).toContain('sn-infinite-scroll-sentinel');
    expect(children[children.length - 1].classList).toContain('sn-infinite-scroll-sentinel');
  });

  it('watches within distance of the host itself when scrollWindow=false', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.distance.set(200);
    await fix.whenStable();

    const io = MockIntersectionObserver.instances[0];
    expect(io).toBeTruthy();
    expect(io.options?.rootMargin).toBe('200px 0px 200px 0px');
    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    expect(io.options?.root).toBe(host);
  });

  it('watches the browser viewport instead of the host when scrollWindow=true', async () => {
    const fix = TestBed.createComponent(WindowHost);
    await fix.whenStable();

    const io = MockIntersectionObserver.instances[0];
    expect(io).toBeTruthy();
    expect(io.options?.root).toBeNull();
  });

  it('notifies scrolled when the user nears the bottom', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const bottomSentinel = host.lastElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, bottomSentinel);

    expect(fix.componentInstance.scrolledCount).toBe(1);
  });

  it('notifies immediately if the content does not fill the container (auto-fill)', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const bottomSentinel = host.lastElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, bottomSentinel);

    expect(fix.componentInstance.scrolledCount).toBe(1);
  });

  it('does not notify scrolledUp before the user has scrolled', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const topSentinel = host.firstElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, topSentinel);

    expect(fix.componentInstance.scrolledUpCount).toBe(0);
  });

  it('notifies scrolledUp once the user has scrolled and nears the top', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const topSentinel = host.firstElementChild!;
    const io = MockIntersectionObserver.instances[0];

    host.dispatchEvent(new Event('scroll'));
    await fix.whenStable();

    fireIntersect(io, topSentinel);

    expect(fix.componentInstance.scrolledUpCount).toBe(1);
  });

  it('throttle: rapid scrolling near the bottom only notifies once', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.throttle.set(10000);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const bottomSentinel = host.lastElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, bottomSentinel);
    fireIntersect(io, bottomSentinel);

    expect(fix.componentInstance.scrolledCount).toBe(1);
  });

  it('throttle: notifies again once the throttle window passes', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.throttle.set(10);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const bottomSentinel = host.lastElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, bottomSentinel);
    await new Promise((r) => setTimeout(r, 50));
    fireIntersect(io, bottomSentinel);

    expect(fix.componentInstance.scrolledCount).toBe(2);
  });

  it('disabled suppresses scrolled emits', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const bottomSentinel = host.lastElementChild!;
    const io = MockIntersectionObserver.instances[0];

    fireIntersect(io, bottomSentinel);

    expect(fix.componentInstance.scrolledCount).toBe(0);
  });

  it('disabled suppresses scrolledUp emits after scroll', async () => {
    const fix = TestBed.createComponent(BasicHost);
    fix.componentInstance.disabled.set(true);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const topSentinel = host.firstElementChild!;
    const io = MockIntersectionObserver.instances[0];

    host.dispatchEvent(new Event('scroll'));
    await fix.whenStable();
    fireIntersect(io, topSentinel);

    expect(fix.componentInstance.scrolledUpCount).toBe(0);
  });

  it('applies a new distance without leaking the previous watcher', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const firstIo = MockIntersectionObserver.instances[0];
    expect(firstIo.observed.size).toBe(2);

    fix.componentInstance.distance.set(250);
    await fix.whenStable();

    expect(firstIo.observed.size).toBe(0);
    const secondIo = MockIntersectionObserver.instances[1];
    expect(secondIo).toBeTruthy();
    expect(secondIo.options?.rootMargin).toBe('250px 0px 250px 0px');
  });

  describe('bottom marker still in view after a batch', () => {
    async function setup() {
      const fix = TestBed.createComponent(GrowingHost);
      await fix.whenStable();
      const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
      const bottom = host.lastElementChild!;
      const io = MockIntersectionObserver.instances[0];
      io.observe = (target: Element) => {
        io.observed.add(target);
        if (target === bottom) fireIntersect(io, bottom);
      };
      fireIntersect(io, bottom);
      await tick(10);
      return fix;
    }

    it('asks for the next batch when new content leaves the marker in view', async () => {
      const fix = await setup();
      expect(fix.componentInstance.scrolledCount).toBe(1);

      fix.componentInstance.items.update((items) => [...items, items.length]);
      await fix.whenStable();
      await tick(10);
      expect(fix.componentInstance.scrolledCount).toBe(2);
    });

    it('does not ask again while no new content arrives', async () => {
      const fix = await setup();
      await tick(50);
      expect(fix.componentInstance.scrolledCount).toBe(1);
    });
  });

  it('cleans up scroll watching and its markers when destroyed', async () => {
    const fix = TestBed.createComponent(BasicHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const io = MockIntersectionObserver.instances[0];

    const sentinelsBefore = host.querySelectorAll('.sn-infinite-scroll-sentinel').length;
    expect(sentinelsBefore).toBe(2);

    fix.destroy();

    expect(io.observed.size).toBe(0);
    const sentinelsAfter = host.querySelectorAll('.sn-infinite-scroll-sentinel').length;
    expect(sentinelsAfter).toBe(0);
  });

  it('SSR-safety: no IntersectionObserver defined → directive is inert, no crash', async () => {
    delete (globalThis as unknown as Record<string, unknown>)['IntersectionObserver'];

    const fix = TestBed.createComponent(DefaultHost);
    await fix.whenStable();

    const host: HTMLElement = fix.nativeElement.querySelector('[snInfiniteScroll]');
    const sentinels = host.querySelectorAll('.sn-infinite-scroll-sentinel').length;
    expect(sentinels).toBe(0);
  });
});
