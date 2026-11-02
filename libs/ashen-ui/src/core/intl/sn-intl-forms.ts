import { Injectable } from '@angular/core';

/**
 * Text for the select family: `sn-select`, `sn-multi-select`,
 * `sn-cascade-select`, `sn-tree-select`.
 *
 * Their "nothing found" text comes from {@link SnCommonIntl.emptyMessage}.
 */
@Injectable({ providedIn: 'root' })
export class SnSelectIntl {
  placeholder = 'Select…';
  clear = 'Clear selection';
}

/** Text for `sn-listbox`. */
@Injectable({ providedIn: 'root' })
export class SnListboxIntl {
  /** Fallback `aria-label`, used only when neither `ariaLabel` nor `ariaLabelledby` is set. */
  label = 'Options';
}

/** Text for `sn-input-password`, including the strength meter. */
@Injectable({ providedIn: 'root' })
export class SnPasswordIntl {
  placeholder = 'Password';
  show = 'Show password';
  hide = 'Hide password';
  strengthWeak = 'Weak';
  strengthFair = 'Fair';
  strengthGood = 'Good';
  strengthStrong = 'Strong';
}

/** Text for `sn-input-tags`. */
@Injectable({ providedIn: 'root' })
export class SnInputTagsIntl {
  addTag = 'Add tag';
}

/** Text for `sn-chip`. */
@Injectable({ providedIn: 'root' })
export class SnChipIntl {
  /** `aria-label` of the remove button. */
  remove(label: string): string {
    return `Remove ${label}`;
  }
}
