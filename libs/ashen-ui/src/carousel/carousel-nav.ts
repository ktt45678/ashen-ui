import { Directive, computed, inject, input } from '@angular/core';
import { SN_CAROUSEL, type CarouselContext } from './carousel-token';

/**
 * Marks a region of a slide as exempt from the carousel's drag-to-swipe. Pointer
 * gestures that start inside it won't switch slides, so the content can be text-
 * selected, dragged, or otherwise interacted with normally. The marked region is
 * also made text-selectable again (slide content is non-selectable by default so
 * swiping doesn't accidentally select text).
 */
@Directive({
  selector: '[snCarouselNoSwipe]',
  host: { class: 'sn-carousel-no-swipe' },
})
export class CarouselNoSwipe {}

/** A carousel instance (has `.context`) or a raw context object. */
export type SnCarouselTarget = CarouselContext | { readonly context: CarouselContext };

/**
 * Resolve a bound value (a `<sn-carousel #ref>` instance or a context object)
 * down to a `CarouselContext`. Returns null for empty / unrecognised values so
 * the directive can fall back to the injected (projected) carousel.
 */
export function resolveCarouselContext(value: unknown): CarouselContext | null {
  if (!value || typeof value !== 'object') return null;
  const withCtx = value as { context?: CarouselContext };
  if (withCtx.context && typeof withCtx.context.next === 'function') {
    return withCtx.context;
  }
  const ctx = value as CarouselContext;
  if (typeof ctx.next === 'function' && typeof ctx.prev === 'function') {
    return ctx;
  }
  return null;
}

/**
 * Turns any element into a "previous slide" control for a carousel.
 *
 * - Inside `<sn-carousel>`: `<button snCarouselPrev>` wires to the enclosing carousel.
 * - Outside: `<button [snCarouselPrev]="myCarousel">` where `myCarousel` is a
 *   `<sn-carousel #myCarousel>` template reference.
 *
 * Reflects the carousel's `prevDisabled` state onto the host element.
 */
@Directive({
  selector: '[snCarouselPrev]',
  host: {
    '(click)': '_onClick()',
    '[attr.disabled]': '_disabled() ? "" : null',
    '[attr.aria-disabled]': '_disabled() ? "true" : null',
  },
})
export class CarouselPrev {
  readonly target = input<SnCarouselTarget | '' | undefined>(undefined, { alias: 'snCarouselPrev' });
  private readonly _injected = inject(SN_CAROUSEL, { optional: true });
  private readonly _ctx = computed(() => resolveCarouselContext(this.target()) ?? this._injected ?? null);
  protected readonly _disabled = computed(() => this._ctx()?.prevDisabled() ?? true);

  protected _onClick(): void {
    this._ctx()?.prev();
  }
}

/**
 * Turns any element into a "next slide" control for a carousel. See {@link CarouselPrev}.
 */
@Directive({
  selector: '[snCarouselNext]',
  host: {
    '(click)': '_onClick()',
    '[attr.disabled]': '_disabled() ? "" : null',
    '[attr.aria-disabled]': '_disabled() ? "true" : null',
  },
})
export class CarouselNext {
  readonly target = input<SnCarouselTarget | '' | undefined>(undefined, { alias: 'snCarouselNext' });
  private readonly _injected = inject(SN_CAROUSEL, { optional: true });
  private readonly _ctx = computed(() => resolveCarouselContext(this.target()) ?? this._injected ?? null);
  protected readonly _disabled = computed(() => this._ctx()?.nextDisabled() ?? true);

  protected _onClick(): void {
    this._ctx()?.next();
  }
}
