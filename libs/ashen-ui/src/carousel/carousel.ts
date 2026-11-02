import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  Renderer2,
  Signal,
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
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  SnCarouselIntl,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
  snInlineStep,
  snIsRtl,
} from 'ashen-ui/core';
import { Icon } from 'ashen-ui/icon';
import { SN_CAROUSEL, type SnCarouselOptions } from './carousel-token';
import { CarouselItem } from './carousel-item';

const CAROUSEL_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-roledescription', 'aria-label'],
  prev: ['type', 'aria-label', 'disabled'],
  next: ['type', 'aria-label', 'disabled'],
  indicators: ['aria-hidden'],
  indicator: ['type', 'aria-label', 'aria-current', 'disabled'],
};

@Component({
  selector: 'sn-carousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SnPart],
  templateUrl: './carousel.html',
  hostDirectives: [SnPart],
  providers: [
    { provide: SN_PART_SOURCE, useExisting: forwardRef(() => Carousel) },
    {
      provide: SN_CAROUSEL,
      useFactory: (self: Carousel) => self.context,
      deps: [Carousel],
    },
  ],
  host: {
    role: 'region',
    'aria-roledescription': 'carousel',
    class: 'sn-carousel',
    '[attr.aria-label]': 'resolvedAriaLabel()',
    '[class]': 'rootClassExtra()',
    '[class.sn-carousel--vertical]': "direction() === 'vertical'",
    '[class.sn-carousel--auto-height]': 'autoHeight()',
    '[attr.data-sn-orientation]': 'direction()',
    '[attr.data-sn-auto-height]': 'autoHeight() ? "" : null',
    '[style.--sn-carousel-slide-basis]': 'slideBasis()',
    '[style.--sn-carousel-gap]': 'gapPx()',
    '(keydown)': 'onKeydown($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focusin)': 'focusWithin.set(true)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class Carousel implements OnDestroy, SnPartSource {
  protected readonly icons = inject(SnIconRegistry);

  readonly activeIndex = model(0);
  readonly ariaLabel = input<string | undefined>(undefined);
  readonly options = input<SnCarouselOptions | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  protected readonly items = contentChildren(CarouselItem);

  private readonly intl = inject(SnCarouselIntl);
  private readonly renderer = inject(Renderer2);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  private unlisten: (() => void)[] = [];
  /** Physical slide position currently shown by the track (real index + leading clones). */
  private phys = 0;
  private dragging = false;
  private wrapping = false;
  private dragStart = 0;
  private dragLast = 0;
  private dragAxisSize = 0;
  private rafId: number | null = null;
  private ready = false;
  private cloneNodes: HTMLElement[] = [];
  private wrapCleanup: (() => void) | null = null;

  /** Paused while the pointer is over the carousel (autoplay.pauseOnMouseEnter). */
  private readonly paused = signal(false);
  /** Permanently stopped after a user interaction (autoplay.disableOnInteraction). */
  private readonly autoplayStopped = signal(false);
  /** Paused while keyboard focus is inside the carousel (WAI-ARIA APG carousel pattern). */
  protected readonly focusWithin = signal(false);
  /** Paused through pause() until play() is called. */
  private readonly userPaused = signal(false);

  /** Whether autoplay is currently advancing the slides. Drive a play/pause button from this. */
  readonly playing = computed(
    () =>
      this.isBrowser &&
      !!this.autoplayConfig() &&
      !this.autoplayStopped() &&
      !this.userPaused() &&
      !this.paused() &&
      !this.focusWithin() &&
      this.count() > 1,
  );

  protected readonly count = computed(() => this.items().length);

  protected readonly loop = computed(() => this.options()?.loop ?? false);
  protected readonly slidesPerView = computed(() =>
    Math.max(1, Math.floor(this.options()?.slidesPerView ?? 1)),
  );
  protected readonly spaceBetween = computed(() => this.options()?.spaceBetween ?? 0);
  protected readonly direction = computed(() => this.options()?.direction ?? 'horizontal');
  protected readonly showNavigation = computed(() => this.options()?.navigation ?? true);
  protected readonly autoHeight = computed(() => this.options()?.autoHeight ?? false);
  protected readonly allowTouchMove = computed(() => this.options()?.allowTouchMove ?? true);

  private readonly documentRtl = snIsRtl();
  /** True when the carousel renders right-to-left. A vertical track never is. */
  private readonly rtl = computed(() => this.direction() !== 'vertical' && this.documentRtl());

  /** Effective group step size (slidesPerGroupAuto → slidesPerView, rounded up). */
  private readonly groupSize = computed(() => {
    if (this.options()?.slidesPerGroupAuto) return Math.max(1, Math.ceil(this.slidesPerView()));
    return Math.max(1, Math.floor(this.options()?.slidesPerGroup ?? 1));
  });

  private readonly paginationCfg = computed(() => {
    const p = this.options()?.pagination;
    if (p === false) return null;
    const o = typeof p === 'object' && p ? p : {};
    return { clickable: o.clickable ?? true };
  });
  protected readonly showPagination = computed(() => this.paginationCfg() !== null);
  protected readonly dotsClickable = computed(() => this.paginationCfg()?.clickable ?? true);

  private readonly autoplayConfig = computed(() => {
    const a = this.options()?.autoplay;
    if (!a) return null;
    const o = typeof a === 'object' ? a : {};
    return {
      delay: o.delay ?? 3000,
      pauseOnMouseEnter: o.pauseOnMouseEnter ?? false,
      disableOnInteraction: o.disableOnInteraction ?? true,
    };
  });

  /** Seamless looping uses one leading + one trailing clone (single-slide view only). */
  protected readonly cloneCount = computed(() =>
    this.loop() && this.count() > 1 && this.slidesPerView() === 1 ? 1 : 0,
  );

  /**
   * Leftmost slide index of every reachable snap position. Honours slidesPerView
   * (a full view is always kept at the end), slidesPerGroup (step size) and
   * slidesPerGroupSkip (leading ungrouped slides). One entry === one dot.
   */
  protected readonly snapPoints = computed(() => {
    const count = this.count();
    if (count === 0) return [0];
    const spv = this.slidesPerView();
    const group = this.groupSize();
    const skip = Math.max(0, this.options()?.slidesPerGroupSkip ?? 0);
    const maxStart = Math.max(0, count - spv);
    const points: number[] = [];
    let i = 0;
    while (i < maxStart) {
      points.push(i);
      i += i < skip ? 1 : group;
    }
    points.push(maxStart);
    return points.filter((v, idx) => idx === 0 || v !== points[idx - 1]);
  });

  protected readonly pageCount = computed(() => this.snapPoints().length);
  protected readonly dots = computed(() => this.snapPoints());

  protected readonly activeSnap = computed(() => {
    const pts = this.snapPoints();
    const idx = this.activeIndex();
    let r = 0;
    for (let i = 0; i < pts.length; i++) {
      if (pts[i] <= idx) r = i;
      else break;
    }
    return r;
  });

  protected readonly prevDisabled = computed(() => !this.loop() && this.activeSnap() <= 0);
  protected readonly nextDisabled = computed(
    () => !this.loop() && this.activeSnap() >= this.snapPoints().length - 1,
  );

  protected readonly slideBasis = computed(() => {
    const spv = this.slidesPerView();
    if (spv <= 1) return '100%';
    const gap = this.spaceBetween();
    return `calc((100% - ${(spv - 1) * gap}px) / ${spv})`;
  });
  protected readonly gapPx = computed(() => `${this.spaceBetween()}px`);

  protected readonly resolvedAriaLabel = computed(() => this.ariaLabel() ?? this.intl.label);
  protected readonly prevLabel = computed(() => this.intl.previous);
  protected readonly nextLabel = computed(() => this.intl.next);
  // The chevrons point at the slide they bring in, so they swap in RTL.
  protected readonly prevIcon = computed(() =>
    this.direction() === 'vertical'
      ? this.icons.resolve('chevron-up')
      : this.icons.resolve(this.rtl() ? 'chevron-right' : 'chevron-left'),
  );
  protected readonly nextIcon = computed(() =>
    this.direction() === 'vertical'
      ? this.icons.resolve('chevron-down')
      : this.icons.resolve(this.rtl() ? 'chevron-left' : 'chevron-right'),
  );
  protected readonly rootClassExtra = computed(() => resolveSnClass(this.snClass(), 'root', true));
  protected readonly prevClassExtra = computed(() => resolveSnClass(this.snClass(), 'prev', false));
  protected readonly viewportClassExtra = computed(() => resolveSnClass(this.snClass(), 'viewport', false));
  protected readonly trackClassExtra = computed(() => resolveSnClass(this.snClass(), 'track', false));
  protected readonly nextClassExtra = computed(() => resolveSnClass(this.snClass(), 'next', false));
  protected readonly indicatorsClassExtra = computed(() => resolveSnClass(this.snClass(), 'indicators', false));
  protected readonly indicatorClassExtra = computed(() => resolveSnClass(this.snClass(), 'indicator', false));

  readonly reservedAttrs = (section: string): readonly string[] =>
    CAROUSEL_RESERVED_ATTRS[section] ?? [];

  readonly context = {
    activeIndex: this.activeIndex.asReadonly(),
    total: this.count,
    slidesPerView: this.slidesPerView,
    pageCount: this.pageCount,
    snapPoints: this.snapPoints,
    dotsClickable: this.dotsClickable,
    getIndex: (item: unknown): Signal<number> =>
      computed(() => {
        const list = this.items();
        const idx = list.indexOf(item as CarouselItem);
        return idx >= 0 ? idx : 0;
      }),
    prevDisabled: this.prevDisabled,
    nextDisabled: this.nextDisabled,
    prev: () => this.prev(),
    next: () => this.next(),
    goTo: (i: number) => this.goTo(i),
  };

  constructor() {
    effect((onCleanup) => {
      if (!this.playing()) return;
      const id = setInterval(() => this.advanceAuto(), this.autoplayConfig()!.delay);
      onCleanup(() => clearInterval(id));
    });

    effect(() => {
      this.items();
      this.loop();
      this.slidesPerView();
      this.spaceBetween();
      this.direction();
      const track = this.trackRef();
      if (!this.isBrowser || !track) return;
      untracked(() => {
        this.syncClones();
        if (!this.dragging && !this.wrapping) {
          this.slideTo(this.activeIndex() + this.cloneCount(), false);
        }
      });
    });

    effect(() => {
      const idx = this.activeIndex();
      const off = this.cloneCount();
      const track = this.trackRef();
      if (!this.isBrowser || !track) return;
      if (this.dragging || this.wrapping) return;
      untracked(() => {
        this.slideTo(idx + off, this.ready);
        this.ready = true;
      });
    });

    effect(() => {
      const active = this.activeIndex();
      const auto = this.autoHeight();
      this.items();
      this.viewport();
      if (!this.isBrowser) return;
      queueMicrotask(() => this.applyAutoHeight(auto, active));
    });
  }

  private axisChar(): 'X' | 'Y' {
    return this.direction() === 'vertical' ? 'Y' : 'X';
  }

  /** Transform sign for the main axis: LTR/vertical move negative, horizontal RTL positive. */
  private baseSign(): 1 | -1 {
    return this.rtl() ? 1 : -1;
  }

  private stepExpr(): string {
    const spv = this.slidesPerView();
    const gap = this.spaceBetween();
    return spv <= 1 && gap === 0
      ? '100%'
      : `((100% - ${(spv - 1) * gap}px) / ${spv} + ${gap}px)`;
  }

  private slideTo(phys: number, animate: boolean): void {
    this.phys = phys;
    const track = this.trackRef()?.nativeElement;
    if (!track) return;
    const transform = `translate${this.axisChar()}(calc(${this.baseSign()} * ${phys} * ${this.stepExpr()}))`;
    if (animate) {
      track.style.transition = '';
      track.style.transform = transform;
    } else {
      track.style.transition = 'none';
      track.style.transform = transform;
      void track.offsetHeight; // reflow so subsequent changes animate
      track.style.transition = '';
    }
  }

  private applyDrag(dragPx: number): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) return;
    track.style.transition = 'none';
    track.style.transform = `translate${this.axisChar()}(calc(${this.baseSign()} * ${this.phys} * ${this.stepExpr()} + ${dragPx}px))`;
  }

  private syncClones(): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) return;
    for (const c of this.cloneNodes) c.remove();
    this.cloneNodes = [];
    const n = this.cloneCount();
    const items = this.items();
    if (n <= 0 || items.length === 0) return;
    const count = items.length;
    const make = (src: HTMLElement): HTMLElement => {
      const clone = src.cloneNode(true) as HTMLElement;
      clone.classList.add('sn-carousel-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('inert', '');
      clone.removeAttribute('id');
      clone.removeAttribute('role');
      clone.removeAttribute('aria-roledescription');
      clone.removeAttribute('aria-label');
      return clone;
    };
    const first = items[0].el.nativeElement;
    for (let k = 0; k < n; k++) {
      const clone = make(items[count - n + k].el.nativeElement);
      track.insertBefore(clone, first);
      this.cloneNodes.push(clone);
    }
    for (let k = 0; k < n; k++) {
      const clone = make(items[k].el.nativeElement);
      track.appendChild(clone);
      this.cloneNodes.push(clone);
    }
  }

  private flagInteraction(): void {
    if (this.autoplayConfig()?.disableOnInteraction) this.autoplayStopped.set(true);
  }

  /** Move to a snap position; the position effect animates the track. */
  private goToIndex(target: number): void {
    this.activeIndex.set(target);
  }

  private step(dir: 1 | -1, userInitiated: boolean): void {
    if (this.wrapping) return;
    if (userInitiated) this.flagInteraction();
    const pts = this.snapPoints();
    const cur = this.activeSnap();
    const last = pts.length - 1;
    if (dir > 0) {
      if (cur < last) this.goToIndex(pts[cur + 1]);
      else if (this.loop()) this.wrapForward();
    } else {
      if (cur > 0) this.goToIndex(pts[cur - 1]);
      else if (this.loop()) this.wrapBackward();
    }
  }

  /** Go to the previous snap position (group-aware). Public so custom buttons can drive it. */
  prev(): void {
    this.step(-1, true);
  }

  /** Go to the next snap position (group-aware). Public so custom buttons can drive it. */
  next(): void {
    this.step(1, true);
  }

  /** Stop autoplay until play() is called. */
  pause(): void {
    this.userPaused.set(true);
  }

  /** Resume autoplay, including after an interaction stopped it. */
  play(): void {
    this.userPaused.set(false);
    this.autoplayStopped.set(false);
  }

  /** Jump to a slide index, snapping to the nearest reachable position. Public for external controls. */
  goTo(i: number): void {
    if (this.wrapping) return;
    this.flagInteraction();
    const pts = this.snapPoints();
    const nearest = pts.reduce((b, p) => (Math.abs(p - i) < Math.abs(b - i) ? p : b), pts[0]);
    this.goToIndex(nearest);
  }

  private advanceAuto(): void {
    if (this.wrapping) return;
    const pts = this.snapPoints();
    const cur = this.activeSnap();
    if (cur >= pts.length - 1) {
      if (this.loop()) this.wrapForward();
      else this.goToIndex(pts[0]);
    } else {
      this.goToIndex(pts[cur + 1]);
    }
  }

  private wrapForward(): void {
    const clone = this.cloneCount();
    if (clone <= 0) {
      // Multi-view loop: jump to the start without the long reverse animation.
      this.goToIndex(this.snapPoints()[0]);
      return;
    }
    this.wrapping = true;
    this.activeIndex.set(0); // a11y / dots update now (the position effect is guarded)
    this.slideTo(this.count() + clone, true); // animate FORWARD into the trailing clone
    this.finishWrap(clone); // then jump back to the real first slide
  }

  private wrapBackward(): void {
    const clone = this.cloneCount();
    const pts = this.snapPoints();
    if (clone <= 0) {
      this.goToIndex(pts[pts.length - 1]);
      return;
    }
    this.wrapping = true;
    this.activeIndex.set(this.count() - 1);
    this.slideTo(0, true); // animate BACKWARD into the leading clone
    this.finishWrap(this.count() - 1 + clone);
  }

  private finishWrap(resetPhys: number): void {
    const track = this.trackRef()?.nativeElement ?? null;
    const done = () => {
      if (!this.wrapping) return;
      this.wrapping = false;
      this.slideTo(resetPhys, false); // instant jump onto the real slide
      this.wrapCleanup?.();
      this.wrapCleanup = null;
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'transform') done();
    };
    track?.addEventListener('transitionend', onEnd);
    const timer = setTimeout(done, 600); // fallback if transitionend never fires
    this.wrapCleanup = () => {
      track?.removeEventListener('transitionend', onEnd);
      clearTimeout(timer);
    };
  }

  private applyAutoHeight(auto: boolean, active: number): void {
    const vp = this.viewport()?.nativeElement;
    if (!vp) return;
    if (!auto) {
      vp.style.height = '';
      return;
    }
    const el = this.items()[active]?.el.nativeElement;
    if (el) vp.style.height = `${el.offsetHeight}px`;
  }

  protected dotLabel(i: number): string {
    return this.intl.goto(i + 1);
  }

  protected isDotActive(i: number): boolean {
    return this.activeIndex() === i;
  }

  protected onDotClick(i: number): void {
    if (this.dotsClickable()) this.goTo(i);
  }

  protected onMouseEnter(): void {
    if (this.autoplayConfig()?.pauseOnMouseEnter) this.paused.set(true);
  }

  protected onMouseLeave(): void {
    if (this.paused()) this.paused.set(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !this.hostEl.nativeElement.contains(next)) this.focusWithin.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const step = snInlineStep(event.key, this.rtl());
    if (step === 0) return;
    if (step === 1) this.next();
    else this.prev();
    event.preventDefault();
  }

  protected onTrackPointerDown(event: PointerEvent): void {
    if (event.button > 0 || !this.allowTouchMove() || this.wrapping) return;
    const target = event.target as HTMLElement | null;
    const focusSel = this.options()?.focusableElements;
    if (focusSel && target?.closest?.(focusSel)) return;
    // Content marked snCarouselNoSwipe is exempt (text selection, inner drag, …).
    if (target?.closest?.('.sn-carousel-no-swipe')) return;

    const vertical = this.direction() === 'vertical';
    const coord = (e: PointerEvent) => (vertical ? e.clientY : e.clientX);
    const vp = this.viewport()?.nativeElement;
    this.dragAxisSize = vp ? (vertical ? vp.offsetHeight : vp.offsetWidth) : 0;
    this.phys = this.activeIndex() + this.cloneCount();
    this.dragStart = coord(event);
    this.dragLast = this.dragStart;
    this.dragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    const onMove = (ev: PointerEvent) => {
      this.dragLast = coord(ev);
      if (this.rafId == null) {
        this.rafId = requestAnimationFrame(() => {
          this.rafId = null;
          this.applyDrag(this.dragLast - this.dragStart);
        });
      }
    };
    const onUp = () => this.endDrag();

    this.unlisten.push(
      this.renderer.listen(this.hostEl.nativeElement, 'pointermove', onMove as EventListener),
      this.renderer.listen(this.hostEl.nativeElement, 'pointerup', onUp),
      this.renderer.listen(this.hostEl.nativeElement, 'pointercancel', onUp),
    );
  }

  private endDrag(): void {
    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.detachListeners();
    if (!this.dragging) return;
    this.dragging = false;
    const delta = this.dragLast - this.dragStart;
    const threshold = Math.max(40, this.dragAxisSize * 0.15);
    // In RTL the next slide is on the left, so flip the drag direction.
    const leftDir = this.rtl() ? -1 : 1;
    const dir = delta <= -threshold ? leftDir : delta >= threshold ? -leftDir : 0;
    if (dir === 0) {
      this.slideTo(this.phys, true); // below threshold, snap back
      return;
    }
    const before = this.activeIndex();
    this.step(dir as 1 | -1, true);
    if (!this.wrapping && this.activeIndex() === before) {
      this.slideTo(this.phys, true); // hit a boundary, snap back
    }
  }

  private detachListeners(): void {
    this.unlisten.forEach((fn) => fn());
    this.unlisten = [];
  }

  ngOnDestroy(): void {
    if (this.rafId != null) cancelAnimationFrame(this.rafId);
    this.wrapCleanup?.();
    this.detachListeners();
  }
}
