import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  SnCarouselIntl,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_CAROUSEL } from './carousel-token';

const CAROUSEL_ITEM_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-roledescription', 'aria-label', 'aria-hidden', 'inert'],
};

@Component({
  selector: 'sn-carousel-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './carousel-item.html',
  hostDirectives: [SnPart],
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => CarouselItem) }],
  host: {
    role: 'group',
    'aria-roledescription': 'slide',
    class: 'sn-carousel-item',
    '[attr.aria-label]': 'slideLabel()',
    '[attr.aria-hidden]': 'isHidden() ? "true" : null',
    '[attr.inert]': 'isHidden() ? "" : null',
    '[class]': 'rootClassExtra()',
  },
})
export class CarouselItem implements SnPartSource {
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    CAROUSEL_ITEM_RESERVED_ATTRS[section] ?? [];

  /** Host element, used by the carousel to clone slides for seamless looping. */
  readonly el = inject(ElementRef<HTMLElement>);

  private readonly carousel = inject(SN_CAROUSEL, { optional: true });
  private readonly intl = inject(SnCarouselIntl);

  protected readonly index = computed(() => this.carousel?.getIndex(this)() ?? 0);

  protected readonly isHidden = computed(() => {
    if (!this.carousel) return false;
    const start = this.carousel.activeIndex();
    const spv = this.carousel.slidesPerView();
    const i = this.index();
    return i < start || i >= start + spv;
  });

  protected readonly slideLabel = computed(() => {
    const idx = this.index();
    const total = this.carousel?.total() ?? 1;
    return this.intl.slide(idx + 1, total);
  });

  protected readonly rootClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );
}
