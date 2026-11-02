import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { SnAvatarIntl, type SnClass, resolveSnClass } from 'ashen-ui/core';
import { Avatar, type AvatarShape, type AvatarSize } from './avatar';
import { SN_AVATAR_GROUP, type AvatarGroupContext } from './avatar-group-token';

/**
 * Overlapping stack of avatars, with a counter for the ones past `max`.
 *
 * `size` and `shape` set here apply to every avatar in the stack; an avatar
 * that sets its own wins.
 *
 * ```html
 * <sn-avatar-group [max]="3" size="lg">
 *   <sn-avatar label="Ada Lovelace" />
 *   <sn-avatar label="Grace Hopper" />
 *   <sn-avatar label="Alan Turing" />
 *   <sn-avatar label="Katherine Johnson" />
 * </sn-avatar-group>
 * ```
 */
@Component({
  selector: 'sn-avatar-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar-group.html',
  providers: [{ provide: SN_AVATAR_GROUP, useExisting: forwardRef(() => AvatarGroup) }],
  host: {
    class: 'sn-avatar-group',
    '[class]': 'snClassResolved()',
    '[attr.data-sn-size]': 'size()',
  },
})
export class AvatarGroup implements AvatarGroupContext {
  /** Avatars to show before the counter takes over. `0` shows them all. */
  readonly max = input(0, { transform: numberAttribute });
  readonly size = input<AvatarSize>('md');
  readonly shape = input<AvatarShape>('circle');
  /** Overrides the counter's `aria-label`. */
  readonly moreAriaLabel = input<string>();
  readonly snClass = input<SnClass>();

  private readonly intl = inject(SnAvatarIntl);
  private readonly avatars = contentChildren(Avatar);

  protected readonly overflowCount = computed(() => {
    const max = this.max();
    return max > 0 ? Math.max(0, this.avatars().length - max) : 0;
  });

  protected readonly moreLabel = computed(
    () => this.moreAriaLabel() ?? this.intl.more(this.overflowCount()),
  );

  protected readonly snClassResolved = computed(() => resolveSnClass(this.snClass(), 'root', true));
  protected readonly counterClassExtra = computed(() =>
    resolveSnClass(this.snClass(), 'counter', false),
  );

  isOverflow(avatar: Avatar): boolean {
    const max = this.max();
    return max > 0 && this.avatars().indexOf(avatar) >= max;
  }
}
