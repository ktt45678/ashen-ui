import { InjectionToken, Signal } from '@angular/core';

/** Autoplay config (Swiper-compatible subset). */
export interface SnCarouselAutoplay {
  /** Delay between transitions, in ms. Default 3000. */
  delay?: number;
  /** Pause autoplay while the pointer is over the carousel. Default false. */
  pauseOnMouseEnter?: boolean;
  /** Stop autoplay permanently after the first user interaction. Default true. */
  disableOnInteraction?: boolean;
}

/** Pagination (dots) config. */
export interface SnCarouselPagination {
  /** Allow clicking a dot to jump to that slide. Default true. */
  clickable?: boolean;
}

/**
 * Carousel behaviour options. A single object mirroring the common Swiper API
 * so the config is portable. Every field is optional; omit `options` entirely
 * to keep the default single-slide, navigation + pagination layout.
 */
export interface SnCarouselOptions {
  /** Enable autoplay. `true` uses defaults; pass an object to tune it. */
  autoplay?: boolean | SnCarouselAutoplay;
  /** Wrap around at the ends (prev from first → last, next from last → first). */
  loop?: boolean;
  /** Show the built-in prev/next buttons. Default true. */
  navigation?: boolean;
  /** Show the built-in dot pagination. `true`/object shows it; `false` hides it. */
  pagination?: boolean | SnCarouselPagination;
  /** Allow pointer/touch dragging between slides. Default true. */
  allowTouchMove?: boolean;
  /** Number of slides visible at once. Default 1. */
  slidesPerView?: number;
  /** Slides to advance per navigation step (group sliding). Default 1. */
  slidesPerGroup?: number;
  /** Leading slides excluded from grouping. They advance one at a time before grouping starts. Default 0. */
  slidesPerGroupSkip?: number;
  /** Make the group size equal to slidesPerView (rounded up), ignoring slidesPerGroup. Default false. */
  slidesPerGroupAuto?: boolean;
  /** Gap between slides, in px. Default 0. */
  spaceBetween?: number;
  /** Track direction. Default 'horizontal'. */
  direction?: 'horizontal' | 'vertical';
  /** Adapt the viewport height to the active slide. Default false. */
  autoHeight?: boolean;
  /** Recalculate on window resize / orientationchange. Default true. */
  updateOnWindowResize?: boolean;
  /** Use ResizeObserver on the container to detect resize. Default true. */
  resizeObserver?: boolean;
  /** Round slide lengths to whole px to avoid blurry text. Default false. */
  roundLengths?: boolean;
  /** CSS selector for focusable elements; dragging is disabled when they are focused. */
  focusableElements?: string;
}

export interface CarouselContext {
  readonly activeIndex: Signal<number>;
  readonly total: Signal<number>;
  readonly slidesPerView: Signal<number>;
  /** Number of reachable snap positions (dots). Differs from `total` when slidesPerView > 1. */
  readonly pageCount: Signal<number>;
  /** Leftmost slide index of each snap position, one entry per dot. */
  readonly snapPoints: Signal<number[]>;
  /** Whether pagination dots may be clicked to jump. */
  readonly dotsClickable: Signal<boolean>;
  readonly getIndex: (item: unknown) => Signal<number>;
  readonly prevDisabled: Signal<boolean>;
  readonly nextDisabled: Signal<boolean>;
  readonly prev: () => void;
  readonly next: () => void;
  readonly goTo: (index: number) => void;
}

export const SN_CAROUSEL = new InjectionToken<CarouselContext>('SN_CAROUSEL');
