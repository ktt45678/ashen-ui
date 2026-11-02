import { InjectionToken, type Signal } from '@angular/core';
import type { AvatarShape, AvatarSize } from './avatar';

/** What an `sn-avatar` can read from the group it sits in. */
export interface AvatarGroupContext {
  readonly size: Signal<AvatarSize>;
  readonly shape: Signal<AvatarShape>;
  /** True once the avatar is past the group's `max`. */
  isOverflow(avatar: unknown): boolean;
}

/**
 * Provided by `sn-avatar-group`, injected optionally by `sn-avatar`.
 *
 * It lives here rather than in `avatar-group.ts` because the group queries for
 * `Avatar` and the avatar reads the group, which would otherwise be a cycle.
 */
export const SN_AVATAR_GROUP = new InjectionToken<AvatarGroupContext>('SN_AVATAR_GROUP');
