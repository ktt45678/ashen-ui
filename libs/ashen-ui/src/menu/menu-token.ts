import { InjectionToken, type Signal } from '@angular/core';

export interface SnMenuContext {
  close(): void;
  isClosing?: Signal<boolean>;
}

export const SN_MENU = new InjectionToken<SnMenuContext>('SN_MENU');
