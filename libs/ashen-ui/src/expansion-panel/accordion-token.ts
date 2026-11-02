import { InjectionToken, Signal } from '@angular/core';

export interface AccordionContext {
  readonly multiple: Signal<boolean>;
  requestExpand: (panelId: string) => void;
  registerPanel: (panelId: string, collapse: () => void) => void;
  unregisterPanel: (panelId: string) => void;
}

export const SN_ACCORDION = new InjectionToken<AccordionContext>('SN_ACCORDION');
