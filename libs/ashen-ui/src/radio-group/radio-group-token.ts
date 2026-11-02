import { InjectionToken, Signal } from '@angular/core';

export interface RadioGroupContext {
  readonly value: Signal<unknown>;
  readonly isDisabled: Signal<boolean>;
  readonly name: Signal<string>;
  select: (v: unknown) => void;
  navigate: (fromRadio: unknown, direction: 1 | -1) => void;
  getTabIndex: (radio: unknown) => number;
  onTouched: () => void;
}

export const SN_RADIO_GROUP = new InjectionToken<RadioGroupContext>('SN_RADIO_GROUP');
