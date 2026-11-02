import { InjectionToken, Signal } from '@angular/core';

export interface SelectButtonContext {
  readonly isDisabled: Signal<boolean>;
  isSelected: (value: unknown) => boolean;
  toggle: (value: unknown) => void;
  onTouched: () => void;
}

export const SN_SELECT_BUTTON = new InjectionToken<SelectButtonContext>('SN_SELECT_BUTTON');
