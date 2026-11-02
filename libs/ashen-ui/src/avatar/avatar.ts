import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  forwardRef,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  IconTemplate,
  SnIconRegistry,
  SN_PART_SOURCE,
  SnPart,
  type SnAttrs,
  type SnClass,
  type SnPartSource,
  type SnStyle,
  resolveSnClass,
} from 'ashen-ui/core';
import { SN_AVATAR_GROUP } from './avatar-group-token';

const AVATAR_RESERVED_ATTRS: Readonly<Record<string, readonly string[]>> = {
  root: ['role', 'aria-label'],
  image: ['src', 'alt'],
  icon: ['aria-hidden'],
};

export type AvatarShape = 'circle' | 'square';
export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/** First letter of the first and last word, at most two characters. */
function toInitials(label: string): string {
  const words = label.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

/**
 * A user or entity thumbnail: an image, initials, or an icon.
 *
 * The three are a fallback chain, not alternatives. An `image` that fails to
 * load falls back to the initials taken from `label`, and a `label` that yields
 * no initials falls back to the icon, so a broken avatar URL never leaves a
 * blank circle.
 *
 * ```html
 * <sn-avatar image="/u/12.jpg" label="Ada Lovelace" />
 * <sn-avatar label="Ada Lovelace" />
 * <sn-avatar icon="support_agent" shape="square" />
 * ```
 */
@Component({
  selector: 'sn-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, SnPart],
  hostDirectives: [SnPart],
  templateUrl: './avatar.html',
  providers: [{ provide: SN_PART_SOURCE, useExisting: forwardRef(() => Avatar) }],
  host: {
    class: 'sn-avatar',
    '[class.sn-avatar-sm]': 'effectiveSize() === "sm"',
    '[class.sn-avatar-lg]': 'effectiveSize() === "lg"',
    '[class.sn-avatar-xl]': 'effectiveSize() === "xl"',
    '[class.sn-avatar--square]': 'effectiveShape() === "square"',
    '[class.sn-avatar--overflowed]': 'overflowed()',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-size]': 'effectiveSize()',
    '[attr.data-sn-shape]': 'effectiveShape()',
    '[attr.role]': 'hostLabel() ? "img" : null',
    '[attr.aria-label]': 'hostLabel()',
  },
})
export class Avatar implements SnPartSource {
  readonly image = input('');
  /** Full name. Initials are derived from it, and it labels the avatar. */
  readonly label = input('');
  /** Initials to render instead of deriving them from `label`. */
  readonly initials = input('');
  /** Glyph for the last step of the fallback chain. Defaults to the registry's `user`. */
  readonly icon = input('');
  /** Overrides `label` for assistive technology, including the image's `alt`. */
  readonly alt = input<string>();
  /** Falls back to the enclosing group, then to `'md'`. */
  readonly size = input<AvatarSize>();
  /** Falls back to the enclosing group, then to `'circle'`. */
  readonly shape = input<AvatarShape>();
  readonly snClass = input<SnClass>();
  readonly snStyle = input<SnStyle>();
  readonly snAttrs = input<SnAttrs>();

  readonly reservedAttrs = (section: string): readonly string[] =>
    AVATAR_RESERVED_ATTRS[section] ?? [];

  private readonly group = inject(SN_AVATAR_GROUP, { optional: true });
  private readonly icons = inject(SnIconRegistry);
  protected readonly iconTpl = contentChild(IconTemplate);

  // Reset by every new `image`, so a fixed URL shows again.
  private readonly loadFailed = linkedSignal<string, boolean>({
    source: this.image,
    computation: () => false,
  });

  protected readonly effectiveSize = computed(() => this.size() ?? this.group?.size() ?? 'md');
  protected readonly effectiveShape = computed(
    () => this.shape() ?? this.group?.shape() ?? 'circle',
  );
  protected readonly overflowed = computed(() => this.group?.isOverflow(this) ?? false);

  protected readonly showImage = computed(() => !!this.image() && !this.loadFailed());
  protected readonly initialsText = computed(
    () => this.initials().trim().slice(0, 2).toUpperCase() || toInitials(this.label()),
  );
  protected readonly effectiveIcon = computed(() => this.icon() || this.icons.resolve('user'));

  protected readonly imageAlt = computed(() => this.alt() ?? this.label());

  // The image has its own alt text; labelling the host too would announce it twice.
  protected readonly hostLabel = computed(() =>
    this.showImage() ? null : (this.alt() || this.label() || null),
  );

  protected readonly snClassResolved = computed(() => resolveSnClass(this.snClass(), 'root', true));
  protected readonly imageClassExtra = computed(() => resolveSnClass(this.snClass(), 'image', false));
  protected readonly initialsClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'initials', false),
  );
  protected readonly iconClassExtra = computed(() => resolveSnClass(this.snClass(), 'icon', false));

  protected onImageError(): void {
    this.loadFailed.set(true);
  }
}
