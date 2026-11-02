import { InjectionToken } from '@angular/core';

export interface SnConfirmPopupContext {
  toggle(): void;
  close(): void;
}

export const SN_CONFIRM_POPUP = new InjectionToken<SnConfirmPopupContext>('SN_CONFIRM_POPUP');
