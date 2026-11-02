import { InjectionToken, Signal } from '@angular/core';

export interface TabsContext {
  readonly selectedIndex: Signal<number>;
  selectTab: (index: number) => void;
  focusTab: (tabId: string) => void;
  registerTab: (tabId: string, buttonId: string) => void;
  unregisterTab: (tabId: string) => void;
}

export const SN_TABS = new InjectionToken<TabsContext>('SN_TABS');
