import { InjectionToken, Signal } from '@angular/core';

/**
 * Whether a listbox value counts as selected: a member of the array in multiple
 * mode, the value itself otherwise.
 *
 * One function rather than a rule spelled out at each place that needs it. An
 * option asks about `aria-selected`, a listbox asks to place the roving
 * tabindex, and the two disagreeing is invisible to everything except a test
 * written to catch exactly that.
 */
export function snIsListboxValueSelected(
  current: unknown,
  multiple: boolean,
  val: unknown,
): boolean {
  if (multiple) {
    return Array.isArray(current) && current.includes(val);
  }
  return current === val;
}

export interface ListboxContext {
  readonly value: Signal<unknown>;
  readonly multiple: Signal<boolean>;
  readonly isDisabled: Signal<boolean>;
  readonly checkbox?: Signal<boolean>;
  /** Draw a check mark after the label of a selected option. Off unless set. */
  readonly checkmark?: Signal<boolean>;
  /**
   * Selection as the host understands it. Leave it out to be matched against
   * `value` and `multiple`; provide it when the host owns selection some other
   * way, as MultiSelect does through its selection model.
   */
  isSelected?: (val: unknown) => boolean;
  toggle: (val: unknown) => void;
  getTabIndex: (option: unknown) => number;
  onTouched: () => void;
}

export const SN_LISTBOX = new InjectionToken<ListboxContext>('SN_LISTBOX');
