import { InjectionToken, Signal } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

export interface StepperContext {
  readonly activeStep: Signal<number>;
  readonly linear: Signal<boolean>;
  selectStep: (index: number) => void;
  focusStep: (stepId: string) => void;
  indexOf: (step: FocusableOption) => number;
}

export const SN_STEPPER = new InjectionToken<StepperContext>('SN_STEPPER');
