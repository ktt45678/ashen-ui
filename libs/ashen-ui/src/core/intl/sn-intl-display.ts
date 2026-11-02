import { Injectable } from '@angular/core';

/** Text for `sn-avatar-group`. */
@Injectable({ providedIn: 'root' })
export class SnAvatarIntl {
  /** `aria-label` of the overflow counter. */
  more(count: number): string {
    return `${count} more`;
  }
}
