import { InjectionToken, Signal } from '@angular/core';
import { SplitterPanel } from './splitter-panel';

export interface SplitterContext {
  readonly size: Signal<number>;
  readonly layout: Signal<'horizontal' | 'vertical'>;
  readonly firstPanelId: string;
  getPanelOrder: (panel: SplitterPanel) => number;
  isFirstPanel: (panel: SplitterPanel) => boolean;
}

export const SN_SPLITTER = new InjectionToken<SplitterContext>('SN_SPLITTER');
