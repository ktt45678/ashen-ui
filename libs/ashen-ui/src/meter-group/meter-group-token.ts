import { InjectionToken, Signal } from '@angular/core';

export interface MeterGroupContext {
  readonly max: Signal<number>;
}

export const SN_METER_GROUP = new InjectionToken<MeterGroupContext>('SN_METER_GROUP');
