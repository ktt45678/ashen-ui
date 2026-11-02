import {
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[snInfiniteScroll]',
})
export class InfiniteScroll implements OnDestroy {
  readonly distance = input<number>(100);
  readonly throttle = input<number>(150);
  readonly scrollWindow = input(false, { transform: booleanAttribute });
  readonly snInfiniteScrollDisabled = input(false, { alias: 'snInfiniteScrollDisabled', transform: booleanAttribute });

  readonly scrolled = output<void>();
  readonly scrolledUp = output<void>();

  private readonly _el = inject(ElementRef<HTMLElement>);
  private readonly _renderer = inject(Renderer2);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private _observer: IntersectionObserver | null = null;
  private _bottomSentinel: HTMLElement | null = null;
  private _topSentinel: HTMLElement | null = null;
  private readonly _hasScrolled = signal(false);
  private _scrollUnlisten: (() => void) | null = null;
  private _bottomThrottleTimer: ReturnType<typeof setTimeout> | null = null;
  private _topThrottleTimer: ReturnType<typeof setTimeout> | null = null;
  private _bottomThrottled = false;
  private _topThrottled = false;
  private _contentObserver: MutationObserver | null = null;
  private _recheckPending = false;

  constructor() {
    if (!this._isBrowser) return;

    afterNextRender(() => {
      this._setup();
    });

    effect(() => {
      const _d = this.distance();
      const _sw = this.scrollWindow();
      if (this._observer) {
        this._teardownObserver();
        this._createObserver();
      }
    });

    effect(() => {
      if (!this.snInfiniteScrollDisabled()) untracked(() => this._recheckBottom());
    });
  }

  private _canObserve(): boolean {
    return this._isBrowser && typeof IntersectionObserver !== 'undefined';
  }

  private _setup(): void {
    if (!this._canObserve()) return;

    const host = this._el.nativeElement as HTMLElement;

    this._topSentinel = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(this._topSentinel, 'sn-infinite-scroll-sentinel');
    this._renderer.insertBefore(host, this._topSentinel, host.firstChild);

    this._bottomSentinel = this._renderer.createElement('div') as HTMLElement;
    this._renderer.addClass(this._bottomSentinel, 'sn-infinite-scroll-sentinel');
    this._renderer.appendChild(host, this._bottomSentinel);

    this._attachScrollListener();
    this._createObserver();

    if (typeof MutationObserver !== 'undefined') {
      this._contentObserver = new MutationObserver(() => this._recheckBottom());
      this._contentObserver.observe(host, { childList: true, subtree: true });
    }
  }

  /**
   * An IntersectionObserver only reports crossings, so a batch too short to
   * push the bottom marker out of view would never ask for the next one.
   * Observing the marker again makes the observer report its current state.
   */
  private _recheckBottom(): void {
    if (!this._observer || !this._bottomSentinel) return;
    if (this._bottomThrottled) {
      this._recheckPending = true;
      return;
    }
    this._observer.unobserve(this._bottomSentinel);
    this._observer.observe(this._bottomSentinel);
  }

  private _attachScrollListener(): void {
    const target = this.scrollWindow() ? (window as unknown as HTMLElement) : this._el.nativeElement;
    this._scrollUnlisten = this._renderer.listen(target, 'scroll', () => {
      if (!this._hasScrolled()) {
        this._hasScrolled.set(true);
      }
    });
  }

  private _createObserver(): void {
    if (!this._canObserve() || !this._topSentinel || !this._bottomSentinel) return;

    const root = this.scrollWindow() ? null : (this._el.nativeElement as HTMLElement);
    const margin = `${this.distance()}px 0px ${this.distance()}px 0px`;

    this._observer = new IntersectionObserver(
      (entries) => this._onIntersect(entries),
      { root, rootMargin: margin, threshold: 0 },
    );

    this._observer.observe(this._topSentinel);
    this._observer.observe(this._bottomSentinel);
  }

  private _teardownObserver(): void {
    this._observer?.disconnect();
    this._observer = null;
  }

  private _onIntersect(entries: IntersectionObserverEntry[]): void {
    if (this.snInfiniteScrollDisabled()) return;

    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      if (entry.target === this._bottomSentinel) {
        this._emitBottom();
      } else if (entry.target === this._topSentinel) {
        if (!this._hasScrolled()) continue;
        this._emitTop();
      }
    }
  }

  private _emitBottom(): void {
    if (this._bottomThrottled) return;
    this.scrolled.emit();
    this._bottomThrottled = true;
    this._bottomThrottleTimer = setTimeout(() => {
      this._bottomThrottled = false;
      this._bottomThrottleTimer = null;
      if (this._recheckPending) {
        this._recheckPending = false;
        this._recheckBottom();
      }
    }, this.throttle());
  }

  private _emitTop(): void {
    if (this._topThrottled) return;
    this.scrolledUp.emit();
    this._topThrottled = true;
    this._topThrottleTimer = setTimeout(() => {
      this._topThrottled = false;
      this._topThrottleTimer = null;
    }, this.throttle());
  }

  ngOnDestroy(): void {
    this._teardownObserver();
    this._contentObserver?.disconnect();
    this._contentObserver = null;

    if (this._scrollUnlisten) {
      this._scrollUnlisten();
      this._scrollUnlisten = null;
    }

    if (this._bottomThrottleTimer !== null) {
      clearTimeout(this._bottomThrottleTimer);
      this._bottomThrottleTimer = null;
    }
    if (this._topThrottleTimer !== null) {
      clearTimeout(this._topThrottleTimer);
      this._topThrottleTimer = null;
    }

    const host = this._el.nativeElement as HTMLElement;
    if (this._topSentinel && host.contains(this._topSentinel)) {
      this._renderer.removeChild(host, this._topSentinel);
    }
    if (this._bottomSentinel && host.contains(this._bottomSentinel)) {
      this._renderer.removeChild(host, this._bottomSentinel);
    }
    this._topSentinel = null;
    this._bottomSentinel = null;
  }
}
