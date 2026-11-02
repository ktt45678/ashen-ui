import { InjectionToken, Signal } from '@angular/core';

export interface TimelineContext {
  readonly isLast: (item: unknown) => Signal<boolean>;
}

export const SN_TIMELINE = new InjectionToken<TimelineContext>('SN_TIMELINE');
