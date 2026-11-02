import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from '@angular/core';
import {
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';

export type SkeletonShape =
  /** A text line: full width, line height, pill ends. */
  | 'text'
  /** A rectangle with the surface radius, for cards and images. */
  | 'rect'
  /** A circle, for avatars. */
  | 'circle'
  /** A square with the surface radius, for thumbnails. */
  | 'tile';

export type SkeletonAnimation =
  /** A highlight sweeping across the placeholder. */
  | 'shimmer'
  /** The whole placeholder fading in and out. */
  | 'pulse'
  /** Static, no animation. */
  | 'none';

@Component({
  selector: 'sn-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SnPart],
  hostDirectives: [SnPart],
  templateUrl: './skeleton.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Skeleton) }],
  host: {
    class: 'sn-skeleton',
    '[class.sn-skeleton-pulse]': 'animation() === "pulse"',
    '[class.sn-skeleton-static]': 'animation() === "none"',
    '[class.sn-skeleton-text]': 'shape() === "text"',
    '[class.sn-skeleton-rect]': 'shape() === "rect"',
    '[class.sn-skeleton-circle]': 'shape() === "circle"',
    '[class.sn-skeleton-tile]': 'shape() === "tile"',
    '[style.--sn-skeleton-rendered-width]': 'resolvedWidth()',
    '[style.--sn-skeleton-rendered-height]': 'resolvedHeight()',
    '[style.--sn-skeleton-rendered-radius]': 'resolvedRadius()',
    '[attr.aria-hidden]': '"true"',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-shape]': 'shape()',
    '[attr.data-sn-animation]': 'animation()',
  },
})
export class Skeleton implements SnPartSource {
  readonly shape = input<SkeletonShape>('rect');
  readonly animation = input<SkeletonAnimation>('shimmer');
  readonly width = input<string | number | undefined>(undefined);
  readonly height = input<string | number | undefined>(undefined);
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (): readonly string[] => ['aria-hidden'];

  protected readonly snClassResolved = computed(() =>
    resolveSnClass(this.snClass(), 'root', true),
  );

  protected readonly resolvedWidth = computed(() => {
    const w = this.width();
    if (w !== undefined) return typeof w === 'number' ? `${w}px` : w;
    const shape = this.shape();
    if (shape === 'circle') return 'var(--sn-skeleton-circle-size, 2.5rem)';
    if (shape === 'tile') return 'var(--sn-skeleton-tile-size, 96px)';
    return 'var(--sn-skeleton-width, 100%)';
  });

  protected readonly resolvedHeight = computed(() => {
    const h = this.height();
    if (h !== undefined) return typeof h === 'number' ? `${h}px` : h;
    const shape = this.shape();
    if (shape === 'text') return 'var(--sn-skeleton-text-height, 0.875rem)';
    if (shape === 'rect') return 'var(--sn-skeleton-rect-height, 4rem)';
    if (shape === 'circle') return 'var(--sn-skeleton-circle-size, 2.5rem)';
    if (shape === 'tile') return 'var(--sn-skeleton-tile-size, 96px)';
    return undefined;
  });

  protected readonly resolvedRadius = computed(() => {
    const shape = this.shape();
    if (shape === 'text') return 'var(--sn-skeleton-text-radius, var(--sn-radius-sm))';
    if (shape === 'rect') return 'var(--sn-skeleton-rect-radius, var(--sn-radius-md))';
    if (shape === 'circle') return '50%';
    if (shape === 'tile') return 'var(--sn-skeleton-tile-radius, var(--sn-radius-tile))';
    return undefined;
  });
}
