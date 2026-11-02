import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SnCarouselIntl } from 'ashen-ui/core';
import { SN_CAROUSEL, type CarouselContext } from './carousel-token';
import { type SnCarouselTarget, resolveCarouselContext } from './carousel-nav';

/**
 * Standalone dot pagination for a carousel, so the bar can live anywhere in the
 * layout (not just directly under the slides).
 *
 * - Inside `<sn-carousel>`: `<sn-carousel-pagination />` binds to the enclosing carousel.
 * - Outside: `<sn-carousel-pagination [carousel]="myCarousel" />` with a
 *   `<sn-carousel #myCarousel>` template reference.
 *
 * Pair with `pagination: false` on the carousel to replace the built-in bar.
 */
@Component({
  selector: 'sn-carousel-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ctx(); as c) {
      @for (dot of dots(); track dot) {
        <button
          type="button"
          class="sn-carousel-dot"
          [class.sn-carousel-dot--active]="c.activeIndex() === dot"
          [attr.aria-label]="dotLabel(dot)"
          [attr.aria-current]="c.activeIndex() === dot ? 'true' : null"
          [disabled]="!c.dotsClickable() || null"
          (click)="c.dotsClickable() && c.goTo(dot)"
        ></button>
      }
    }
  `,
  host: {
    class: 'sn-carousel-dots',
    'aria-hidden': 'true',
  },
})
export class CarouselPagination {
  readonly carousel = input<SnCarouselTarget | undefined>(undefined);

  private readonly injected = inject(SN_CAROUSEL, { optional: true });
  private readonly intl = inject(SnCarouselIntl);

  protected readonly ctx = computed<CarouselContext | null>(
    () => resolveCarouselContext(this.carousel()) ?? this.injected ?? null,
  );

  protected readonly dots = computed(() => {
    const c = this.ctx();
    return c ? c.snapPoints() : [];
  });

  protected dotLabel(i: number): string {
    return this.intl.goto(i + 1);
  }
}
