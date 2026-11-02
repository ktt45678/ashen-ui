import { InjectionToken } from '@angular/core';

export interface SnPopoverContext {
  toggle(): void;
  close(): void;
}

export const SN_POPOVER = new InjectionToken<SnPopoverContext>('SN_POPOVER');
